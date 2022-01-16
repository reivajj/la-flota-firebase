import React, { useRef, useEffect, useState } from "react";
// import InputLabel from "@mui/material/InputLabel";
// core components
import Button from "components/CustomButtons/Button.js";
import SimpleReactValidator from "simple-react-validator";

import Success from "components/Typography/Success";
import {
  TextField, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, MenuItem
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { createTrackLocalRedux } from '../../redux/actions/TracksActions';
import ButtonWithInputFile from 'components/CustomButtons/ButtonWithInputFile';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoSwitch from "components/Switch/InfoSwitch";
import { languages } from "variables/varias";
import { errorFormat, useForceUpdate } from "utils";
import ArtistInAddTrack from '../Artists/ArtistInAddTrack';
import { cloneDeepLimited } from '../../utils';
import AddOtherArtistsTrackForm from '../../components/Forms/AddOtherArtistsTrackForm';
import AddCollaboratorsForm from '../../components/Forms/AddCollaboratorsForm';

export const trackActions = track => {
  return (
    <Grid container direction="row">
      <Grid item xs={6}>
        <IconButton color="inherit" size="small" onClick={() => console.log("Elimino track: ", track)}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </Grid>
      <Grid item xs={6}>
        <IconButton color="inherit" size="small" onClick={() => console.log("Edito track: ", track)}>
          <EditIcon fontSize="inherit" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export const AddTrackTest = (props) => {

  let { setOpenNewTrackDialog, circularProgress } = props;

  let openDialog = true;
  let tracksDataTable = {};
  // let setTrackData = () => console.log();
  let setTracksDataTable = () => console.log();
  // let trackData = { position: 1, title: "A", isrc: "isrc", other_artist: [], track_language: "Spanish", explicit: false, progress: 0 }

  const dispatch = useDispatch();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserId = useSelector(store => store.userData.id);
  const artistsInvited = useSelector(store => store.artistsInvited);
  const artistsInvitedWithPrimary = artistsInvited.map(a => {
    a.primary = true;
    return a;
  });

  const [trackData, setTrackData] = useState({
    explicit: false, allOtherArtists: artistsInvitedWithPrimary, collaborators: [],
    position: tracksDataTable.length + 1, title: "", track: "",
    price: "", lyrics: "", isrc: "", track_language: "",
  })

  // Luego sacar Spanish y pedirlo en el Form.
  // useEffect(() => {
  //   setTrackData({
  //     ...trackData, explicit: false, allOtherArtists: artistsInvited, collaborators: [],
  //     position: tracksDataTable.length + 1, title: "", track: "",
  //     price: "", lyrics: "", isrc: "", track_language: "",
  //   });
  // }, [tracksDataTable]);


  const handleCancelDialog = () => {
    setOpenNewTrackDialog(false);
    setTrackData({
      ...trackData, explicit: false,
      position: tracksDataTable.length + 1, title: "", track: "",
      price: "", lyrics: "", isrc: "", track_language: "",
      progress: 0, allOtherArtists: [], collaborators: [],
    });
  };

  const handleSubscribeDialog = async () => {
    dispatch(createTrackLocalRedux(trackData, currentUserId))
    setOpenNewTrackDialog(false);
    setTracksDataTable([...tracksDataTable, [
      `${trackData.position}`,
      `${trackData.title}`,
      `${trackData.isrc}`,
      `${trackData.other_artists}`,
      `${trackData.track_language}`,
      `${trackData.explicit ? "NO" : "SI"}`,
      trackActions(trackData),
      circularProgress(trackData.progress)
    ]]);
  }

  const allFieldsValidCreateTrack = () => {
    if (simpleValidator.current.allValid()) {
      handleSubscribeDialog();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate();
    }
  }

  const deleteArtistFromArtists = index => trackData.allOtherArtists.filter((_, i) => i !== index);

  const getTrackFromLocal = (event) => setTrackData({ ...trackData, track: event.target.files[0] });
  const handlerLanguageChoose = event => setTrackData({ ...trackData, track_language: event.target.value });
  const handleExplicitChange = newExplicitEvent => setTrackData({ ...trackData, explicit: newExplicitEvent.target.checked });
  const handleDeleteOtherArtist = indexOtherArtist => setTrackData({ ...trackData, allOtherArtists: deleteArtistFromArtists(indexOtherArtist) })

  const handleChangePrimaryOtherArtist = (index, newPrimaryValue) => {
    const newArtists = cloneDeepLimited(trackData.allOtherArtists);
    newArtists[index].primary = newPrimaryValue;
    setTrackData({ ...trackData, allOtherArtists: newArtists });
  };

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
          Éstos son los Artistas que mencionaste en el Album. Ahora deberás seleccionar cuáles quieres que sean
          artistas Principales o Featuring de la Canción. O puedes eliminarlos para que no aparezacan en ésta canción.
        </DialogContentText>

        <Grid container spacing={2} style={{ textAlign: "center" }} >

          <Grid container item xs={12} spacing={2} sx={{ marginTop: "10px" }}>
            {trackData.allOtherArtists
              ? trackData.allOtherArtists.map((_, index) =>
                <ArtistInAddTrack
                  key={index}
                  index={index}
                  handleDelete={handleDeleteOtherArtist}
                  handleSliderChange={handleChangePrimaryOtherArtist}
                  trackData={trackData} />)
              : []
            }
          </Grid>

          <AddOtherArtistsTrackForm
            checkBoxLabel="¿Quieres agregar otro artista?"
            checkBoxHelper="Agrega artistas Principales o Featuring que no aparecen en el Album."
            checkBoxColor="#508062"
            buttonColor="#508062"
          />

          <Grid item xs={12} >
            <DialogTitle id="collaborators-dialog-title" sx={collaboratorsTitleStyle}>Colaboradores de la Canción</DialogTitle>
          </Grid>

          <AddCollaboratorsForm
            checkBoxLabel="¿Quieres agregar colaboradores?"
            checkBoxHelper="Agrega artistas que hayan colaborado en esta canción."
            checkBoxColor="#508062"
            buttonColor="#508062"
            setTrackData={setTrackData}
            trackData={trackData}
          />


          <Grid item xs={12} >
            <DialogTitle id="collaborators-dialog-title" sx={collaboratorsTitleStyle}>Información General</DialogTitle>
          </Grid>

          <>
            <Grid item xs={6}>
              <TextField
                name="title"
                id="title"
                fullWidth
                variant="outlined"
                required
                margin="normal"
                label="Nombre de la Canción"
                value={trackData.title}
                onChange={(event) => setTrackData({ ...trackData, title: event.target.value })}
                helperText="Nombre exacto de la canción, respetando mayúsculas, minúsculas y acentos."
              />
              {simpleValidator.current.message('title', trackData.title, 'required|max:50', {
                className: 'text-danger',
                messages: { default: "Debes ingresar el Título de la Canción." },
                element: (message) => errorFormat(message)
              })}
            </Grid>

            <Grid item xs={3}>
              <TextField
                name="isrc"
                fullWidth
                id="isrc"
                variant="outlined"
                margin="normal"
                label="ISRC (Formato: CC-XXX-00-12345)"
                value={trackData.isrc}
                onChange={(event) => setTrackData({ ...trackData, isrc: event.target.value })}
                helperText="Completa sólo si ya tenés un Código ISRC. Formato: CC-XXX-00-12345"
              />
              {simpleValidator.current.message('isrc', trackData.isrc, 'max:20', {
                className: 'text-danger',
                messages: { default: "El formato del ISRC es inválido." },
                element: (message) => errorFormat(message)
              })}
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
            <TextField
              name="language"
              fullWidth
              id="language"
              required
              margin="normal"
              select
              label="Idioma de la Canción"
              value={trackData.track_language}
              onChange={handlerLanguageChoose}
            >
              {languages.map(language => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <ButtonWithInputFile
              textButton="Subir Archivo de Audio"
              onClickHandler={getTrackFromLocal}
              fileType="audio/wav, audio/x-wav"
              color="rose" />
          </Grid>

          {trackData.track && <Grid item xs={12}>
            <Success>{trackData.track.name}</Success>
          </Grid>}

        </Grid>

      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancelDialog} color="primary">
          Atras
        </Button>
        <Button onClick={allFieldsValidCreateTrack} color="primary">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const collaboratorsTitleStyle = { fontSize: "1.5em", textAlign: "center", paddingTop: "16px", paddingBottom: 0 };
const agregarArtistaTitleStyle = { fontSize: "1.5em", textAlign: "center" };