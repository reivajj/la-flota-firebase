import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import { Grid, Typography, CircularProgress, Fab, Button } from '@mui/material';
import SimpleReactValidator from "simple-react-validator";
import { createAlbumRedux, updateAddingAlbumRedux } from "redux/actions/AlbumsActions";
import { v4 as uuidv4 } from 'uuid';

import SelectDateInputDDMMYYYY from "components/Input/SelectDateInputDDMMYYYY";
import { allFugaGenres } from "variables/genres";
import TracksTable from "components/Table/TracksTable";
import { trackActions, NewTrackDialog } from "views/Tracks/NewTrackDialog";
import { deleteTrackInTracksUploading, editTrackInTracksUploading, uploadAllTracksToAlbumRedux } from "redux/actions/TracksActions";
import CheckIcon from '@mui/icons-material/Check';
import { green } from '@mui/material/colors';

import ProgressButton from "components/CustomButtons/ProgressButton";
import { Save, AddCircleOutline } from '@mui/icons-material/';
import { albumCoverHelperText, lanzamientoColaborativoTooltip, oldReleaseCheckBoxHelper, preSaleCheckBoxHelper, releaseDateInfoTooltip } from '../../utils/textToShow.utils';
import { toWithOutError, to, useForceUpdate } from "utils";
import { manageAddImageToStorage } from "services/StorageServices";
import TextFieldWithInfo from "components/TextField/TextFieldWithInfo";
import AddOtherArtistsAlbumForm from 'components/Forms/AddOtherArtistsAlbumForm';
import ImageInput from "components/Input/ImageInput";
import { createOtherArtistsRedux } from '../../redux/actions/ArtistsInvitedActions';
import { updateAddingAlbumImageUrlAndCoverRedux } from '../../redux/actions/AlbumsActions';
import TypographyWithInfo from '../../components/Typography/TypographyWithInfo';
import CheckboxWithInfo from '../../components/Checkbox/CheckboxWithInfo';
import { createCollaboratorsRedux } from "redux/actions/CollaboratorsActions";
import { languagesFuga } from '../../variables/varias';
import TextFieldWithInfoImage from '../../components/TextField/TextFieldWithInfoImage';
import NewArtist from 'views/Artists/NewArtist';
import { getAllOtherArtistsFromAlbumAndTrack, artistsWithUniqueName } from '../../utils/artists.utils';
import { editAction } from "views/Tracks/NewTrackDialog";
import { deleteAction } from '../Tracks/NewTrackDialog';
import useTimeout from '../../customHooks/useTimeout';
import SuccessDialog from '../../components/Dialogs/SuccessDialog';

