import React, { useState, useRef, useEffect } from "react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { TextField, Grid, Typography } from "@mui/material";

import SimpleReactValidator from "simple-react-validator";
import useForceUpdate from 'components/Varios/ForceUpdate.js';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createArtistRedux, saveAddingArtistName, saveAddingArtistBiography
  , saveAddingArtistImagenUrl, saveAddingArtistId, updateArtistRedux
} from '../../redux/actions/ArtistsActions';
import { to, errorFormat, toWithOutError } from '../../utils';

import SaveIcon from '@mui/icons-material/Save';
import ProgressButtonWithInputFile from "components/CustomButtons/ProgressButtonWithInputFile";
import { v4 as uuidv4 } from 'uuid';
import ProgressButton from 'components/CustomButtons/ProgressButton';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Image } from 'mui-image';
import { manageAddImageToStorage } from "services/StorageServices";

const NewArtist = ({ editing }) => {

  const dispatch = useDispatch();
  const { artistId } = useParams();
  console.log("ARTIST-ID: ", artistId);
  const navigate = useNavigate();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserId = useSelector(store => store.userData.id);
  const currentArtistData = useSelector(store => store.artists.addingArtist);
  const [currentArtistEditingData] = useSelector(store => store.artists.artists).filter(artist => artist.id === artistId);

  console.log("CURRENT ARTIST: ", currentArtistData);
  let artistDataToShow = editing ? currentArtistEditingData : currentArtistData;
  console.log("CURRENT ARTIST TO SHOW: ", artistDataToShow);
  console.log("EDITING:", editing);

  const changeArtistId = () => dispatch(saveAddingArtistId(uuidv4()));
  const putArtistIdOnEditingArtist = () => dispatch(saveAddingArtistId(currentArtistEditingData.id));

  useEffect(() => {
    if (!editing) changeArtistId();
    else putArtistIdOnEditingArtist();
  }, [])

  const [photoFile, setPhotoFile] = useState("");

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("No es obligatoria la imagen para el Artista");

  const [openLoader, setOpenLoader] = useState(false);
  const [buttonState, setButtonState] = useState("none");
  const [buttonText, setButtonText] = useState("Finalizar");

  const [biographyEdited, setBiographyEdited] = useState(false);
  const [nameEdited, setNameEdited] = useState(false);

  const allFieldsValidCreateArtist = () => {
    if (simpleValidator.current.allValid()) {
      createArtist();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate();
    }
  }

  const createArtist = async () => {
    setOpenLoader(true);
    let result = await toWithOutError(dispatch(
      editing
        ? updateArtistRedux(currentArtistData, currentArtistEditingData.fugaId, photoFile, currentUserId)
        : createArtistRedux(currentArtistData, photoFile, currentUserId)));
    if (result === "SUCCESS") navigate('/admin/artists');
    else {
      setButtonState("error");
      setButtonText("Error");
      setOpenLoader(false);
    }
  }

  const onClickAddImage = async (event) => {
    setMessage("");
    let [errorAddingFile, urlAndFile] = await to(manageAddImageToStorage(event.target.files[0], artistDataToShow.id, 'artistsPhotos', 5242880, setMessage, setProgress));
    if (errorAddingFile) {
      console.log("Error adding file", errorAddingFile);
      return;
    }
    setPhotoFile(urlAndFile.file);
    changeArtistImagenUrl(urlAndFile.url);
  }

  const changeArtistName = event => {
    if (editing && !nameEdited) setNameEdited(true);
    dispatch(saveAddingArtistName(event.target.value));
  }

  const changeArtistBio = event => {
    if (editing && !biographyEdited) setBiographyEdited(true);
    dispatch(saveAddingArtistBiography(event.target.value));
  }

  const changeArtistImagenUrl = imagenUrl => dispatch(saveAddingArtistImagenUrl(imagenUrl));

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={12} md={6}>
        <Card>

          <CardHeader color="primary">
            <Typography sx={cardTitleWhiteStyles}>Crear Artista</Typography>
            <p sx={cardCategoryWhiteStyles}>Completa con los Datos del Artista</p>
          </CardHeader>

          <CardBody>
            <Grid container spacing={2} sx={{ textAlign: "center", paddingTop: `${editing ? "2em" : "0"}` }}>

              {!editing &&
                <Grid item xs={12}>
                  <ProgressButtonWithInputFile
                    textButton={progress === 100 ? "Cambiar Imagen" : "Imagen del Artista"}
                    loading={progress > 0 && progress < 100}
                    buttonState={progress < 100 ? "none" : "success"}
                    onClickHandler={onClickAddImage}
                    progress={progress} />

                  <div className="alert alert-light" role="alert">
                    {message}
                  </div>

                  {!artistDataToShow.imagenUrl && (
                    <Grid>
                      <SkeletonTheme color="antiquewhite" >
                        <Skeleton circle width={250} height={250} />
                      </SkeletonTheme>
                    </Grid>
                  )}

                  {artistDataToShow.imagenUrl && (
                    <Grid >
                      <Image
                        style={{ width: 250, height: 220, borderRadius: 40 }}
                        alt="artist-image"
                        duration={30}
                        src={artistDataToShow.imagenUrl}
                      />
                    </Grid>
                  )}
                </Grid>}

              <Grid item xs={12}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Nombre del Artista"
                  autoFocus
                  value={(editing && !nameEdited) ? artistDataToShow.name : currentArtistData.name}
                  onChange={changeArtistName}
                />
                {simpleValidator.current.message('name', artistDataToShow.name, 'required|max:50', {
                  className: 'text-danger',
                  messages: { default: "Debes ingresar un nombre." },
                  element: (message) => errorFormat(message)
                })}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  id="bio"
                  name="bio"
                  label="Breve Biografía del Artista (max 500 caracteres)"
                  fullWidth
                  value={(editing && !biographyEdited) ? artistDataToShow.biography : currentArtistData.biography}
                  multiline={true}
                  inputProps={{ maxLength: 500 }}
                  maxRows="3"
                  onChange={changeArtistBio} />
              </Grid>
            </Grid>
          </CardBody>

          <CardFooter>
            <Grid justifyContent="center" container >
              <ProgressButton
                textButton={buttonText}
                loading={openLoader}
                buttonState={buttonState}
                onClickHandler={allFieldsValidCreateArtist}
                noneIcon={<SaveIcon sx={{ color: "rgba(255,255,255, 1)" }} />}
                noFab={false} />
            </Grid>
          </CardFooter>

        </Card>
      </Grid>
    </Grid>
  );
}

export default NewArtist;

const cardCategoryWhiteStyles = {
  color: "rgba(255,255,255,.62)",
  margin: "0",
  fontSize: "14px",
  marginTop: "0",
  marginBottom: "0"
}
const cardTitleWhiteStyles = {
  color: "rgba(255,255,255,255)",
  marginTop: "0px",
  minHeight: "auto",
  fontWeight: "300px",
  fontSize: "40px",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none"
}
