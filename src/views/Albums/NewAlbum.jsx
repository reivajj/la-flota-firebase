import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";


import { Grid, MenuItem, TextField, Typography, CircularProgress, Fab } from '@mui/material';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import SimpleReactValidator from "simple-react-validator";
import { createAlbumRedux, updateAddingAlbumRedux } from "redux/actions/AlbumsActions";
import { v4 as uuidv4 } from 'uuid';

import useForceUpdate from 'components/Varios/ForceUpdate.js';
import ProgressButtonWithInputFile from 'components/CustomButtons/ProgressButtonWithInputFile';
import SelectDateInputDDMMYYYY from "components/DatesInput/SelectDateInputDDMMYYYY";
import { languages } from 'services/DatosVarios';
import { allFugaGenres } from "variables/genres";
import TracksTable from "components/Table/TracksTable";
import { trackActions, NewTrackDialog } from "views/Tracks/NewTrackDialog";
import { uploadAllTracksToAlbum } from "redux/actions/TracksActions";
import CheckIcon from '@mui/icons-material/Check';
import { green } from '@mui/material/colors';

import ProgressButton from "components/CustomButtons/ProgressButton";
import { Save } from '@mui/icons-material/';

import { toWithOutError, to, errorFormat } from "utils";
import { manageAddImageToStorage } from "services/StorageServices";


