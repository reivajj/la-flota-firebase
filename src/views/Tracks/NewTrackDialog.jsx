import React, { useRef, useEffect } from "react";
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
import BasicSwitch from "components/Switch/BasicSwitch";
import { languages } from "variables/varias";
import { errorFormat, useForceUpdate } from "utils";

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

export const NewTrackDialog = (props) => {

  let { openDialog, setOpenNewTrackDialog, setTracksDataTable, tracksDataTable, trackData, setTrackData, circularProgress } = props;

  const dispatch = useDispatch();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserId = useSelector(store => store.userData.id);

  // Luego sacar Spanish y pedirlo en el Form.
  useEffect(() => {
    setTrackData({
      ...trackData, explicit: false,
      position: tracksDataTable.length + 1, title: "", track: "",
      price: "", lyrics: "", isrc: "", track_language: "",
      other_artists: "", composers: "", producers: "",
    });
  }, [tracksDataTable]);

  const handleCancelDialog = () => {
    setOpenNewTrackDialog(false);
    setTrackData({
      ...trackData, explicit: false,
      position: tracksDataTable.length + 1, title: "", track: "",
      price: "", lyrics: "", isrc: "", track_language: "",
      other_artists: "", composers: "", producers: "", progress: 0
    });
  }

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

  const getTrackFromLocal = (event) => setTrackData({ ...trackData, track: event.target.files[0] });
  
  const handlerLanguageChoose = event => setTrackData({ ...trackData, track_language: event.target.value });

  const handleExplicitChange = newExplicitEvent => {
    setTrackData({ ...trackData, explicit: newExplicitEvent.target.checked });
  }

  return (
    <Dialog
      open={openDialog}
      onClose={handleCancelDialog}
      aria-labelledby="form-dialog-title"
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">Crear Nuevo Track</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deberás proveer la información de la Canción a agregar.
        </DialogContentText>
        <Grid container spacing={2} style={{ textAlign: "center" }} >
          <Grid item xs={3}>
            <TextField
              name="artista"
              fullWidth
              id="artista"
              variant="outlined"
              required
              disabled
              margin="normal"
              label="Artista de la Canción"
              value={trackData.primary_artist}
            />
            {simpleValidator.current.message('artista', trackData.primary_artist, 'required|max:50', {
              className: 'text-danger',
              messages: { default: "Debes seleccionar un Artista primero." },
              element: (message) => errorFormat(message)
            })}
          </Grid>

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
              label="ISRC"
              value={trackData.isrc}
              onChange={(event) => setTrackData({ ...trackData, isrc: event.target.value })}
              helperText="Completa sólo si ya tenés un Código ISRC. Mostrar Formato!"
            />
            {simpleValidator.current.message('isrc', trackData.isrc, 'max:20', {
              className: 'text-danger',
              messages: { default: "El formato del ISRC es inválido." },
              element: (message) => errorFormat(message)
            })}
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="other_artists"
              fullWidth
              id="other_artists"
              variant="outlined"
              margin="normal"
              label="Artistas Invitados"
              value={trackData.other_artists}
              onChange={(event) => setTrackData({ ...trackData, other_artists: event.target.value })}
              helperText="Artista/s Invitado/s de la Canción, separados por comas.
                Ejemplos: Juanes, Francisco Lopez"
            />
            {simpleValidator.current.message('other_artists', trackData.other_artists, 'max:50', {
              className: 'text-danger',
              messages: { default: "No puedes ingresar más de 50 carácteres." },
              element: (message) => errorFormat(message)
            })}
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="composers"
              fullWidth
              id="composers"
              required
              variant="outlined"
              margin="normal"
              label="Compositor/es"
              value={trackData.composers}
              onChange={(event) => setTrackData({ ...trackData, composers: event.target.value })}
              helperText="Ingresá el nombre completo y real de el/los compositor/es, separados por coma. "
            />
            {simpleValidator.current.message('composers', trackData.composers, 'required|max:70', {
              className: 'text-danger',
              messages: { default: "Debes ingresar el/los compositor/es de la Canción." },
              element: (message) => errorFormat(message)
            })}
          </Grid>

          <Grid item xs={6}>
            <TextField
              name="producers"
              fullWidth
              id="producers"
              required
              variant="outlined"
              margin="normal"
              label="Productor/es"
              value={trackData.producers}
              onChange={(event) => setTrackData({ ...trackData, producers: event.target.value })}
              helperText="Ingresá el nombre completo y real de el/los Productor/es, separados por coma. "
            />
            {simpleValidator.current.message('producers', trackData.producers, 'required|max:70', {
              className: 'text-danger',
              messages: { default: "Debes ingresar el/los compositor/es de la Canción." },
              element: (message) => errorFormat(message)
            })}
          </Grid>

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

          <Grid item xs={2}>
            <BasicSwitch
              label="Explicito"
              onChange={handleExplicitChange}
              checked={trackData.explicit} />
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
