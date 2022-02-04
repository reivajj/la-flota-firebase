import React, { useState, useRef, useEffect } from "react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { TextField, Grid, Typography } from "@mui/material";

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

const NewArtistDialog = ({ editing }) => {

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
  const [imageReference, setImageReference] = useState('');

  const [openLoader, setOpenLoader] = useState(false);
  const [buttonState, setButtonState] = useState("none");
  const [buttonText, setButtonText] = useState("Finalizar");

  const [biographyEdited, setBiographyEdited] = useState(false);
  const [nameEdited, setNameEdited] = useState(false);
  const [spotifyUriEdited, setSpotifyUriEdited] = useState(false);
  const [appleIdEdited, setAppleIdEdited] = useState(false);

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
        : createArtistRedux(currentArtistData, currentUserId, "artists", "totalArtists")));
    if (result === "SUCCESS") {
      setButtonState("success");
      navigate('/admin/artists');
    }
    else {
      setButtonState("error");
      setButtonText("Error");
      setOpenLoader(false);
    }
  }

  const onClickAddImage = async (event) => {
    changeArtistImagenUrlAndReference("");
    setMessage("");
    let img = new Image()
    img.src = window.URL.createObjectURL(event.target.files[0])
    img.onload = async () => {
      if (img.width >= 200 && img.height >= 200) {
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
                <ImageInput imagenUrl={artistDataToShow.imagenUrl} onClickAddImage={onClickAddImage} textButton="Imagen"
                  progress={progress} message={message} helperText="El arte de tapa debe ser una imagen de alta calidad.
                  El archivo debe ser JPG colores RGB de mínimo 1400*1400px"/>}

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

              <Grid item xs={12}>
                <TextFieldWithInfo
                  name="spotify_uri"
                  fullWidth
                  label="Spotify Uri"
                  value={(editing && !spotifyUriEdited) ? artistDataToShow.spotify_uri : currentArtistData.spotify_uri}
                  onChange={changeSpotifyUri}
                />
              </Grid>

              <Grid item xs={12}>
                <TextFieldWithInfo
                  name="apple_id"
                  fullWidth
                  label="Apple ID"
                  value={(editing && !appleIdEdited) ? artistDataToShow.apple_id : currentArtistData.apple_id}
                  onChange={changeAppleId}
                  helperText="Si tenes el Apple ID del perfil de Artista donde queres que subamos la música, ingresalo. 
                    Podes encontrarla en tu perfil en iTunes (son los últimos dígitos de la URL de tu perfil)."
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

export default NewArtistDialog;

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
