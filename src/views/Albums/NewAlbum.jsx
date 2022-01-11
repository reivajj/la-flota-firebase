import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";


import { Grid, Typography, CircularProgress, Fab, IconButton, Tooltip, Button } from '@mui/material';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import SimpleReactValidator from "simple-react-validator";
import { createAlbumRedux, updateAddingAlbumRedux, updateNameOtherArtistsAlbumRedux, updateSpotifyUriOtherArtistsAlbumRedux } from "redux/actions/AlbumsActions";
import { v4 as uuidv4 } from 'uuid';

import useForceUpdate from 'components/Varios/ForceUpdate.js';
import ProgressButtonWithInputFile from 'components/CustomButtons/ProgressButtonWithInputFile';
import SelectDateInputDDMMYYYY from "components/DatesInput/SelectDateInputDDMMYYYY";
import { allFugaGenres } from "variables/genres";
import TracksTable from "components/Table/TracksTable";
import { trackActions, NewTrackDialog } from "views/Tracks/NewTrackDialog";
import { uploadAllTracksToAlbum } from "redux/actions/TracksActions";
import CheckIcon from '@mui/icons-material/Check';
import { green } from '@mui/material/colors';

import ProgressButton from "components/CustomButtons/ProgressButton";
import { Save, Info } from '@mui/icons-material/';

import { toWithOutError, to } from "utils";
import { manageAddImageToStorage } from "services/StorageServices";
import { Image as ReactImage } from 'mui-image';
import { languages } from "variables/varias";
import TextFieldWithInfo from "components/TextField/TextFieldWithInfo";
import InfoDialog from "components/Dialogs/InfoDialog";
import BasicCheckbox from "components/Checkbox/BasicCheckbox";
import InfoIcon from '@mui/icons-material/Info';

const publicationDateWarning = [<Typography >
  Elegí la fecha en la que querés que este lanzamiento sea publicado en las tiendas. Si elegís la fecha de hoy, o mañana, no significa que tu lanzamiento va a estar disponible inmediatamente. Se procesará con la fecha que seleccionaste pero según la demanda, los lanzamientos pueden demorar hasta 1-2 días en aprobarse y procesarse, a la vez las tiendas tienen tiempos variables, y por último puede haber errores o que necesitemos corregir aspectos de tu lanzamiento.
  <br />Por lo que: Si es muy importante que tu álbum se publique en una fecha exacta del futuro (por ej, para una campaña promocional), recomendamos trabajar y seleccionar una fecha con al menos 14 días de anticipación, en la cual podemos asegurarte que estará disponible en la mayoría de las tiendas principales a la vez.
  <br />Si es tu primer lanzamimport {updateNameOtherArtistsAlbumRedux} from '../../redux/actions/AlbumsActions';
  iento (y aún no tenés perfil en las tiendas) recomendamos que elijas una fecha de acá a 5-7 días en el futuro para que tu perfil se cree correctamente.
</Typography>];

