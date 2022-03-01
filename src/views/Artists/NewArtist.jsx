import React, { useState, useRef, useEffect } from "react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { TextField, Grid, Typography, Button } from "@mui/material";

import SimpleReactValidator from "simple-react-validator";
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  createArtistRedux, saveAddingArtistName, saveAddingArtistBiography,
  saveAddingArtistId, updateArtistRedux, saveAddingArtistSpotifyUri, saveAddingArtistAppleId, saveAddingArtistImagenUrlAndReference, updateAddingArtistRedux, artistsAttachFugaIdToArtistDoc
} from '../../redux/actions/ArtistsActions';
import { to, toWithOutError } from '../../utils';

import SaveIcon from '@mui/icons-material/Save';
import { v4 as uuidv4 } from 'uuid';
import ProgressButton from 'components/CustomButtons/ProgressButton';
import { manageAddImageToStorage } from "services/StorageServices";
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import { useForceUpdate } from 'utils';
import ImageInput from 'components/Input/ImageInput';
import { AddMoreArtistsInAlbumDialog } from 'components/Dialogs/AddMoreArtistsInAlbumDialog';
import { infoSpotifyUri, maxArtistsText } from "utils/textToShow.utils";
import { infoHelperTextAppleId } from '../../utils/textToShow.utils';
import SuccessDialog from "components/Dialogs/SuccessDialog";
import InfoDialog from '../../components/Dialogs/InfoDialog';
import { userIsAdmin } from "utils/users.utils";

