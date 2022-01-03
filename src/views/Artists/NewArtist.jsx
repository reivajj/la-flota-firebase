import React, { useState, useRef } from "react";
// import InputLabel from "@mui/material/InputLabel";
// core components
// import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
// import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { TextField, Grid, Typography } from "@mui/material";

import SimpleReactValidator from "simple-react-validator";
import useForceUpdate from 'components/Varios/ForceUpdate.js';
import Danger from 'components/Typography/Danger.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createArtistRedux } from '../../redux/actions/ArtistsActions';
import { to } from '../../utils';

import firebaseApp from "firebaseConfig/firebase.js";
import SaveIcon from '@mui/icons-material/Save';
import ProgressButtonWithInputFile from "components/CustomButtons/ProgressButtonWithInputFile";
import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ProgressButton from 'components/CustomButtons/ProgressButton';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { createTheme } from '@mui/material/styles';
import { Image } from 'mui-image';
import { manageAddImageToStorage } from "services/StorageServices";

const theme = createTheme();

let errorFormat = (message) => (
  <Danger color="error" variant="h6">{message}</Danger>
)

const storage = getStorage(firebaseApp);

const NewArtist = () => {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserId = useSelector(store => store.userData.id);

  const [artistData, setArtistData] = useState({ name: "", biography: "", imagenUrl: "", photo: "" });

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("No es obligatoria la imagen para el Artista");

  const [openLoader, setOpenLoader] = useState(false);
  const [buttonState, setButtonState] = useState("none");
  const [buttonText, setButtonText] = useState("Finalizar");

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
    let [errorCreatingArtist, result] = await to(dispatch(createArtistRedux(artistData, currentUserId)));
    console.log("LO QUE VUELVE EN NEW ARTIST:", { errorCreatingArtist, result });
    if (result === "SUCCESS") navigate('/admin/artists');
    else {
      setButtonState("error");
      setButtonText("Error");
      setOpenLoader(false);
    }
  }

  const onClickAddImage = async (event) => {
    setMessage("");
    let [errorAddingFile, urlAndFile] = await to(manageAddImageToStorage(event.target.files[0], 'artistsPhotos', 5242880, setMessage, setProgress));
    if (errorAddingFile) {
      console.log("Error adding file", errorAddingFile);
      return;
    }
    setArtistData({ ...artistData, imagenUrl: urlAndFile.url, photo: urlAndFile.file });
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={12} md={8}>
        <Card sx={{ width: "60em" }}>

          <CardHeader color="primary">
            <Typography sx={cardTitleWhiteStyles}>Crear Artista</Typography>
            <p sx={cardCategoryWhiteStyles}>Completa con los Datos del Artista</p>
          </CardHeader>

          <CardBody>
            <Grid container spacing={2} sx={{ textAlign: "center" }}>
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

                {!artistData.imagenUrl && (
                  <Grid>
                    <SkeletonTheme color="antiquewhite" >
                      <Skeleton circle width={250} height={250} />
                    </SkeletonTheme>
                  </Grid>
                )}

                {artistData.imagenUrl && (
                  <Grid >
                    <Image
                      style={{ width: 250, height: 220, borderRadius: 40 }}
                      alt="artist-image"
                      duration={30}
                      src={artistData.imagenUrl}
                    />
                  </Grid>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Nombre del Artista"
                  autoFocus
                  value={artistData.name}
                  onChange={evento => setArtistData({ ...artistData, name: evento.target.value })}
                />
                {simpleValidator.current.message('name', artistData.name, 'required|max:50', {
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
                  label="Breve Biografía del Artista (max 300 caracteres)"
                  fullWidth
                  value={artistData.biography}
                  multiline={true}
                  inputProps={{ maxLength: 300 }}
                  maxRows="3"
                  onChange={(evento) => setArtistData({ ...artistData, biography: evento.target.value })} />
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
                noneIcon={<SaveIcon sx={{ color: "rgba(255,255,255, 1)" }} />} />
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