const lanzamientoColaborativoTooltip = "Seleccioná si el lanzamiento pertenece a dos o más artistas";

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
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openColaborativo, setOpenColaborativo] = useState(false);


  const [trackData, setTrackData] = useState({
    disc_number: cantAlbumsFromUser, explicit: 0,
    position: tracksDataTable.length + 1, title: "", track: "",
    price: "", lyrics: "", isrc: "", track_language: "",
    other_artists: "", composers: "", producers: "", primary_artist: "",
    artistId: "", progress: 0, allOtherArtists: []
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
    if (albumDataFromFuga === "ERROR") {
      setButtonState("error");
      setButtonText("Error");
    }
    else {
      let responseTracksFromFuga = await toWithOutError(dispatch(uploadAllTracksToAlbum(myTracks, albumDataFromFuga.id, albumDataFromFuga.fugaId, currentUserId)));
      setOpenLoader(false);
      if (responseTracksFromFuga === "ERROR") {
        setButtonState("error");
        setButtonText("Error");
      }
    }
    setOpenLoader(false);
    // navigate(-1);
  }

  const onClickAddImage = async (event) => {
    // if (event.target.files[0])
    let img = new Image()
    img.src = window.URL.createObjectURL(event.target.files[0])
    img.onload = async () => {
      console.log(img.width + " " + img.height);
      if (img.width >= 1400 && img.height >= 1400) {
        setMessage("");
        let [errorAddingFile, urlAndFile] = await to(manageAddImageToStorage(event.target.files[0], currentAlbumData.id, 'covers', 1048576 * 10, setMessage, setProgress));
        if (errorAddingFile) {
          console.log("Error adding file", errorAddingFile);
          return;
        }
        dispatch(updateAddingAlbumRedux({ ...currentAlbumData, imagenUrl: urlAndFile.url, cover: urlAndFile.file }));
        setImageReference(urlAndFile.storageRef);
      }
      else setMessage("La imagen debe tener una resolucion mínima de 1400x1400");
    }
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

  const addOneArtistSkeleton = () => {
    let artist = { name: "", spotify_uri: "" };
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, allOtherArtists: [...currentAlbumData.allOtherArtists, artist] }));
    setTrackData({ ...trackData, allOtherArtists: [...currentAlbumData.allOtherArtists, artist] });
  }

  const deleteAllOtherArtists = () => {
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, allOtherArtists: [] }));
    setTrackData({ ...trackData, allOtherArtists: [] });
  }

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

  const handlerAddNameToOtherArtists = (nameValue, otherArtistIndex) => {
    dispatch(updateNameOtherArtistsAlbumRedux(nameValue, otherArtistIndex));
  }

  const handlerAddSpotifyUri = (spotifyUri, otherArtistIndex) => {
    dispatch(updateSpotifyUriOtherArtistsAlbumRedux(spotifyUri, otherArtistIndex));
  }

  const handleOnChangeCheckBox = (event) => {
    if (event.target.checked) addOneArtistSkeleton();
    else deleteAllOtherArtists();
  }

  const yearsArray = Array.from({ length: 30 }, (x, i) => 2021 - i);

  return (
    <Grid container style={{ textAlign: "center" }}>
      <Card style={{ alignItems: "center" }} >

        <Grid item xs={12}>
          <CardHeader color="primary" style={{ width: "70em" }}>
            <Typography sx={cardTitleWhiteStyles}>Crear Lanzamiento</Typography>
          </CardHeader>
        </Grid>

        <Grid container item xs={12} paddingTop={4} >

          <Grid container item xs={12} justifyContent="center" textAlign="center">
            <Grid item xs={12}>
              <ProgressButtonWithInputFile
                textButton={(progress === 100 && currentAlbumData.imagenUrl) ? "Cambiar Tapa" : "Arte de Tapa"}
                loading={progress > 0 && !currentAlbumData.imagenUrl}
                buttonState={progress < 100 ? "none" : "success"}
                onClickHandler={onClickAddImage}
                progress={progress}
                fileType={"image/*"}
                helperText="El arte de tapa debe ser una imagen de alta calidad.
                El archivo debe ser JPG colores RGB de mínimo 1400*1400px (si necesitás ayuda consultá a tu diseñador o avisanos y te recomendamos diseñadores que trabajan con nosotros)." />

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
                  <ReactImage
                    style={{ width: 250, height: 220, borderRadius: 40 }}
                    alt="album-image"
                    duration={30}
                    src={currentAlbumData.imagenUrl}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid container item xs={12} >

            <Grid item xs={12}>
              <TextFieldWithInfo
                name="nombreArtist"
                sx={textFieldStyle}
                autoFocus
                required
                select
                label="Artista Principal"
                error={false}
                value={currentAlbumData.nombreArtist}
                onChange={handlerArtistChoose}
                helperText="Selecciona al Artista Principal, si es que ya lo tienes en el sistema. Si no, primero debés crear un Artista."
                selectItems={myArtists}
                selectKeyField="id"
                selectValueField="name"
                validatorProps={{ restrictions: 'required', message: "Debes seleccionar al Artista del Nuevo Lanzamiento.", validator: simpleValidator }}
              />
            </Grid>

            <Grid container item xs={12}>
              <Grid item xs={7} textAlign="end">
                <BasicCheckbox
                  label={"Es un lanzamiento colaborativo"}
                  onChecked={handleOnChangeCheckBox}
                  checked={openColaborativo || currentAlbumData.allOtherArtists.length > 0}
                />
              </Grid>
              <Grid item xs={1}>
                <Tooltip title={lanzamientoColaborativoTooltip} >
                  <IconButton
                    edge="end">
                    {<InfoIcon />}
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>

          {currentAlbumData.allOtherArtists[0] &&
            <Grid container item xs={12} >

              <Grid item xs={6}>
                <TextFieldWithInfo
                  name="nombreSecondArtist"
                  sx={textFieldStyle}
                  label="Nombre Segundo Artista "
                  value={currentAlbumData.allOtherArtists[0].name}
                  onChange={(event) => handlerAddNameToOtherArtists(event.target.value, 0)}
                  helperText="Ingresá el nombre → Debe coincidir 100% como aparece en las DSPs. "
                />
              </Grid>

              <Grid item xs={6}>
                <TextFieldWithInfo
                  name="spotifyUriSecondArtist"
                  sx={textFieldStyle}
                  label="Codigo Uri de Spotify"
                  value={currentAlbumData.allOtherArtists[0].spotify_uri}
                  onChange={(event) => handlerAddSpotifyUri(event.target.value, 0)}
                  helperText="Ingresá el código URi de Spotify. "
                />
              </Grid>
            </Grid>}

          {currentAlbumData.allOtherArtists[1] &&
            <Grid container item xs={12} >

              <Grid item xs={6}>
                <TextFieldWithInfo
                  name="nombreSecondArtist"
                  sx={textFieldStyle}
                  label="Nombre Segundo Artista "
                  value={currentAlbumData.allOtherArtists[1].name}
                  onChange={(event) => handlerAddNameToOtherArtists(event.target.value, 1)}
                  helperText="Ingresá el nombre → Debe coincidir 100% como aparece en las DSPs. "
                />
              </Grid>

              <Grid item xs={6}>
                <TextFieldWithInfo
                  name="spotifyUriSecondArtist"
                  sx={textFieldStyle}
                  label="Codigo Uri de Spotify"
                  value={currentAlbumData.allOtherArtists[1].spotify_uri}
                  onChange={(event) => handlerAddSpotifyUri(event.target.value, 1)}
                  helperText="Ingresá el código URi de Spotify. "
                />
              </Grid>
            </Grid>}

          {currentAlbumData.allOtherArtists.length > 0 &&
            <Grid item xs={12}>
              <Button variant="contained" color="secondary" onClick={addOneArtistSkeleton}>
                Agregar Artista
              </Button>
            </Grid>}

          <Grid container item xs={12}>
            <Grid item xs={6}>
              <TextFieldWithInfo
                name="title"
                sx={textFieldStyle}
                id="title"
                required
                margin="normal"
                label="Título del Lanzamiento"
                value={currentAlbumData.title}
                onChange={handlerAlbumTitle}
                validatorProps={{ restrictions: 'required|max:50', message: "Debes ingresar el Título del Lanzamiento.", validator: simpleValidator }}
              />
            </Grid>


            <Grid item xs={6}>
              <TextFieldWithInfo
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
                selectItems={myLabels}
                selectKeyField="name"
                selectValueField="name"
                validatorProps={{ restrictions: 'required|max:50', message: "Debes seleccionar un sello para el Lanzamiento.", validator: simpleValidator }}
              />
            </Grid>
          </Grid>

        </Grid>


        {/* <Grid item xs={6}>
        <Divider variant="fullWidth" style={{ position: "inherit", height: "3px", backgroundColor: "darkslateblue" }} absolute={true} />
      </Grid> */}

        <Grid container item xs={12}>
          <Grid item xs={6}>
            <TextFieldWithInfo
              sx={textFieldStyle}
              name="p_year"
              required
              select
              label="(P) Año de Publicación"
              value={currentAlbumData.p_year}
              onChange={handlerPYearChoose}
              helperText="Año en que esta grabación del Álbum/Single fue publicada por primera vez."
              selectItems={yearsArray}
              validatorProps={{ restrictions: 'required|numeric', message: "Debes seleccionar un año de publicación del Lanzamiento.", validator: simpleValidator }}
            />

            <TextFieldWithInfo
              name="p_line"
              sx={textFieldStyle}
              required
              label="Publicador (Publisher)"
              value={currentAlbumData.p_line}
              onChange={handlerPLineChoose}
              helperText="El dueño de los Derechos de Publicación de esta grabación.
            → Ej. 1: Fito Paez | Ej. 2: Sony Music"
              validatorProps={{ restrictions: 'required|max:50', message: "Por favor indicá el publicador del lanzamiento.", validator: simpleValidator }}
            />

          </Grid>

          <Grid item xs={6}>
            <TextFieldWithInfo
              name="c_year"
              sx={textFieldStyle}
              required
              select
              label="(C) Año de Copyright"
              value={currentAlbumData.c_year}
              onChange={handlerCYearChoose}
              helperText="Año en que el Álbum/Single fue publicado por primera vez."
              selectItems={yearsArray}
              validatorProps={{ restrictions: 'required|numeric', message: "Debes seleccionar un año de publicación del Lanzamiento.", validator: simpleValidator }}
            />

            <TextFieldWithInfo
              name="c_line"
              sx={textFieldStyle}
              required
              label="Copyright"
              value={currentAlbumData.c_line}
              onChange={handlerCLineChoose}
              helperText="El dueño de los Derechos de Autor.
              → Si tu lanzamiento contiene Covers debes agregar el nombre de los autores originales acá (Por ej.: Luis Alberto Spinetta)."
              validatorProps={{ restrictions: 'required|max:50', message: "Por favor indicá el dueño de los derechos de autor del lanzamiento.", validator: simpleValidator }}
            />

          </Grid>
        </Grid>

        <Grid container item xs={12} paddingTop={3} justifyContent="center">
          <Grid container item xs={3}>
            <Grid item xs={9} textAlign="end">
              <Typography variant="h5">Fecha del Lanzamiento</Typography>
            </Grid>

            <Grid item xs={2}>
              {/* <Tooltip title={publicationDateWarning} > */}
              <IconButton
                aria-label={"info-publication-date"}
                edge="start"
                onClick={() => setOpenInfoDialog(true)}
              >
                {<Info />}
              </IconButton>
              {/* </Tooltip> */}
            </Grid>
          </Grid>

          <SelectDateInputDDMMYYYY dayValue={currentAlbumData.dayOfMonth} monthValue={currentAlbumData.month} yearValue={currentAlbumData.year}
            setDayOfMonth={handlerDayOfMonth} setMonth={handlerMonth} setYear={handlerYear} simpleValidator={simpleValidator} />

          <Grid container item spacing={2} xs={12} justifyContent="center" paddingTop={3}>
            <Grid item xs={12}>
              <Typography variant="h5">Idioma y Género</Typography>
            </Grid>

            <Grid item xs={3}>
              <TextFieldWithInfo
                name="language"
                fullWidth
                required
                select
                label="Idioma Principal del Lanzamiento"
                value={currentAlbumData.language}
                onChange={handlerLanguageChoose}
                selectItems={languages}
              />
            </Grid>

            <Grid item xs={3}>
              <TextFieldWithInfo
                name="generosMusicales"
                id="generosMusicales"
                fullWidth
                required
                margin="normal"
                select
                label="Género Musical Principal"
                value={currentAlbumData.genre}
                onChange={handlerGenreChoose}
                selectItems={allFugaGenres}
                selectKeyField="id"
                selectValueField="name"
              />
            </Grid>

          </Grid>
        </Grid>

        <Grid container item xs={12} paddingTop={4} justifyContent="center">

          {/* <Grid item xs={12} style={{ textAlign: '-moz-center' }}>
            <p style={{ width: '800px', textAlign: 'justify' }}>
              Agregá los Tracks de tu Lanzamiento!
              <br />Completá todos los datos de las canciones con cuidado, exactamente como quieras que se vean en las tiendas.
              <br />Respetá minúsculas, mayúsculas y acentos en los títulos.
            </p>
          </Grid> */}

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
              onClickHandler={allFieldsValidCreateAlbum}
              noneIcon={<Save sx={{ color: "rgba(255,255,255, 1)" }} />}
              noFab={false} />
          </CardFooter>
        </Grid>
      </Card >

      <InfoDialog isOpen={openInfoDialog} handleClose={() => setOpenInfoDialog(false)} title="Fecha de Lanzamiento" contentTexts={publicationDateWarning} />
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