const NewAlbum = ({ editing }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validator = useRef(new SimpleReactValidator());
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

  const handleDeleteTrack = trackInfo => dispatch(deleteTrackInTracksUploading(trackInfo.id));
  const handleEditTrack = trackInfo => {
    setTrackData(trackInfo);
    setOpenNewTrackDialog(true);
  }

  const getTracksAsDataTable = tracksTotalInfo => {
    return tracksTotalInfo.map(trackWithAllInfo => [
      `${trackWithAllInfo.position}`,
      `${trackWithAllInfo.title}`,
      `${trackWithAllInfo.isrc}`,
      `${trackWithAllInfo.artists ? trackWithAllInfo.artists.length > 1 ? "SI" : "NO" : "NO"}`,
      editAction(trackWithAllInfo, handleEditTrack),
      deleteAction(trackWithAllInfo, handleDeleteTrack),
      trackUploadProgress(trackWithAllInfo.progress),
    ]);
  }

  const [openAddArtistDialog, setOpenAddArtistDialog] = useState(false);

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [tracksDataTable, setTracksDataTable] = useState(getTracksAsDataTable(myTracks) || [[]]);
  const [openNewTrackDialog, setOpenNewTrackDialog] = useState(false);

  const [openLoader, setOpenLoader] = useState(false);
  const [creatingAlbumState, setCreatingAlbumState] = useState("none");
  const [buttonState, setButtonState] = useState("none");
  const [buttonText, setButtonText] = useState("Finalizar");

  const [trackData, setTrackData] = useState({
    disc_number: cantAlbumsFromUser, explicit: 0, allOtherArtists: [],
    subgenre: currentAlbumData.subgenre, genreName: currentAlbumData.genreName,
    subgenreName: currentAlbumData.subgenreName, genre: currentAlbumData.genre,
    position: tracksDataTable.length + 1, title: "", track: "", artists: [],
    price: "", lyrics: "", isrc: "", track_language_name: currentAlbumData.languageName,
    track_language_id: currentAlbumData.languageId, progress: 0, id: "",
    collaborators: [{ name: "", roles: ["COMPOSER"] }, { name: "", roles: ["LYRICIST"] }],
  });

  // Poner un msj de error correspondiente si no esta el COVER!
  const allFieldsValidCreateAlbum = () => {
    if (validator.current.allValid() && currentAlbumData.cover) {
      createAlbum();
    } else {
      validator.current.showMessages();
      forceUpdate();
    }
  }

  const createAlbum = async () => {
    setOpenLoader(true);

    // const allOtherArtistsNotRepeatedFromTracksAndAlbum = artistsWithUniqueName([...currentAlbumData.allOtherArtists, ...myTracks.map(track => track.allOtherArtists).flat()]);
    // console.log("All artists: ", allOtherArtistsNotRepeatedFromTracksAndAlbum);

    // const otherPrimaryArtistsOfTheAlbumCreatedInFuga = await toWithOutError(dispatch(createOtherArtistsRedux(allOtherArtistsNotRepeatedFromTracksAndAlbum, currentUserId)))
    // if (otherPrimaryArtistsOfTheAlbumCreatedInFuga === "ERROR") {
    //   setButtonState("error"); setButtonText("Error"); setOpenLoader(false);
    //   return;
    // }
    // setCreatingAlbumState("artists-created");

    // let albumDataFromFuga = await toWithOutError(dispatch(createAlbumRedux(currentAlbumData, currentUserId)));
    // if (albumDataFromFuga === "ERROR") {
    //   setButtonState("error"); setButtonText("Error"); setOpenLoader(false);
    //   return;
    // }
    // setCreatingAlbumState("album-created");

    // let responseTracksFromFuga = await toWithOutError(dispatch(uploadAllTracksToAlbumRedux(myTracks, albumDataFromFuga.id, albumDataFromFuga.fugaId, currentUserId)));
    // if (responseTracksFromFuga === "ERROR") {
    //   setButtonState("error"); setButtonText("Error"); setOpenLoader(false);
    //   return;
    // }
    // setCreatingAlbumState("tracks-created");

    // const tracksCollaboratorsResponse = await toWithOutError(dispatch(createCollaboratorsRedux(responseTracksFromFuga, currentUserId)))
    // if (tracksCollaboratorsResponse === "ERROR") {
    //   setButtonState("error"); setButtonText("Error"); setOpenLoader(false);
    // }
    // else {
    //   setButtonState("success");
    //   setCreatingAlbumState("success");
    // }
    setCreatingAlbumState("success");
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
        let [errorAddingFile, urlAndFile] = await to(manageAddImageToStorage(event.target.files[0], currentAlbumData.id, 'covers', 1048576 * 20, setMessage, setProgress));
        if (errorAddingFile) {
          setMessage("Ha ocurrido un error, por favor, intente nuevamente. ");
          return;
        }
        dispatch(updateAddingAlbumImageUrlAndCoverRedux({ imagenUrl: urlAndFile.url, cover: urlAndFile.file }));
      }
      else setMessage("La imagen debe tener una resolucion mínima de 1400x1400 y un tamaño máximo de 20mb");
    }
  }

  const handleClickAddTrack = () => {
    let artistFromLaFlota = [{ name: currentAlbumData.nombreArtist, fugaId: currentAlbumData.artistFugaId, primary: true, id: currentAlbumData.artistId }];
    setTrackData({
      ...trackData, position: tracksDataTable.length + 1, artists: [...artistFromLaFlota,
      ...getAllOtherArtistsFromAlbumAndTrack(artistFromLaFlota[0], artistsWithUniqueName(currentAlbumData.allOtherArtists), artistsWithUniqueName([...myTracks.map(track => track.allOtherArtists).flat()]))]
    })
    setOpenNewTrackDialog(true);
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

  const handlerBasicUpdateAlbum = (value, targetField) => {
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, [`${targetField}`]: value }));
  }

  const handlerLanguageChoose = event => {
    let languageId = languagesFuga.find(l => l.name === event.target.value).id;
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, languageId, languageName: event.target.value }));
  }
  const handlerGenreChoose = event => {
    let genreId = allFugaGenres.find(g => g.name === event.target.value).id;
    setTrackData({ ...trackData, genre: genreId, genreName: event.target.value });
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, genre: event.target.value }));
  }

  // const handlerSubgenreChoose = event => {
  //   let subgenreId = allFugaGenres.find(g => g.name === event.target.value).id;
  //   setTrackData({ ...trackData, subgenre: subgenreId, subgenreName: event.target.value });
  //   dispatch(updateAddingAlbumRedux({ ...currentAlbumData, subgenre: subgenreId, subgenreName: event.target.value }));
  // }

  const handlerUPC = event => {
    if (event.target.value.length <= 14) dispatch(updateAddingAlbumRedux({ ...currentAlbumData, upc: event.target.value }));
    validator.current.showMessageFor('upc');
  }

  const yearsArray = Array.from({ length: 30 }, (_, i) => 2021 - i);

  return (
    <Grid container textAlign="center">
      <Card style={{ alignItems: "center", borderRadius: "30px" }} >

        <SuccessDialog isOpen={creatingAlbumState === "success"} title="Felicitaciones!" contentTexts={[["Tu lanzamiento ya se encuentra en etapa de de revisión"]]}
          handleClose={() => navigate(-1)}/>

        <Grid item xs={12} sx={{ width: "60%" }}>
          <CardHeader color="primary">
            <Typography sx={cardTitleWhiteStyles}>Crear Lanzamiento</Typography>
          </CardHeader>
        </Grid>

        <Grid container item xs={12} paddingTop={4} >

          <ImageInput key="new-album" imagenUrl={currentAlbumData.imagenUrl} onClickAddImage={onClickAddImage} textButton="Arte de Tapa"
            progress={progress} message={message} helperText={albumCoverHelperText}
          />

          <NewArtist editing={false} view="dialog" isOpen={openAddArtistDialog} handleClose={() => setOpenAddArtistDialog(false)} />

          <Grid container item xs={12} >

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={() => setOpenAddArtistDialog(true)}
                sx={buttonAddArtist}
                endIcon={<AddCircleOutline />}>
                Crear Artista Principal
              </Button>
            </Grid>

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
                validatorProps={{ restrictions: 'required', message: "Debes seleccionar al Artista del Nuevo Lanzamiento.", validator: validator }}
              />
            </Grid>

          </Grid>

          <AddOtherArtistsAlbumForm
            checkBoxLabel="¿Lanzamiento Colaborativo?"
            checkBoxHelper={lanzamientoColaborativoTooltip}
            checkBoxColor="#9c27b0"
            buttonColor="#9c27b0"
          />

          <Grid container item xs={12}>
            <Grid item xs={6}>
              <TextFieldWithInfo
                name="title"
                sx={textFieldStyle}
                required
                label="Título del Lanzamiento"
                value={currentAlbumData.title}
                onChange={(event) => handlerBasicUpdateAlbum(event.target.value, "title")}
                validatorProps={{ restrictions: 'required|max:50', message: "Debes ingresar el Título del Lanzamiento.", validator: validator }}
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
                validatorProps={{ restrictions: 'required|max:50', message: "Debes seleccionar un sello para el Lanzamiento.", validator: validator }}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12}>
            <Grid item xs={6}>
              <TextFieldWithInfoImage
                name="version"
                sx={textFieldStyle}
                label="Versión (Vivo, Acústico...)"
                value={currentAlbumData.version}
                helperText="Puedes especificar si el lanzamiento es una versión de otro lanzamiento. Por Ejemplo, una versión en Vivo o Acústica."
                onChange={event => handlerBasicUpdateAlbum(event.target.value, "version")}
                imageSource="/images/versionReleaseHelp.png"
                contentTexts={[["No debés escribir los paréntesis, se incluirán solos."]]}
              />
            </Grid>

            <Grid item xs={6}>
              <TextFieldWithInfo
                name="format"
                sx={textFieldStyle}
                select
                label="Formato del Lanzamiento"
                value={currentAlbumData.format}
                onChange={event => handlerBasicUpdateAlbum(event.target.value, "format")}
                helperText="Elige el formato del lanzamiento, segun la cantidad de canciones o la duración del Album."
                selectItems={["Single", "EP", "Álbum"]}
              />
            </Grid>
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
              onChange={(event) => handlerBasicUpdateAlbum(event.target.value, "c_year")}
              helperText="Año en que el Álbum/Single fue publicado por primera vez."
              selectItems={yearsArray}
              validatorProps={{ restrictions: 'required|numeric', message: "Debes seleccionar un año de publicación del Lanzamiento.", validator: validator }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldWithInfo
              sx={textFieldStyle}
              name="p_year"
              required
              select
              label="(P) Año de Publicación"
              value={currentAlbumData.p_year}
              onChange={(event) => handlerBasicUpdateAlbum(event.target.value, "p_year")}
              helperText="Año en que esta grabación fue publicada."
              selectItems={yearsArray}
              validatorProps={{ restrictions: 'required|numeric', message: "Debes seleccionar un año de publicación del Lanzamiento.", validator: validator }}
            />
          </Grid>
        </Grid>

        <Grid container item xs={12}>
          <Grid item xs={6}>
            <TextFieldWithInfo
              name="c_line"
              sx={textFieldStyle}
              required
              label="Copyright"
              value={currentAlbumData.c_line}
              onChange={(event) => handlerBasicUpdateAlbum(event.target.value, "c_line")}
              helperText="El dueño de los Derechos de Autor.
              → Si tu lanzamiento contiene Covers debes agregar el nombre de los autores originales acá (Por ej.: Luis Alberto Spinetta)."
              validatorProps={{ restrictions: 'required|max:50', message: "Por favor indicá el dueño de los derechos de autor del lanzamiento.", validator: validator }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextFieldWithInfo
              name="p_line"
              sx={textFieldStyle}
              required
              label="Publisher"
              value={currentAlbumData.p_line}
              onChange={(event) => handlerBasicUpdateAlbum(event.target.value, "p_line")}
              helperText="El dueño de los Derechos de Publicación de esta grabación.
            → Ej. 1: Fito Paez | Ej. 2: Sony Music"
              validatorProps={{ restrictions: 'required|max:50', message: "Por favor indicá el publicador del lanzamiento.", validator: validator }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextFieldWithInfo
              name="upc"
              sx={textFieldStyle}
              label="UPC"
              value={currentAlbumData.upc}
              helperText="Completa sólo si ya tienes un código UPC que quieras usar con este lanzamiento. Si no tienes le asignaremos uno."
              onChange={handlerUPC}
              validatorProps={{ restrictions: 'max:13|numeric', message: "Formato inválido: El UPC es un código de máximo 13 números", validator: validator }}
            />
          </Grid>
        </Grid>

        <Grid container item xs={12} paddingTop={3} justifyContent="center">

          <TypographyWithInfo infoTooltip={releaseDateInfoTooltip} title="Fecha del Lanzamiento" />

          <SelectDateInputDDMMYYYY type="release-date" dayValue={currentAlbumData.dayOfMonth} monthValue={currentAlbumData.month} yearValue={currentAlbumData.year}
            setDayOfMonth={event => handlerBasicUpdateAlbum(event.target.value, "dayOfMonth")} setMonth={event => handlerBasicUpdateAlbum(event.target.value, "month")}
            setYear={event => handlerBasicUpdateAlbum(event.target.value, "year")} simpleValidator={validator} />

          <CheckboxWithInfo
            label="¿El Lanzamiento fue publicado en el pasado?"
            checked={currentAlbumData.oldRelease}
            onChecked={(event) => handlerBasicUpdateAlbum(event.target.checked, "oldRelease")}
            checkBoxHelper={oldReleaseCheckBoxHelper}
            color="#9c27b0"
          />
          {currentAlbumData.oldRelease &&
            <SelectDateInputDDMMYYYY type="old-release-date" dayValue={currentAlbumData.originalDayOfMonth} monthValue={currentAlbumData.originalMonth} yearValue={currentAlbumData.originalYear}
              setDayOfMonth={event => handlerBasicUpdateAlbum(event.target.value, "originalDayOfMonth")} setMonth={event => handlerBasicUpdateAlbum(event.target.value, "originalMonth")}
              setYear={event => handlerBasicUpdateAlbum(event.target.value, "originalYear")} simpleValidator={validator} />
          }

          <CheckboxWithInfo
            label="¿Permitir pre-comprar antes del lanzamiento?"
            checked={currentAlbumData.preOrder}
            onChecked={(event) => handlerBasicUpdateAlbum(event.target.checked, "preOrder")}
            checkBoxHelper={preSaleCheckBoxHelper}
            color="#9c27b0"
          />

          {currentAlbumData.preOrder &&
            <SelectDateInputDDMMYYYY type="preOrder" dayValue={currentAlbumData.preOrderDayOfMonth} monthValue={currentAlbumData.preOrderMonth} yearValue={currentAlbumData.preOrderYear}
              setDayOfMonth={event => handlerBasicUpdateAlbum(event.target.value, "preOrderDayOfMonth")} setMonth={event => handlerBasicUpdateAlbum(event.target.value, "preOrderMonth")}
              setYear={event => handlerBasicUpdateAlbum(event.target.value, "preOrderYear")} simpleValidator={validator} />
          }
          {currentAlbumData.preOrder &&
            <CheckboxWithInfo
              label="Habilitar pre-escucha para la pre-compra"
              checked={currentAlbumData.preview}
              onChecked={event => handlerBasicUpdateAlbum(event.target.checked, "preview")}
              color="#9c27b0"
              checkBoxHelper="Permitir que los usuarios escuchen un fragmento (30 segundos) de las canciones durante la etapa de Pre-Compra."
            />
          }

          <Grid container item spacing={2} xs={12} justifyContent="center" paddingTop={3}>
            <Grid item xs={12}>
              <Typography variant="h5">Idioma y Género</Typography>
            </Grid>

            <Grid item xs={6}>
              <TextFieldWithInfo
                name="language"
                fullWidth
                required
                select
                label="Idioma Principal del Lanzamiento"
                value={currentAlbumData.languageName}
                onChange={handlerLanguageChoose}
                selectItems={languagesFuga}
                selectKeyField="id"
                selectValueField="name"
              />
            </Grid>
          </Grid>

          <Grid container item spacing={2} xs={12} justifyContent="center" paddingTop={3}>
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
                validatorProps={{ restrictions: 'required', message: "Debés seleccionar el género principal del Album.", validator }}
              />
            </Grid>

            {/* <Grid item xs={3}>
              <TextFieldWithInfo
                name="subgenerosMusicales"
                fullWidth
                select
                label="Género Musical Secudario"
                value={currentAlbumData.subgenreName}
                onChange={handlerSubgenreChoose}
                selectItems={allFugaGenres}
                selectKeyField="id"
                selectValueField="name"
              />
            </Grid> */}

          </Grid>
        </Grid>

        {(currentAlbumData.nombreArtist || openLoader) &&
          <Grid container item xs={12} paddingTop={4} justifyContent="center">
            <Grid item xs={8} >
              <TracksTable tracksTableData={tracksDataTable} handleClickAddTrack={handleClickAddTrack} />
            </Grid>
          </Grid>}

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
              // onClickHandler={allFieldsValidCreateAlbum}
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

const buttonAddArtist = { marginTop: "2%", backgroundColor: "#9c27b0", '&:hover': { backgroundColor: "#9c27b0" } }
