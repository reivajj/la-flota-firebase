import React, { useRef } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// import InputLabel from "@material-ui/core/InputLabel";
// core components
import Button from "components/CustomButtons/Button.js";
import SimpleReactValidator from "simple-react-validator";
import useForceUpdate from 'components/Varios/ForceUpdate.js';
import Danger from 'components/Typography/Danger.js';
import Success from "components/Typography/Success";
import {
  TextField, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from "@material-ui/core";
import { useDispatch, useSelector } from 'react-redux';
import { createTrackLocalRedux } from '../../redux/actions/TrackActions';
import ButtonWithInputFile from 'components/CustomButtons/ButtonWithInputFile';


let errorFormat = (message) => (
  <Danger color="error" variant="h6">{message}</Danger>
)

const NewTrackDialog = ({ openDialog, handleCancelDialog, handleSubscribeDialog, trackData, setTrackData }) => {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserId = useSelector(store => store.userData.id);

  const allFieldsValidCreateTrack = () => {
    if (simpleValidator.current.allValid()) {
      handleSubscribeDialog();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate();
    }
  }

  const createTrack = async () => {
    dispatch(createTrackLocalRedux({}, currentUserId));
  }

  const getTrackFromLocal = (event) => {
    const trackFile = event.target.files[0];
    setTrackData({ ...trackData, track: trackFile });
    console.log("El audio: ", trackFile);
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
            >
              {simpleValidator.current.message('title', trackData.title, 'required', {
                className: 'text-danger',
                messages: { default: "Debes ingresar el Título de la Canción." },
                element: (message) => errorFormat(message)
              })}
            </TextField>
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
            >
              {simpleValidator.current.message('isrc', trackData.isrc, 'max:20', {
                className: 'text-danger',
                messages: { default: "El formato del ISRC es inválido." },
                element: (message) => errorFormat(message)
              })}
            </TextField>
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
                Ejemplos: Spotify, Apple"
            >
              {simpleValidator.current.message('other_artists', trackData.other_artists, 'max:50', {
                className: 'text-danger',
                messages: { default: "No puedes ingresar más de 50 carácteres." },
                element: (message) => errorFormat(message)
              })}
            </TextField>
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
            >
              {simpleValidator.current.message('composers', trackData.composers, 'required', {
                className: 'text-danger',
                messages: { default: "Debes ingresar el/los compositor/es de la Canción." },
                element: (message) => errorFormat(message)
              })}
            </TextField>
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
              value={trackData.composers}
              onChange={(event) => setTrackData({ ...trackData, producers: event.target.value })}
              helperText="Ingresá el nombre completo y real de el/los Productor/es, separados por coma. "
            >
              {simpleValidator.current.message('producers', trackData.producers, 'max:50', {
                className: 'text-danger',
                messages: { default: "Debes ingresar el/los compositor/es de la Canción." },
                element: (message) => errorFormat(message)
              })}
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
          Cancel
        </Button>
        <Button onClick={allFieldsValidCreateTrack} color="primary">
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewTrackDialog;
