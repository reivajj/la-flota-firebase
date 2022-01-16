import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";


import { Grid, Typography, CircularProgress, Fab } from '@mui/material';
import SimpleReactValidator from "simple-react-validator";
import { createAlbumRedux, updateAddingAlbumRedux } from "redux/actions/AlbumsActions";
import { v4 as uuidv4 } from 'uuid';

import SelectDateInputDDMMYYYY from "components/Input/SelectDateInputDDMMYYYY";
import { allFugaGenres } from "variables/genres";
import TracksTable from "components/Table/TracksTable";
import { trackActions, NewTrackDialog } from "views/Tracks/NewTrackDialog";
import { uploadAllTracksToAlbum } from "redux/actions/TracksActions";
import CheckIcon from '@mui/icons-material/Check';
import { green } from '@mui/material/colors';

import ProgressButton from "components/CustomButtons/ProgressButton";
import { Save } from '@mui/icons-material/';

import { toWithOutError, to, useForceUpdate, publicationDateWarning } from "utils";
import { deleteFile, manageAddImageToStorage } from "services/StorageServices";
import { languages } from "variables/varias";
import TextFieldWithInfo from "components/TextField/TextFieldWithInfo";
import AddOtherArtistsAlbumForm from 'components/Forms/AddOtherArtistsAlbumForm';
import ImageInput from "components/Input/ImageInput";
import { createOtherArtistsInFuga } from '../../redux/actions/ArtistsInvitedActions';
import { updateAddingAlbumImageUrlAndCoverRedux } from '../../redux/actions/AlbumsActions';
import TypographyWithInfo from '../../components/Typography/TypographyWithInfo';
import { cloneDeepLimited } from '../../utils';
import CheckboxWithInfo from '../../components/Checkbox/CheckboxWithInfo';

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
  const artistsInvited = useSelector(store => store.artistsInvited);

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
      `${trackWithAllInfo.allOtherArtists.length > 0 ? "SI" : "NO"}`,
      `${trackWithAllInfo.track_language}`,
      `${trackWithAllInfo.explicit === 0 ? "NO" : "SI"}`,
      trackActions(),
      trackUploadProgress(trackWithAllInfo.progress),
    ]);
  }

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [tracksDataTable, setTracksDataTable] = useState(getTracksAsDataTable(myTracks) || [[]]);
  const [openNewTrackDialog, setOpenNewTrackDialog] = useState(false);

  const [openLoader, setOpenLoader] = useState(false);
  const [buttonState, setButtonState] = useState("none");
  const [buttonText, setButtonText] = useState("Finalizar");

  const [trackData, setTrackData] = useState({
    disc_number: cantAlbumsFromUser, explicit: 0,
    position: tracksDataTable.length + 1, title: "", track: "",
    price: "", lyrics: "", isrc: "", track_language: "",
    composers: "", producers: "", primary_artist: "",
    artistId: "", progress: 0, allOtherArtists: [], collaborators: [],
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
    // const otherPrimaryArtistsOfTheAlbumCreatedInFuga = await toWithOutError(dispatch(createOtherArtistsInFuga(currentAlbumData.allOtherArtists, currentUserId)))
    // if (otherPrimaryArtistsOfTheAlbumCreatedInFuga === "ERROR") {
    //   setButtonState("error"); setButtonText("Error"); setOpenLoader(false);
    //   return;
    // }

    let albumDataFromFuga = await toWithOutError(dispatch(createAlbumRedux(currentAlbumData, currentUserId, artistsInvited)));
    if (albumDataFromFuga === "ERROR") {
      setButtonState("error"); setButtonText("Error"); setOpenLoader(false);
      return;
    }

    // let responseTracksFromFuga = await toWithOutError(dispatch(uploadAllTracksToAlbum(myTracks, albumDataFromFuga.id, albumDataFromFuga.fugaId, currentUserId)));
    // if (responseTracksFromFuga === "ERROR") {
    //   setButtonState("error"); setButtonText("Error");
    // }

    setButtonState("success");
    setOpenLoader(false);
    // navigate(-1);
  }

  const onClickAddImage = async (event) => {
    updateAddingAlbumImageUrlAndCoverRedux({ imagenUrl: "", cover: "" });
    setMessage("");
    let img = new Image()
    img.src = window.URL.createObjectURL(event.target.files[0])
    img.onload = async () => {
      if (img.width >= 1400 && img.height >= 1400) {
        setMessage("");
        let [errorAddingFile, urlAndFile] = await to(manageAddImageToStorage(event.target.files[0], currentAlbumData.id, 'covers', 1048576 * 10, setMessage, setProgress));
        if (errorAddingFile) {
          setMessage("Ha ocurrido un error, por favor, intente nuevamente. ");
          return;
        }
        dispatch(updateAddingAlbumImageUrlAndCoverRedux({ imagenUrl: urlAndFile.url, cover: urlAndFile.file }));
      }
      else setMessage("La imagen debe tener una resolucion mínima de 1400x1400");
    }
  }

  const getArtistIdAndFugaIdFromName = artistName => {
    let artistResult = myArtists.filter(artist => artist.name === artistName)[0];
    return { artistFugaId: artistResult.fugaId, artistId: artistResult.id };
  }

  const handlerArtistChoose = event => {
    const { artistFugaId, artistId } = getArtistIdAndFugaIdFromName(event.target.value);
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, nombreArtist: event.target.value, artistFugaId, artistId }));
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
  const handlerPreOrderDayOfMonth = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, preOrderDayOfMonth: event.target.value }));
  const handlerPreOrderMonth = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, preOrderMonth: event.target.value }));
  const handlerPreOrderYear = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, preOrderYear: event.target.value }));
  const handlerLanguageChoose = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, language: event.target.value }));
  const handlerGenreChoose = event => {
    setTrackData({ ...trackData, genre: event.target.value });
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, genre: event.target.value }));
  }
  const handleCheckedPreOrder = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, preOrder: event.target.checked }));
  const handleCheckedPreview = event => dispatch(updateAddingAlbumRedux({ ...currentAlbumData, preview: event.target.checked }))
  const handleClickAddTrack = () => {
    let artistFromLaFlota = [{ name: currentAlbumData.nombreArtist, id: currentAlbumData.artistFugaId, primary: true }];
    let allOtherArtistsWithPrimary = cloneDeepLimited(currentAlbumData.allOtherArtists);

    setTrackData({ ...trackData, allOtherArtists: [...artistFromLaFlota, ...allOtherArtistsWithPrimary] })
    setOpenNewTrackDialog(true);
  }

  const yearsArray = Array.from({ length: 30 }, (x, i) => 2021 - i);

  return (
    <Grid container style={{ textAlign: "center" }}>
      <Card style={{ alignItems: "center" }} >

        <Grid item xs={12} sx={{ width: "60%" }}>
          <CardHeader color="primary">
            <Typography sx={cardTitleWhiteStyles}>Crear Lanzamiento</Typography>
          </CardHeader>
        </Grid>

        <Grid container item xs={12} paddingTop={4} >

          <ImageInput imagenUrl={currentAlbumData.imagenUrl} onClickAddImage={onClickAddImage} textButton="Arte de Tapa"
            progress={progress} message={message} helperText="El arte de tapa debe ser una imagen de alta calidad.
            El archivo debe ser JPG colores RGB de mínimo 1400*1400px (si necesitás ayuda consultá a tu diseñador o avisanos y te recomendamos diseñadores que trabajan con nosotros)."/>

          <Grid container item xs={12} >

            <Grid item xs={12}>
              <TextFieldWithInfo
                name="nombreArtist"
                sx={textFieldLaFlotaArtistStyle}
                autoFocus
                required
                select
                label="Artista Principal perteneciente a La Flota"
                value={currentAlbumData.nombreArtist}
                onChange={handlerArtistChoose}
                helperText="Selecciona al Artista Principal, si es que ya lo tienes en el sistema. Si no, primero debés crear un Artista."
                selectItems={myArtists}
                selectKeyField="id"
                selectValueField="name"
                validatorProps={{ restrictions: 'required', message: "Debes seleccionar al Artista del Nuevo Lanzamiento.", validator: simpleValidator }}
              />
            </Grid>
          </Grid>

          <AddOtherArtistsAlbumForm
            checkBoxLabel="¿Es un lanzamiento Colaborativo?"
            checkBoxHelper={lanzamientoColaborativoTooltip}
          />

          <Grid container item xs={12}>
            <Grid item xs={6}>
              <TextFieldWithInfo
                name="title"
                sx={textFieldStyle}
                required
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
                required
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
          </Grid>

          <Grid item xs={6}>
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
        </Grid>

        <Grid container item xs={12}>
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
          </Grid>

          <Grid item xs={6}>
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

          <TypographyWithInfo
            infoTooltip={"Presionar para más información"} infoDialog={publicationDateWarning} title="Fecha del Lanzamiento"
          />

          <SelectDateInputDDMMYYYY dayValue={currentAlbumData.dayOfMonth} monthValue={currentAlbumData.month} yearValue={currentAlbumData.year}
            setDayOfMonth={handlerDayOfMonth} setMonth={handlerMonth} setYear={handlerYear} simpleValidator={simpleValidator} />

          <CheckboxWithInfo
            label="Permitir Pre-Comprar antes del lanzamiento"
            checked={currentAlbumData.preOrder}
            onChecked={handleCheckedPreOrder}
            checkBoxHelper="Podés permitir que tus seguidores compren tu trabajo en iTunes, Amazon y Google Play antes de la fecha del lanzamiento
             (les llegará el álbum el día del lanzamiento). Es ideal para generar campañas de marketing alrededor de la fecha de lanzamiento. 
             Para que funcione debés elegir una fecha de inicio de Pre-Compra anterior a la fecha del lanzamiento que seleccionaste. La Fecha de 
             Lanzamiento debe ser de al menos 10 días en el futuro. Por ej: si la fecha de lanzamiento que seleccionaste es en 10 días desde hoy, el Pre-Order podría iniciar en 5 días desde hoy."
          />

          {currentAlbumData.preOrder &&
            <SelectDateInputDDMMYYYY dayValue={currentAlbumData.preOrderDayOfMonth} monthValue={currentAlbumData.preOrderMonth} yearValue={currentAlbumData.preOrderYear}
              setDayOfMonth={handlerPreOrderDayOfMonth} setMonth={handlerPreOrderMonth} setYear={handlerPreOrderYear} simpleValidator={simpleValidator} />
          }
          {currentAlbumData.preOrder &&
            <CheckboxWithInfo
              label="Habilitar Pre-Escucha para la Pre-Compra"
              checked={currentAlbumData.preview}
              onChecked={handleCheckedPreview}
              checkBoxHelper="Permitir que los usuarios escuchen un fragmento (30 segundos) de las canciones durante la etapa de Pre-Compra."
            />
          }

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
                fullWidth
                required
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

          <Grid item xs={8} >
            <TracksTable tracksTableData={tracksDataTable} handleClickAddTrack={handleClickAddTrack} />
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
              // onClickHandler={createAlbum}
              noneIcon={<Save sx={{ color: "rgba(255,255,255, 1)" }} />}
              noFab={false} />
          </CardFooter>
        </Grid>
      </Card >

    </Grid >
  );
}

export default NewAlbum;

const lanzamientoColaborativoTooltip = "Seleccioná si el lanzamiento pertenece a dos o más artistas";

const textFieldStyle = { width: "60%" };
const textFieldLaFlotaArtistStyle = { width: "40%" };

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
