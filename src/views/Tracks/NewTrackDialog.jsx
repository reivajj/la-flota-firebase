import React, { useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";

import Success from "components/Typography/Success";
import Danger from 'components/Typography/Danger.js';

import {
  Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { createTrackLocalRedux } from '../../redux/actions/TracksActions';
import ButtonWithInputFile from 'components/CustomButtons/ButtonWithInputFile';

import InfoSwitch from "components/Switch/InfoSwitch";
import { toWithOutError, useForceUpdate } from "utils";
import ArtistInAddTrack from '../Artists/ArtistInAddTrack';
import { cloneDeepLimited } from '../../utils';
import AddCollaboratorsForm from '../../components/Forms/AddCollaboratorsForm';
import AddOtherArtistsTrackForm from '../../components/Forms/AddOtherArtistsTrackForm';
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import { allAudioLocalesFuga, languagesFuga } from '../../variables/varias';
import { allFugaGenres } from 'variables/genres';
import { createSubgenreRedux } from '../../redux/actions/UserDataActions';
import TextFieldWithAddElement from '../../components/TextField/TextFieldAddElement';
import EditOrAddFieldsDialog from '../../components/Dialogs/EditOrAddFieldDialog';
import { isValidFormatISRC, readAndCheckAudioFile } from "utils/tracks.utils";
import { editAction, deleteAction } from '../../utils/tables.utils';
import InfoDialog from '../../components/Dialogs/InfoDialog';
import { spotifyUriIsValid, artistsWithUniqueName } from '../../utils/artists.utils';

const newTrackArtistsInfo = "Éstos son los Artistas que mencionaste en el Lanzamiento. Ahora deberás seleccionar cuáles quieres que sean artistas Principales o Featuring de la Canción. O puedes eliminarlos para que no aparezcan en ésta canción (debe haber al menos un Artista Principal)."

export const NewTrackDialog = (props) => {

  let { openDialog, setOpenNewTrackDialog, setTracksDataTable, tracksDataTable, trackData, setTrackData, circularProgress } = props;

  const dispatch = useDispatch();
  const validator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserData = useSelector(store => store.userData);
  const currentUserId = useSelector(store => store.userData.id);

  const topElementRef = useRef(null);
  const scrollToTop = () => topElementRef.current ? topElementRef.current.scrollIntoView() : null;

  const [trackMissing, setTrackMissing] = useState(false);
  const [openLoaderSubgenreCreate, setOpenLoaderSubgenreCreate] = useState(false);
  const [buttonState, setButtonState] = useState("none");
  const [isrcInvalid, setIsrcInvalid] = useState(false);
  const [openLowQualityAudioDialog, setOpenLowQualityAudioDialog] = useState({ open: false, title: "", text: [""] });
  const [openEditDialog, setOpenEditDialog] = useState({ open: false, title: "", subtitle: [""], values: "" });

  const handleCloseEditDialog = () => setOpenEditDialog({ open: false, title: "", subtitle: [""], values: "" });

  const handleCancelDialog = () => {
    setOpenNewTrackDialog(false);
    setTrackData({
      ...trackData, explicit: false, position: tracksDataTable.length + 1, title: "", track: "",
      genre: trackData.genre || "", genreName: trackData.genreName || "", subgenre: trackData.subgenre || "",
      price: "", lyrics: "", isrc: "", track_language_id: trackData.track_language_id, audio_locale_id: trackData.audio_locale_id,
      progress: 0, artists: [...trackData.artists, ...trackData.allOtherArtists], collaborators: trackData.collaborators,
      track_language_name: trackData.track_language_name, allOtherArtists: [], id: "", audio_locale_name: trackData.audio_locale_name || "",
    });
  };

  const handleCreateTrack = async () => {
    trackData.position = tracksDataTable.length + 1;
    trackData.collaborators = trackData.collaborators.map(coll => { return { ...coll, name: coll.name.trim() } });
    dispatch(createTrackLocalRedux(trackData, currentUserId));
    setTracksDataTable([...tracksDataTable, [
      `${trackData.position}`,
      `${trackData.title}`,
      `${trackData.isrc}`,
      `${trackData.artists.length + trackData.allOtherArtists.length > 1 ? "SI" : "NO"}`,
      `${trackData.track_language_name}`,
      `${trackData.explicit ? "NO" : "SI"}`,
      editAction(trackData),
      deleteAction(trackData),
      circularProgress(trackData.progress)
    ]]);
    handleCancelDialog();
  }

  const allFieldsValidCreateTrack = () => {
    let allOtherArtistsTrack = artistsWithUniqueName(trackData.allOtherArtists);
    allOtherArtistsTrack = allOtherArtistsTrack.map(artist => { return { valid: spotifyUriIsValid(artist.spotify_uri), name: artist.name } });
    let invalidArtistUri = allOtherArtistsTrack.find(artistValid => artistValid.valid === false);

    if (invalidArtistUri) {
      scrollToTop();
      return;
    }
    if (!isValidFormatISRC(trackData.isrc)) {
      setIsrcInvalid(true);
      return;
    }
    else setIsrcInvalid(false);
    console.log(validator.current);
    if (validator.current.allValid() && trackData.track) {
      handleCreateTrack();
    } else {
      validator.current.showMessages();
      if (!trackData.track) setTrackMissing(true);
      forceUpdate();
    }
  }

  const deleteArtistFromArtists = index => trackData.artists.filter((_, i) => i !== index);

  const getTrackFromLocal = async event => {
    let trackStatus = await readAndCheckAudioFile(event.target.files[0], new window.wavefile.WaveFile(), setOpenLowQualityAudioDialog);
    if (trackStatus === "SUCCESS") {
      setTrackData({ ...trackData, track: event.target.files[0] });
      setTrackMissing(false);
    }
  };

  const handleExplicitChange = newExplicitEvent => setTrackData({ ...trackData, explicit: newExplicitEvent.target.checked });
  const handleDeleteOtherArtist = indexOtherArtist => setTrackData({ ...trackData, artists: deleteArtistFromArtists(indexOtherArtist) })

  const handlerGenreChoose = event => {
    let genreId = allFugaGenres.find(g => g.name === event.target.value).id;
    setTrackData({ ...trackData, genre: genreId, genreName: event.target.value });
  }

  const handlerSubgenreChoose = event => {
    if (event.target.value === "Crea tu propio subgénero") return;
    let subgenreId = currentUserData.subgenerosPropios.find(g => g.name === event.target.value).id;
    setTrackData({ ...trackData, subgenre: subgenreId, subgenreName: event.target.value });
  }

  const handleCreateSubgenre = async subgenreName => {
    setOpenLoaderSubgenreCreate(true);
    const createSubgenreResponse = await toWithOutError(dispatch(createSubgenreRedux(subgenreName, currentUserId)))

    if (createSubgenreResponse === "ERROR") {
      setButtonState("error");
      setOpenLoaderSubgenreCreate(false);
      return "ERROR";
    }

    setTrackData({ ...trackData, subgenreName, subgenre: createSubgenreResponse.id });
    setOpenLoaderSubgenreCreate(false);
    handleCloseEditDialog();
  }

  const handleAddSubgenre = () => setOpenEditDialog({
    open: true, title: "Crea un subgénero", subtitle: ["Puedes agregar el subgénero que desees."],
    handleConfirm: (newValue) => handleCreateSubgenre(newValue),
    initialValues: "", values: ""
  });

  const handleChangePrimaryOtherArtist = (index, newPrimaryValue) => {
    const newArtists = cloneDeepLimited(trackData.artists);
    newArtists[index].primary = newPrimaryValue;
    setTrackData({ ...trackData, artists: newArtists });
  };

  const handlerAudioLocaleChoose = event => {
    let audio_locale = allAudioLocalesFuga.find(l => l.name === event.target.value);
    if (audio_locale === undefined) audio_locale.id = "ES";
    setTrackData({ ...trackData, audio_locale_id: audio_locale.id, audio_locale_name: event.target.value });
  }

  const handlerLanguageChoose = event => {
    let language = languagesFuga.find(l => l.name === event.target.value);
    if (language === undefined) language.id = "ES";
    setTrackData({ ...trackData, track_language_id: language.id, track_language_name: event.target.value });
  }

  const handleChangeISRC = event => {
    if (event.target.value.length <= 15) setTrackData({ ...trackData, isrc: event.target.value.toUpperCase() });
    else return;

    if (!isValidFormatISRC(event.target.value.toUpperCase())) setIsrcInvalid(true);
    else setIsrcInvalid(false);
  }

  return (
    <Dialog open={openDialog} onClose={handleCancelDialog} aria-labelledby="form-dialog-title" maxWidth="xl" fullWidth>

      <InfoDialog isOpen={openLowQualityAudioDialog.open} handleClose={() => setOpenLowQualityAudioDialog({ open: false, title: "", text: [""] })}
        title={openLowQualityAudioDialog.title} contentTexts={openLowQualityAudioDialog.text} />

      <EditOrAddFieldsDialog handleCloseDialog={handleCloseEditDialog} labelTextField="Nuevo subgénero"
        loading={openLoaderSubgenreCreate} buttonState={buttonState} editOptions={openEditDialog}
        setEditOptions={setOpenEditDialog} />

      <DialogTitle id="form-dialog-title" sx={{ fontSize: "2em" }}>Crear Nueva Canción</DialogTitle>
      <DialogContent>

        <DialogTitle id="agregarArtist-title" sx={agregarArtistaTitleStyle}>Artistas de la Canción</DialogTitle>

        <DialogContentText>
          {newTrackArtistsInfo}
        </DialogContentText>

        <Grid ref={topElementRef} container spacing={2} style={{ textAlign: "center" }} >

          <Grid container item xs={12} spacing={2} sx={{ marginTop: "10px" }}>
            {trackData.artists.length > 0
              ? trackData.artists.map((_, index) =>
                <ArtistInAddTrack
                  key={index}
                  index={index}
                  handleDelete={handleDeleteOtherArtist}
                  handleSliderChange={handleChangePrimaryOtherArtist}
                  artists={trackData.artists}
                  allOtherArtists={trackData.allOtherArtists} />)
              : []
            }
          </Grid>

          <AddOtherArtistsTrackForm
            checkBoxLabel="¿Quieres agregar otro artista?"
            checkBoxHelper="Agrega artistas Principales o Featuring que no aparecen en el Lanzamiento."
            checkBoxColor="#508062"
            buttonColor="#508062"
            setTrackData={setTrackData}
            trackData={trackData}
            validator={validator}
          />

          <Grid item xs={12} >
            <DialogTitle id="info-general-dialog-title" sx={collaboratorsTitleStyle}>Información General</DialogTitle>
          </Grid>

          <>
            <Grid item xs={6}>
              <TextFieldWithInfo
                name="title"
                fullWidth
                required
                label="Nombre de la Canción"
                value={trackData.title}
                onChange={(event) => setTrackData({ ...trackData, title: event.target.value })}
                helperText="Nombre exacto de la canción, respetando mayúsculas, minúsculas y acentos."
                validatorProps={{ restrictions: 'required|max:50', message: "Debes ingresar el nombre de la Canción.", validator }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextFieldWithInfo
                name="language"
                fullWidth
                required
                select
                label="Idioma del nombre de la Canción"
                value={trackData.track_language_name}
                onChange={handlerLanguageChoose}
                selectItems={languagesFuga}
                selectKeyField="id"
                selectValueField="name"
              />
            </Grid>

            <Grid item xs={5}>
              <TextFieldWithInfo
                name="audio_locale_name"
                fullWidth
                required
                select
                label="Idioma de la Canción"
                value={trackData.audio_locale_name}
                onChange={handlerAudioLocaleChoose}
                selectItems={allAudioLocalesFuga}
                selectKeyField="id"
                selectValueField="name"
              />
            </Grid>

            <Grid item xs={2} sx={{ marginTop: "1.4%" }}>
              <InfoSwitch
                label="¿Explícito?"
                onChange={handleExplicitChange}
                checked={trackData.explicit}
                infoTooltip="Indica si la letra de la canción contiene lenguaje inapropiado."
                infoAtLeft={false} />
            </Grid>
          </>

          <Grid item xs={5}>
            <TextFieldWithInfo
              name="isrc"
              fullWidth
              label="ISRC (Formato: CC-XXX-00-12345)"
              value={trackData.isrc}
              onChange={handleChangeISRC}
              helperText="Completa sólo si ya tenés un Código ISRC. Formato: CC-XXX-00-12345"
            />
            {isrcInvalid && <Danger>El formato del ISRC es inválido. (Formato: CC-XXX-00-12345)</Danger>}
          </Grid>

          <Grid item xs={6}>
            <TextFieldWithInfo
              name="generosMusicales"
              fullWidth
              required
              select
              label="Género Musical Principal"
              value={trackData.genreName || ""}
              onChange={handlerGenreChoose}
              selectItems={allFugaGenres}
              selectKeyField="id"
              selectValueField="name"
              validatorProps={{ restrictions: 'required', message: "Debés seleccionar un género principal.", validator }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextFieldWithAddElement
              name="subgenerosMusicales"
              fullWidth
              select
              label="Género Musical Secundario"
              value={trackData.subgenreName}
              onChange={handlerSubgenreChoose}
              selectItems={currentUserData.subgenerosPropios || []}
              selectKeyField="id"
              selectValueField="name"
              onClickAddElement={handleAddSubgenre}
              addPlaceholder="Crea tu propio subgénero"
            />
          </Grid>

          <Grid item xs={12}>
            <ButtonWithInputFile
              textButton="Subir Archivo de Audio"
              onClickHandler={getTrackFromLocal}
              fileType="audio/wav, audio/x-wav"
              color="#508062" />
            {trackData.track && <Success>{`Nombre del Archivo: ${trackData.track.name}`}</Success>}
            {trackMissing && <Danger>Debes agregar un archivo de Audio (wav)</Danger>}
          </Grid>


          <Grid item xs={12} >
            <DialogTitle id="collaborators-dialog-title" sx={collaboratorsTitleStyle}>Colaboradores de la Canción</DialogTitle>
          </Grid>

          <AddCollaboratorsForm setTrackData={setTrackData} trackData={trackData} validator={validator} />

        </Grid>

      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancelDialog} sx={buttonColorStyle}>
          Atras
        </Button>
        <Button onClick={allFieldsValidCreateTrack} sx={buttonColorStyle}>
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const collaboratorsTitleStyle = { fontSize: "1.5em", textAlign: "center", paddingTop: "16px", paddingBottom: 0 };
const agregarArtistaTitleStyle = { fontSize: "1.5em", textAlign: "center" };
const buttonColorStyle = { color: "#508062" };