const NewAlbum = ({ editing }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserData = useSelector(store => store.userData);
  const currentUserId = currentUserData.id;
  const currentAlbumData = useSelector(store => store.albums.addingAlbum);
  const myArtists = useSelector(store => store.artists.artists);
  const myLabels = useSelector(store => store.labels.labels);
  const myTracks = useSelector(store => store.tracks.uploadingTracks);

  // aca deberia tener guardado la cantidad de albumes en el userDoc, y de artists, y labels.
  const cantAlbumsFromUser = 1;

  useEffect(() => {
    setTracksDataTable(getTracksAsDataTable(myTracks) || [[]]);
  }, [myTracks])

  const changeAlbumId = () => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, id: uuidv4() }));
  const putAlbumIdOnEditingArtist = () => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, id: currentAlbumData.id }));


  useEffect(() => {
    if (!editing) changeAlbumId();
    else putAlbumIdOnEditingArtist();
  }, [])

  const trackUploadProgress = progressTrack => {
    return (
      progressTrack < 100
        ? <CircularProgress variant="determinate" value={progressTrack} size={24} />
        : <Fab aria-label="uploadSucces" color="primary" sx={buttonSuccessStyle} component="span">
          <CheckIcon size={24} />
        </Fab>
    )
  }

  const getTracksAsDataTable = tracksTotalInfo => {
    return tracksTotalInfo.map(trackWithAllInfo => [
      `${trackWithAllInfo.position}`,
      `${trackWithAllInfo.title}`,
      `${trackWithAllInfo.isrc}`,
      `${trackWithAllInfo.other_artists}`,
      "NO",
      `${trackWithAllInfo.track_language}`,
      `${trackWithAllInfo.explicit === 0 ? "NO" : "SI"}`,
      trackActions(),
      trackUploadProgress(trackWithAllInfo.progress),
    ]);
  }

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [tracksDataTable, setTracksDataTable] = useState(getTracksAsDataTable(myTracks) || [[]]);
  const [imageReference, setImageReference] = useState('');
  const [openNewTrackDialog, setOpenNewTrackDialog] = useState(false);

  const [openLoader, setOpenLoader] = useState(false);
  const [buttonState, setButtonState] = useState("none");
  const [buttonText, setButtonText] = useState("Finalizar");

  const [trackData, setTrackData] = useState({
    disc_number: cantAlbumsFromUser, explicit: 0,
    position: tracksDataTable.length + 1, title: "", track: "",
    price: "", lyrics: "", isrc: "", track_language: "",
    other_artists: "", composers: "", producers: "", primary_artist: "",
    artistId: "", progress: 0
  });

  // Poner un msj de error correspondiente si no esta el COVER!
  const allFieldsValidCreateAlbum = () => {
    if (simpleValidator.current.allValid() && currentAlbumData.cover) {
      createAlbum();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate();
    }
  }

  const createAlbum = async () => {
    setOpenLoader(true);
    let albumDataFromFuga = await toWithOutError(dispatch(createAlbumRedux(currentAlbumData, currentUserId)));
    // let [errorCreatingTracks] = await to(dispatch(uploadAllTracksToAlbum(myTracks, albumDataFromFuga.id, albumDataFromFuga.fugaId, currentUserId)));
    setOpenLoader(false);
    if (albumDataFromFuga === "ERROR") {
      setButtonState("error");
      setButtonText("Error");
    }
    // navigate(-1);
  }

  const onClickAddImage = async (event) => {
    setMessage("");
    let [errorAddingFile, urlAndFile] = await to(manageAddImageToStorage(event.target.files[0], currentAlbumData.id, 'covers', 1048576 * 10, setMessage, setProgress));
    if (errorAddingFile) {
      console.log("Error adding file", errorAddingFile);
      return;
    }
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, imagenUrl: urlAndFile.url, cover: urlAndFile.file }));
    setImageReference(urlAndFile.storageRef);
  }

  const handleNotAddImage = () => {
    imageReference ? (
      imageReference.delete()
        .then(() => navigate(-1))
        .catch(error => console.log("Dio ERROR: ", error)))
      : navigate(-1);
  };

  const getArtistIdFromName = artistName => myArtists.filter(artist => artist.name === artistName)[0].fugaId;

  const handlerArtistChoose = event => {
    const artistFugaId = getArtistIdFromName(event.target.value);
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, nombreArtist: event.target.value, artistFugaId }));
    setTrackData({ ...trackData, primary_artist: event.target.value, artistFugaId });
  };

  const getLabelIdFromName = labelName => myLabels.filter(label => label.name === labelName)[0].fugaId;

  const handlerLabelChoose = event => {
    const labelFugaId = getLabelIdFromName(event.target.value);
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, label_name: event.target.value, labelFugaId }));
  }
  const handlerAlbumTitle = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, title: event.target.value }));
  const handlerPYearChoose = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, p_year: event.target.value }));
  const handlerPLineChoose = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, p_line: event.target.value }));
  const handlerCYearChoose = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, c_year: event.target.value }));
  const handlerCLineChoose = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, c_line: event.target.value }));
  const handlerDayOfMonth = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, dayOfMonth: event.target.value }));
  const handlerMonth = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, month: event.target.value }));
  const handlerYear = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, year: event.target.value }));
  const handlerLanguageChoose = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, language: event.target.value }));
  const handlerGenreChoose = event => {
    setTrackData({ ...trackData, genre: event.target.value });
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, genre: event.target.value }));
  }

  return (
    <Grid container spacing={2} style={{ textAlign: "center" }}>
      <Card style={{ alignItems: "center" }} >

        <Grid item xs={12}>
          <CardHeader color="primary" style={{ width: "70em" }}>
            <Typography sx={cardTitleWhiteStyles}>Crear Lanzamiento</Typography>
            <p sx={cardCategoryWhiteStyles}>Completa con los datos del Lanzamiento</p>
          </CardHeader>
        </Grid>

        <Grid container item xs={12} paddingTop={4}>

          <Grid item xs={12} >
            <Typography variant="h3">Información General</Typography>
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="nombreArtist"
              sx={textFieldStyle}
              autoFocus
              id="nombreArtist"
              required
              margin="normal"
              select
              label="Artista"
              value={currentAlbumData.nombreArtist}
              onChange={handlerArtistChoose}
              helperText="Selecciona al Artista, si es que ya lo tienes en el sistema. Si no, primero debés crear un Artista."
            >
              {myArtists.map((artist) => (
                <MenuItem key={artist.id} value={artist.name}>
                  {artist.name}
                </MenuItem>
              ))}
              {simpleValidator.current.message('nombreArtist', currentAlbumData.nombreArtist, 'required', {
                className: 'text-danger',
                messages: { default: "Debes seleccionar al Artista del Nuevo Lanzamiento." },
                element: (message) => errorFormat(message)
              })}
            </TextField>

            <TextField
              name="title"
              sx={textFieldStyle}
              id="title"
              required
              margin="normal"
              label="Título del Lanzamiento"
              value={currentAlbumData.title}
              onChange={handlerAlbumTitle}
              helperText="No pueden ir nombres de Productores, Compositores, Artistas invitados (feat.), 
            etc. Se completan más adelante en los campos correspondientes."
            />
            {simpleValidator.current.message('title', currentAlbumData.title, 'required|max:50', {
              className: 'text-danger',
              messages: { default: "Debes ingresar el Título del Lanzamiento." },
              element: (message) => errorFormat(message)
            })}

            <TextField
              name="label_name"
              sx={textFieldStyle}
              id="label_name"
              required
              margin="normal"
              select
              label="Sello Discográfico"
              value={currentAlbumData.label_name}
              onChange={handlerLabelChoose}
              helperText="Selecciona el sello discográfico."
            >
              {myLabels.map(label => (
                <MenuItem key={label.name} value={label.name}>
                  {label.name}
                </MenuItem>
              ))}
            </TextField>
            {simpleValidator.current.message('label_name', currentAlbumData.label_name, 'required|max:50', {
              className: 'text-danger',
              messages: { default: "Debes seleccionar un sello para el Lanzamiento." },
              element: (message) => errorFormat(message)
            })}

          </Grid>

          <Grid item xs={6}>
            <ProgressButtonWithInputFile
              textButton={progress === 100 ? "Cambiar Tapa" : "Arte de Tapa"}
              loading={progress > 0 && progress < 100}
              buttonState={progress < 100 ? "none" : "success"}
              onClickHandler={onClickAddImage}
              progress={progress} />

            <div className="alert alert-light" role="alert">
              {message}
            </div>

            {!currentAlbumData.imagenUrl && (
              <Grid>
                <SkeletonTheme color="antiquewhite" >
                  <Skeleton variant="rectangular" width={250} height={220} />
                </SkeletonTheme>
              </Grid>
            )}

            {currentAlbumData.imagenUrl && (
              <Grid >
                <img
                  style={{ width: 250, height: 220 }}
                  alt={""}
                  src={currentAlbumData.imagenUrl}
                />
              </Grid>
            )}
          </Grid>
        </Grid>


        {/* <Grid item xs={6}>
        <Divider variant="fullWidth" style={{ position: "inherit", height: "3px", backgroundColor: "darkslateblue" }} absolute={true} />
      </Grid> */}

        <Grid container item xs={12}>
          <Grid item xs={6}>
            <TextField
              sx={textFieldStyle}
              name="p_year"
              id="p_year"
              required
              margin="normal"
              select
              label="(P) Año de Publicación"
              value={currentAlbumData.p_year}
              onChange={handlerPYearChoose}
              helperText="Año en que esta grabación del Álbum/Single fue publicada por primera vez."
            >
              {Array.from({ length: 30 }, (x, i) => 2021 - i).map(year => (
                <MenuItem key={year + "p_year"} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
            {simpleValidator.current.message('p_year', currentAlbumData.p_year, 'required', {
              className: 'text-danger',
              messages: { default: "Debes seleccionar un año de publicación del Lanzamiento." },
              element: (message) => errorFormat(message)
            })}

            <TextField
              name="p_line"
              sx={textFieldStyle}
              id="p_line"
              required
              margin="normal"
              label="Publicador (Publisher)"
              value={currentAlbumData.p_line}
              onChange={handlerPLineChoose}
              helperText="El dueño de los Derechos de Publicación de esta grabación.
          → Ej. 1: Fito Paez | Ej. 2: Sony Music"
            />
            {simpleValidator.current.message('p_line', currentAlbumData.p_line, 'required|max:50', {
              className: 'text-danger',
              messages: { default: "Por favor indicá el publicador del lanzamiento." },
              element: (message) => errorFormat(message)
            })}

          </Grid>

          <Grid item xs={6}>
            <TextField
              name="c_year"
              sx={textFieldStyle}
              id="c_year"
              required
              margin="normal"
              select
              label="(C) Año de Copyright"
              value={currentAlbumData.c_year}
              onChange={handlerCYearChoose}
              helperText="Año en que el Álbum/Single fue publicado por primera vez."
            >
              {Array.from({ length: 30 }, (x, i) => 2021 - i).map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
            {simpleValidator.current.message('c_year', currentAlbumData.c_year, 'required', {
              className: 'text-danger',
              messages: { default: "Debes seleccionar un año de publicación del Lanzamiento." },
              element: (message) => errorFormat(message)
            })}

            <TextField
              name="c_line"
              sx={textFieldStyle}
              id="c_line"
              required
              margin="normal"
              label="Copyright"
              value={currentAlbumData.c_line}
              onChange={handlerCLineChoose}
              helperText="El dueño de los Derechos de Autor.
          → Si tu lanzamiento contiene Covers debes agregar el nombre de los autores originales acá (Por ej.: Luis Alberto Spinetta)."
            >
            </TextField>
            {simpleValidator.current.message('c_line', currentAlbumData.c_line, 'required|max:50', {
              className: 'text-danger',
              messages: { default: "Por favor indicá el dueño de los derechos de autor del lanzamiento." },
              element: (message) => errorFormat(message)
            })}

          </Grid>
        </Grid>

        <Grid container item xs={12} paddingTop={4}>
          <Grid item xs={12}>
            <Typography variant="h3">Fecha del Lanzamiento</Typography>
          </Grid>

          <SelectDateInputDDMMYYYY dayValue={currentAlbumData.dayOfMonth} monthValue={currentAlbumData.month} yearValue={currentAlbumData.year}
            setDayOfMonth={handlerDayOfMonth} setMonth={handlerMonth} setYear={handlerYear} simpleValidator={simpleValidator} />

          <Grid container item spacing={2} xs={12} justifyContent="center" paddingTop={4}>

            <Grid item xs={12}>
              <Typography variant="h3">Idioma y Género</Typography>
            </Grid>

            <Grid item xs={3}>
              <TextField
                name="language"
                fullWidth
                id="language"
                required
                margin="normal"
                select
                label="Idioma Principal del Lanzamiento"
                value={currentAlbumData.language}
                onChange={handlerLanguageChoose}
              >
                {languages.map(language => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={3}>
              <TextField
                name="generosMusicales"
                id="generosMusicales"
                fullWidth
                required
                margin="normal"
                select
                label="Género Musical Principal"
                value={currentAlbumData.genre}
                onChange={handlerGenreChoose}
              >
                {allFugaGenres.map(genre => (
                  <MenuItem key={genre.id} value={genre.name}>
                    {genre.name}
                  </MenuItem>
                ))}
              </TextField>

            </Grid>

          </Grid>
        </Grid>

        <Grid container item xs={12} paddingTop={4} justifyContent="center">

          <Grid item xs={12}>
            <Typography variant="h3">Canciones del Lanzamiento</Typography>
          </Grid>

          <Grid item xs={12} style={{ textAlign: '-moz-center' }}>
            <p style={{ width: '800px', textAlign: 'justify' }}>
              Agregá los Tracks de tu Lanzamiento!
              <br />Completá todos los datos de las canciones con cuidado, exactamente como quieras que se vean en las tiendas.
              <br />Respetá minúsculas, mayúsculas y acentos en los títulos.
              <br />En el nombre de la canción no pueden ir productores, artistas invitados (feat.), etc. Cada uno debe ir en el campo correspondiente.
            </p>
          </Grid>

          <Grid item xs={8}>
            <TracksTable tracksTableData={tracksDataTable} handleClickAddTrack={() => setOpenNewTrackDialog(true)} />
          </Grid>

        </Grid>

        <Grid item xs={12}>
          <NewTrackDialog openDialog={openNewTrackDialog} setOpenNewTrackDialog={setOpenNewTrackDialog} setTracksDataTable={setTracksDataTable}
            tracksDataTable={tracksDataTable} trackData={trackData} setTrackData={setTrackData} circularProgress={(progress) => trackUploadProgress(progress)} />
        </Grid>

        <Grid item xs={12} paddingTop={4}>
          <CardFooter style={{ display: 'inline-flex' }}>
            <ProgressButton
              textButton={buttonText}
              loading={openLoader}
              buttonState={buttonState}
              onClickHandler={createAlbum}
              noneIcon={<Save sx={{ color: "rgba(255,255,255, 1)" }} />}
              noFab={false} />
          </CardFooter>
        </Grid>
      </Card >

    </Grid >
  );
}

export default NewAlbum;

const textFieldStyle = {
  width: "500px"
}

const buttonSuccessStyle = {
  backgroundColor: green[500],
  '&:hover': {
    backgroundColor: green[700],
  },
  width: "35px",
  height: "35px"
}

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

{/* <Grid item xs={12} style={{ textAlign: '-moz-center' }}>
        <p style={{ width: '800px', textAlign: 'justify' }}>
          Elegí la fecha en la que querés que este lanzamiento sea publicado en las tiendas. Si elegís la fecha de hoy, o mañana, no significa que tu lanzamiento va a estar disponible inmediatamente. Se procesará con la fecha que seleccionaste pero según la demanda, los lanzamientos pueden demorar hasta 1-2 días en aprobarse y procesarse, a la vez las tiendas tienen tiempos variables, y por último puede haber errores o que necesitemos corregir aspectos de tu lanzamiento.
          <br />Por lo que: Si es muy importante que tu álbum se publique en una fecha exacta del futuro (por ej, para una campaña promocional), recomendamos trabajar y seleccionar una fecha con al menos 14 días de anticipación, en la cual podemos asegurarte que estará disponible en la mayoría de las tiendas principales a la vez.
          <br />Si es tu primer lanzamimport {CircularProgress} from '@mui/material/CircularProgress';
          iento (y aún no tenés perfilimport MyAlbums from './MyAlbums';
 en las tiendas) recomendamos que elijimport TracksTable from '../../components/Table/TracksTable';
as una fecha de acá a 5-7 días en el fimport { Fab } from '@mui/material/Fab';
uturo para que tu perfil se cree correimport firebaseApp from '../../firebaseConfig/firebase';
ctamente.import { SaveIcon } from '@mui/icons-material/Save';
import { AddCircleOutlineIcon } from '@mui/icons-material/AddCircleOutline';

        </p>
      </Grid> */}