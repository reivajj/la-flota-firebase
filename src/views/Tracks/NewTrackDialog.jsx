import React, { useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";

import Success from "components/Typography/Success";
import Danger from 'components/Typography/Danger.js';

import {
  Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, Button
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { createTrackLocalRedux } from '../../redux/actions/TracksActions';
import ButtonWithInputFile from 'components/CustomButtons/ButtonWithInputFile';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoSwitch from "components/Switch/InfoSwitch";
import { useForceUpdate } from "utils";
import ArtistInAddTrack from '../Artists/ArtistInAddTrack';
import { cloneDeepLimited } from '../../utils';
import AddCollaboratorsForm from '../../components/Forms/AddCollaboratorsForm';
import AddOtherArtistsTrackForm from '../../components/Forms/AddOtherArtistsTrackForm';
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import { languagesFuga } from '../../variables/varias';
import { allFugaGenres } from 'variables/genres';

const newTrackArtistsInfo = "Éstos son los Artistas que mencionaste en el Album. Ahora deberás seleccionar cuáles quieres que sean artistas Principales o Featuring de la Canción. O puedes eliminarlos para que no aparezcan en ésta canción (debe haber al menos un Artista Principal)."

export const deleteAction = (track, handleDeleteTrack) => {

  return (
    <Grid item xs={6}>
      <IconButton color="inherit" size="small" onClick={() => handleDeleteTrack(track)}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </Grid>
  );
};

export const editAction = (track, handleEditTrack) => {
  return (
    <Grid item xs={12}>
      <IconButton color="inherit" size="small" onClick={() => handleEditTrack(track)}>
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Grid>
  )
}

export const NewTrackDialog = (props) => {

  let { openDialog, setOpenNewTrackDialog, setTracksDataTable, tracksDataTable, trackData, setTrackData, circularProgress } = props;

  const dispatch = useDispatch();
  const validator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserId = useSelector(store => store.userData.id);

  const [trackMissing, setTrackMissing] = useState(false);

  const handleCancelDialog = () => {
    setOpenNewTrackDialog(false);
    setTrackData({
      ...trackData, explicit: false, position: tracksDataTable.length + 1, title: "", track: "",
      genre: trackData.genre || "", genreName: trackData.genreName || "", subgenre: trackData.subgenre || "",
      price: "", lyrics: "", isrc: "", track_language_id: trackData.track_language_id,
      progress: 0, artists: [...trackData.artists, ...trackData.allOtherArtists], collaborators: trackData.collaborators,
      track_language_name: trackData.track_language_name, allOtherArtists: [], id: "",
    });
  };

  const handleCreateTrack = async () => {
    trackData.position = tracksDataTable.length + 1;
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
    if (validator.current.allValid() && trackData.track) {
    handleCreateTrack();
    } else {
      validator.current.showMessages();
      if (!trackData.track) setTrackMissing(true);
      forceUpdate();
    }
  }

  const deleteArtistFromArtists = index => trackData.artists.filter((_, i) => i !== index);

  const getTrackFromLocal = event => {
    setTrackData({ ...trackData, track: event.target.files[0] });
    setTrackMissing(false);
  };

  const handleExplicitChange = newExplicitEvent => setTrackData({ ...trackData, explicit: newExplicitEvent.target.checked });
  const handleDeleteOtherArtist = indexOtherArtist => setTrackData({ ...trackData, artists: deleteArtistFromArtists(indexOtherArtist) })

  const handlerGenreChoose = event => {
    let genreId = allFugaGenres.find(g => g.name === event.target.value).id;
    setTrackData({ ...trackData, genre: genreId, genreName: event.target.value });
  }

  // const handlerSubgenreChoose = event => {
  //   setTrackData({ ...trackData, subgenre: event.target.value });
  // }

  const handleChangePrimaryOtherArtist = (index, newPrimaryValue) => {
    const newArtists = cloneDeepLimited(trackData.artists);
    newArtists[index].primary = newPrimaryValue;
    setTrackData({ ...trackData, artists: newArtists });
  };

  const handlerLanguageChoose = event => {
    let track_language_id = languagesFuga.find(l => l.name === event.target.value).id;
    setTrackData({ ...trackData, track_language_id, track_language_name: event.target.value });
  }

  return (
    <Dialog
      open={openDialog}
      onClose={handleCancelDialog}
      aria-labelledby="form-dialog-title"
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle id="form-dialog-title" sx={{ fontSize: "2em" }}>Crear Nueva Canción</DialogTitle>
      <DialogContent>

        <DialogTitle id="agregarArtist-title" sx={agregarArtistaTitleStyle}>Artistas de la Canción</DialogTitle>

        <DialogContentText>
          {newTrackArtistsInfo}
        </DialogContentText>

        <Grid container spacing={2} style={{ textAlign: "center" }} >

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
            checkBoxHelper="Agrega artistas Principales o Featuring que no aparecen en el Album."
            checkBoxColor="#508062"
            buttonColor="#508062"
            setTrackData={setTrackData}
            trackData={trackData}
          />

          <Grid item xs={12} >
            <DialogTitle id="collaborators-dialog-title" sx={collaboratorsTitleStyle}>Colaboradores de la Canción</DialogTitle>
          </Grid>

          <AddCollaboratorsForm setTrackData={setTrackData} trackData={trackData} validator={validator} />

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
                validatorProps={{ restrictions: 'required|max:50', message: "Debes ingresar el Título de la Canción.", validator }}
              />
            </Grid>

            <Grid item xs={3}>
              <TextFieldWithInfo
                name="language"
                fullWidth
                required
                select
                label="Idioma de la Canción"
                value={trackData.track_language_name}
                onChange={handlerLanguageChoose}
                selectItems={languagesFuga}
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

          <Grid item xs={4}>
            <TextFieldWithInfo
              name="isrc"
              fullWidth
              label="ISRC (Formato: CC-XXX-00-12345)"
              value={trackData.isrc}
              onChange={(event) => setTrackData({ ...trackData, isrc: event.target.value })}
              helperText="Completa sólo si ya tenés un Código ISRC. Formato: CC-XXX-00-12345"
              validatorProps={{ restrictions: 'max:20', message: "El formato del ISRC es inválido.", validator }}
            />
          </Grid>

          <Grid item xs={3}>
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

          {/* <Grid item xs={3}>
            <TextFieldWithInfo
              name="subgenerosMusicales - track"
              fullWidth
              required
              select
              label="Género Musical Secundario"
              value={trackData.subgenre}
              onChange={handlerGenreChoose}
              selectItems={allFugaSubgenres}
            />
          </Grid> */}

          <Grid item xs={12}>
            <ButtonWithInputFile
              textButton="Subir Archivo de Audio"
              onClickHandler={getTrackFromLocal}
              fileType="audio/wav, audio/x-wav"
              color="#508062" />
            {trackData.track && <Success>{`Nombre del Archivo: ${trackData.track.name}`}</Success>}
            {trackMissing && <Danger>Debes agregar un archivo de Audio (wav, flac)</Danger>}
          </Grid>

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