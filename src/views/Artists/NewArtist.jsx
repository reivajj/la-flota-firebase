import React, { useState, useRef, useEffect } from "react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { TextField, Grid, Typography, Button } from "@mui/material";

import SimpleReactValidator from "simple-react-validator";
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createArtistRedux, saveAddingArtistName, saveAddingArtistBiography,
  saveAddingArtistId, updateArtistRedux, saveAddingArtistSpotifyUri, saveAddingArtistAppleId, saveAddingArtistImagenUrlAndReference
} from '../../redux/actions/ArtistsActions';
import { to, toWithOutError } from '../../utils';

import SaveIcon from '@mui/icons-material/Save';
import { v4 as uuidv4 } from 'uuid';
import ProgressButton from 'components/CustomButtons/ProgressButton';
import { deleteFile, manageAddImageToStorage } from "services/StorageServices";
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import { useForceUpdate } from 'utils';
import ImageInput from 'components/Input/ImageInput';
import { AddMoreArtistsInAlbumDialog } from 'components/Dialogs/AddMoreArtistsInAlbumDialog';
import { infoSpotifyUri } from "utils/textToShow.utils";
import { infoHelperTextAppleId } from '../../utils/textToShow.utils';

const NewArtist = ({ editing, isOpen, handleClose, view }) => {

  const dispatch = useDispatch();
  const { artistId } = useParams();
  const navigate = useNavigate();
  const validator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserId = useSelector(store => store.userData.id);
  const currentArtistData = useSelector(store => store.artists.addingArtist);
  const [currentArtistEditingData] = useSelector(store => store.artists.artists).filter(artist => artist.id === artistId);

  let artistDataToShow = editing ? currentArtistEditingData || currentArtistData : currentArtistData;

  const changeArtistId = () => dispatch(saveAddingArtistId(uuidv4()));
  const putArtistIdOnEditingArtist = () => dispatch(saveAddingArtistId(currentArtistEditingData.id));

  useEffect(() => {
    if (!editing) changeArtistId();
    else putArtistIdOnEditingArtist();
  }, [])

  const [photoFile, setPhotoFile] = useState("");

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("No es obligatoria la imagen");
  const [imageReference, setImageReference] = useState('');

  const [openLoader, setOpenLoader] = useState(false);
  const [buttonState, setButtonState] = useState("none");
  const [buttonText, setButtonText] = useState("Finalizar");

  const [biographyEdited, setBiographyEdited] = useState(false);
  const [nameEdited, setNameEdited] = useState(false);
  const [spotifyUriEdited, setSpotifyUriEdited] = useState(false);
  const [appleIdEdited, setAppleIdEdited] = useState(false);

  const allFieldsValidCreateArtist = () => {
    if (validator.current.allValid()) {
      createArtist();
    } else {
      validator.current.showMessages();
      forceUpdate();
    }
  }

  const createArtist = async () => {
    setOpenLoader(true);
    let result = await toWithOutError(dispatch(
      editing
        ? updateArtistRedux(currentArtistData, currentArtistEditingData.fugaId, photoFile, currentUserId)
        : createArtistRedux(currentArtistData, currentUserId, "artists", "totalArtists")));
    if (result === "SUCCESS") {
      setButtonState("success");
      (view !== "dialog") ? navigate('/admin/artists') : handleClose();
    }
    else {
      setButtonState("error");
      setButtonText("Error");
      setOpenLoader(false);
    }
  }

  const onClickAddImageArtist = async (event) => {
    changeArtistImagenUrlAndReference("");
    setMessage("");
    let img = new Image()
    img.src = window.URL.createObjectURL(event.target.files[0])
    img.onload = async () => {
      if (img.width >= 1400 && img.height >= 1400) {
        let [errorAddingFile, urlAndFile] = await to(manageAddImageToStorage(event.target.files[0], artistDataToShow.id, 'artistsPhotos', 5242880, setMessage, setProgress));
        if (errorAddingFile) {
          setMessage("Ha ocurrido un error, por favor, intente nuevamente. ");
          return;
        }
        setPhotoFile(urlAndFile.file);
        changeArtistImagenUrlAndReference(urlAndFile.url, urlAndFile.storageRef);

        setProgress(0);
      }
      else setMessage("La imagen debe tener una resolucion mínima de 1400x1400");
    }
  }

  const changeArtistName = event => {
    if (editing && !nameEdited) setNameEdited(true);
    dispatch(saveAddingArtistName(event.target.value));
  }

  const changeArtistBio = event => {
    if (editing && !biographyEdited) setBiographyEdited(true);
    dispatch(saveAddingArtistBiography(event.target.value));
  }

  const changeArtistImagenUrlAndReference = (imagenUrl, storageRef) => dispatch(saveAddingArtistImagenUrlAndReference(imagenUrl, storageRef));

  const changeSpotifyUri = event => {
    if (editing && !spotifyUriEdited) setSpotifyUriEdited(true);
    dispatch(saveAddingArtistSpotifyUri(event.target.value));
  }
  const changeAppleId = event => {
    if (editing && !appleIdEdited) setAppleIdEdited(true);
    dispatch(saveAddingArtistAppleId(event.target.value));
  }

  const imageInput = <ImageInput key={"artist-photo"} imagenUrl={artistDataToShow.imagenUrl} onClickAddImage={onClickAddImageArtist} textButton="Imagen"
    progress={progress} message={message} helperText="La imagen del Artista debe ser una imagen de alta calidad.
    La imagen debe ser cuadrada, JPG, colores RGB y de mínimo 1400*1400px"/>;

  const progressButton = <ProgressButton textButton={buttonText} loading={openLoader} buttonState={buttonState}
    onClickHandler={allFieldsValidCreateArtist} noneIcon={<SaveIcon sx={{ color: "rgba(255,255,255, 1)" }} />} noFab={false} />

  const title = "Agregar un Artista Principal";
  const propsToAddArtistDialog = {
    validator, isOpen, handleClose, title, changeArtistName, changeArtistBio, changeAppleId,
    changeSpotifyUri, imageInput, progressButton
  };

  return (
    <>
      {view === "dialog"
        ? <AddMoreArtistsInAlbumDialog {...propsToAddArtistDialog} />

        : <Grid container justifyContent="center">
          <Grid item xs={12} sm={12} md={6}>

            <Card>

              <CardHeader color="primary">
                <Typography sx={cardTitleWhiteStyles}>{editing ? "Editar Artista" : "Crear Artista"}</Typography>
              </CardHeader>

              <CardBody>
                <Grid container spacing={2} sx={{ textAlign: "center", paddingTop: `${editing ? "2em" : "0"}` }}>

                  {!editing && imageInput}

                  <Grid item xs={12}>
                    <TextFieldWithInfo
                      name="name"
                      required
                      fullWidth
                      label="Nombre del Artista"
                      autoFocus
                      value={(editing && !nameEdited) ? artistDataToShow.name : currentArtistData.name}
                      onChange={changeArtistName}
                      validatorProps={{ restrictions: 'required|max:50', message: "Debes ingresar un nombre.", validator: validator }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldWithInfo
                      name="spotifyUriSecondArtist"
                      fullWidth
                      label="Spotify Uri"
                      value={(editing && !spotifyUriEdited) ? artistDataToShow.spotify_uri : currentArtistData.spotify_uri}
                      onChange={changeSpotifyUri}
                      helperText={infoSpotifyUri}
                      hrefInfo="https://www.laflota.com.ar/spotify-for-artists/"
                      targetHref="_blank"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldWithInfo
                      name="apple_id"
                      fullWidth
                      label="Apple ID"
                      value={(editing && !appleIdEdited) ? artistDataToShow.apple_id : currentArtistData.apple_id}
                      onChange={changeAppleId}
                      helperText={infoHelperTextAppleId}
                    />
                  </Grid>

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
                  {progressButton}
                </Grid>
              </CardFooter>

            </Card>
          </Grid>
        </Grid>}
    </>
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