const NewArtist = ({ editing, isOpen, handleClose, view }) => {

  const dispatch = useDispatch();
  const { artistId } = useParams();
  const navigate = useNavigate();
  const validator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUser = useSelector(store => store.userData);
  const rol = currentUser.rol;
  const plan = currentUser.plan;
  const currentUserId = currentUser.id;
  const artistsFromStore = useSelector(store => store.artists.artists);
  const currentArtistData = useSelector(store => store.artists.addingArtist);
  const [currentArtistEditingData] = artistsFromStore.filter(artist => artist.id === artistId);

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
  // const [imageReference, setImageReference] = useState('');
  const cannotAddArtists = !editing && (plan === "charly-garcia" && artistsFromStore.length > 1);

  const [openMaxArtistsDialog, setOpenMaxArtistsDialog] = useState(cannotAddArtists);
  const [openLoader, setOpenLoader] = useState(false);
  const [buttonState, setButtonState] = useState("none");
  const [buttonText, setButtonText] = useState("Finalizar");
  const [creatingArtistState, setCreatingArtistState] = useState("none");

  const [biographyEdited, setBiographyEdited] = useState(false);
  const [nameEdited, setNameEdited] = useState(false);
  const [spotifyUriEdited, setSpotifyUriEdited] = useState(false);
  const [appleIdEdited, setAppleIdEdited] = useState(false);
  const [ownerEmailEdited, setOwnerEmailEdited] = useState(false);
  const [fugaIdEdited, setFugaIdEdited] = useState(false);
  // const [spotifyUriInvalid, setSpotifyUriInvalid] = useState(false);

  const allFieldsValidCreateArtist = () => {
    if (validator.current.allValid()) {
      createArtist();
    } else {
      validator.current.showMessages();
      forceUpdate();
    }
  }

  const createArtist = async () => {
    console.log(currentArtistData);
    setOpenLoader(true);
    let result = "ERROR";
    if (currentArtistData.fugaId) {
      result = await toWithOutError(dispatch(artistsAttachFugaIdToArtistDoc(currentArtistData, currentUserId, currentArtistData.ownerEmail)));
    }
    else {
      result = await toWithOutError(dispatch(
        editing
          ? updateArtistRedux(currentArtistEditingData, currentArtistData, currentArtistEditingData.fugaId, photoFile, currentArtistData.ownerEmail,
            { apple_id: appleIdEdited, spotify_uri: spotifyUriEdited, name: nameEdited, biography: biographyEdited })
          : createArtistRedux(userIsAdmin(rol), currentArtistData, currentUserId, userIsAdmin(rol) ? currentArtistData.ownerEmail : currentUser.email, "artists", "totalArtists")));
    }
    if (result === "SUCCESS") {
      setButtonState("success");
      setOpenLoader(false);
      (view !== "dialog") ? setCreatingArtistState("success") : handleClose();
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

  const changeArtistOwnerEmail = event => {
    if (editing && !ownerEmailEdited) setOwnerEmailEdited(true);
    dispatch(updateAddingArtistRedux({ ...artistDataToShow, ownerEmail: event.target.value }));
  }

  const changeArtistFugaId = event => {
    if (editing && !fugaIdEdited) setFugaIdEdited(true);
    dispatch(updateAddingArtistRedux({ ...artistDataToShow, fugaId: event.target.value }));
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
    changeSpotifyUri, imageInput, progressButton, cannotAddArtists
  };

  return (
    <>
      {view === "dialog"
        ? <AddMoreArtistsInAlbumDialog {...propsToAddArtistDialog} />

        : <Grid container justifyContent="center">
          <Grid item xs={12} sm={12} md={6}>

            <SuccessDialog isOpen={creatingArtistState === "success"} title={`Artista ${editing ? "editado" : "creado"}!`} contentTexts={[[`El artista fue ${editing ? "editado" : "generado"} con éxito.`]]}
              handleClose={() => navigate('/admin/artists')} successImageSource="/images/successArtists.jpg" />

            {!cannotAddArtists
              ? <Card>

                <CardHeader color="primary">
                  <Typography sx={cardTitleWhiteStyles}>{editing ? "Editar Artista" : "Crear Artista"}</Typography>
                </CardHeader>

                <CardBody>
                  <Grid container spacing={2} sx={{ textAlign: "center", paddingTop: `${editing ? "2em" : "0"}` }}>

                    {!editing && imageInput}

                    {userIsAdmin(rol) && <Grid item xs={12}>
                      <TextFieldWithInfo
                        name="email"
                        required
                        fullWidth
                        label="Email del dueño del Artista"
                        autoFocus
                        value={(editing && !ownerEmailEdited) ? artistDataToShow.ownerEmail || "" : currentArtistData.ownerEmail || ""}
                        onChange={changeArtistOwnerEmail}
                        validatorProps={{ restrictions: 'max:100', message: "Debes ingresar un email.", validator: validator }}
                      />
                    </Grid>}

                    {userIsAdmin(rol) && <Grid item xs={12}>
                      <TextFieldWithInfo
                        name="fugaId"
                        required
                        fullWidth
                        label="Fuga Id del Artista"
                        autoFocus
                        value={(editing && !fugaIdEdited) ? artistDataToShow.fugaId || "" : currentArtistData.fugaId || ""}
                        onChange={changeArtistFugaId}
                        validatorProps={{ restrictions: 'max:50', message: ".", validator: validator }}
                      />
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
                        validatorProps={{ restrictions: 'required|max:100', message: "Debes ingresar un nombre.", validator: validator }}
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
                        validatorProps={{
                          restrictions: [{ regex: '^(spotify:artist:)([a-zA-Z0-9]+)$' }, { max: 37 }, { min: 37 }],
                          message: "El formato del Spotify Uri es inválido. (Formato: spotify:artist:2ERtLJTrO8RXGMAEYOJeQc)", validator
                        }}
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
                        validatorProps={{ restrictions: 'max:30|numeric', message: "El Apple ID es un código númerico que no contiene letras.", validator: validator }}
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
              : <InfoDialog isOpen={openMaxArtistsDialog} handleClose={() => setOpenMaxArtistsDialog(false)}
                title={"No puedes agregar más Artistas"} contentTexts={maxArtistsText} />
            }
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