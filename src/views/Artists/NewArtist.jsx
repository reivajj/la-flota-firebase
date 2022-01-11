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
  createArtistRedux, saveAddingArtistName, saveAddingArtistBiography, saveAddingArtistImagenUrl,
  saveAddingArtistId, updateArtistRedux, saveAddingArtistSpotifyUri, saveAddingArtistAppleId
} from '../../redux/actions/ArtistsActions';
import { to, toWithOutError } from '../../utils';

import SaveIcon from '@mui/icons-material/Save';
import ProgressButtonWithInputFile from "components/CustomButtons/ProgressButtonWithInputFile";
import { v4 as uuidv4 } from 'uuid';
import ProgressButton from 'components/CustomButtons/ProgressButton';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Image } from 'mui-image';
import { manageAddImageToStorage } from "services/StorageServices";
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';

const NewArtist = ({ editing }) => {

  const dispatch = useDispatch();
  const { artistId } = useParams();
  const navigate = useNavigate();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserId = useSelector(store => store.userData.id);
  const currentArtistData = useSelector(store => store.artists.addingArtist);
  const [currentArtistEditingData] = useSelector(store => store.artists.artists).filter(artist => artist.id === artistId);

  let artistDataToShow = editing ? currentArtistEditingData : currentArtistData;

  const changeArtistId = () => dispatch(saveAddingArtistId(uuidv4()));
  const putArtistIdOnEditingArtist = () => dispatch(saveAddingArtistId(currentArtistEditingData.id));

  useEffect(() => {
    if (!editing) changeArtistId();
    else putArtistIdOnEditingArtist();
  }, [])

  const [photoFile, setPhotoFile] = useState("");

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("No es obligatoria la imagen");

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
    changeArtistImagenUrl("");
    setMessage("");
    let [errorAddingFile, urlAndFile] = await to(manageAddImageToStorage(event.target.files[0], artistDataToShow.id, 'artistsPhotos', 5242880, setMessage, setProgress));
    if (errorAddingFile) {
      console.log("Error adding file", errorAddingFile);
      return;
    }
    setPhotoFile(urlAndFile.file);
    changeArtistImagenUrl(urlAndFile.url);
    setProgress(0);
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
  const changeSpotifyUri = spotifyUri => dispatch(saveAddingArtistSpotifyUri(spotifyUri));
  const changeAppleId = appleId => dispatch(saveAddingArtistAppleId(appleId));

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={12} md={6}>
        <Card>

          <CardHeader color="primary">
            <Typography sx={cardTitleWhiteStyles}>Crear Artista</Typography>
          </CardHeader>

          <CardBody>
            <Grid container spacing={2} sx={{ textAlign: "center", paddingTop: `${editing ? "2em" : "0"}` }}>

              {!editing &&
                <Grid item xs={12}>
                  <ProgressButtonWithInputFile
                    textButton={(progress === 100 || artistDataToShow.imagenUrl) ? "Cambiar Imagen" : "Imagen"}
                    loading={progress > 0 && !artistDataToShow.imagenUrl}
                    buttonState={!artistDataToShow.imagenUrl ? "none" : "success"}
                    onClickHandler={onClickAddImage}
                    progress={progress}
                    fileType={"image/*"} />

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
                <TextFieldWithInfo
                  name="name"
                  required
                  fullWidth
                  label="Nombre del Artista"
                  autoFocus
                  value={(editing && !nameEdited) ? artistDataToShow.name : currentArtistData.name}
                  onChange={changeArtistName}
                  validatorProps={{ restrictions: 'required|max:50', message: "Debes ingresar un nombre.", validator: simpleValidator }}
                />
              </Grid>

              {!editing &&
                <Grid item xs={12}>
                  <TextFieldWithInfo
                    name="spotify_uri"
                    fullWidth
                    label="Spotify Uri"
                    value={currentArtistData.spotify_uri}
                    onChange={changeSpotifyUri}
                  />
                </Grid>}

              {!editing &&
                <Grid item xs={12}>
                  <TextFieldWithInfo
                    name="apple_id"
                    fullWidth
                    label="Apple ID"
                    value={currentArtistData.apple_id}
                    onChange={changeAppleId}
                    helperText="Si tenes el Apple ID del perfil de Artista donde queres que subamos la música, ingresalo. 
                    Podes encontrarla en tu perfil en iTunes (son los últimos dígitos de la URL de tu perfil)."
                  />
                </Grid>}

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  id="bio"
                  name="bio"
                  label="Breve Biografía (max 500 caracteres)"
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
