import React from "react";
import PropTypes from "prop-types";
import {
  Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions
} from '@mui/material';
import { appleCriteriaTitle } from 'utils/textToShow.utils';

export const appleCriteriaText = [
  <p style={{ fontWeight: 500 }}>Debido a las exigencias sobre el criterio de calidad requerido por Apple Music,</p>,
  <p style={{ fontWeight: 500 }}>si deseas enviar tu lanzamiento a esa DSP, primero debes cumplir la siguiente</p>,
  <p style={{ fontWeight: 500 }}>lista de requisitos para que no demore o sea rechazado:</p>,
  <br />,
  "Todos los nombres de artistas que estén en el arte de tapa, deberán estar presentes en la metadata del lanzamiento.",
  "El título del lanzamiento debe coincidir 100% con el que aparece en el arte de tapa",
  `"Volumen" y "Parte" deben estar abreviadas como: Vol. 1 / Pt. 1`,
  <br />,
  <b>Tampoco se aceptan: </b>,
  <li>Imágenes Pixeladas o borrosas</li>,
  <li>Arte de tapa genérico (osea, sin metadata)</li>,
  <li>Nombres del sello y / o cualquier texto que no sea específico del nombre del lanzamiento / single o nombre de artista.</li>,
  <li>Arte de tapa ya usado en otro lanzamiento</li>,
  <li>Imágenes con transparencias</li>,
  <li>Imágenes rotadas</li>,
  <li>Imágenes recortadas / texto en las imágenes que no sean parte de la metadata del lanzamiento</li>,
  <li>Imagenes con URL o referencias a otros sitios o DSPs</li>,
  <li>Pornografía(desnudos sutiles o pechos está ok)</li>,
  <li>Hacer referencia a iTunes / Apple Music y / o a otros competidores, incluidos logos.</li>,
  <li>Hacer referencia a formatos físicos("CD" / "compact disk" / barcodes / códigos de barra)</li>,
  <li>Propaganda NAZI</li>,
  <br />,
  "Ademas debe cumplir con los el siguiente criterio de formato de lanzamiento:",
  "● ",
  "● ",
  "● "
]

const AppleCriteriaDialog = (props) => {

  const { isOpen, handleCloseOk, handleCloseUncheckApple } = props;

  return (
    <Dialog
      maxWidth="md"
      id="info-apple-dialog"
      open={isOpen}
      onClose={handleCloseOk}>

      <DialogTitle id="title-apple-info-dialog">
        {appleCriteriaTitle}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ fontWeight: 600 }} key={1}>
          Debido a las exigencias sobre el criterio de calidad requerido por Apple Music,
          si deseas enviar tu lanzamiento a esa DSP, primero debes cumplir la siguiente
          lista de requisitos para que no demore o sea rechazado:
        </DialogContentText>

        <DialogContentText key={2}>
          <ul>
            <li>Todos los nombres de artistas que estén en el arte de tapa, deberán estar presentes en la metadata del lanzamiento.</li>
            <li>El título del lanzamiento debe coincidir 100% con el que aparece en el arte de tapa.</li>
            <li>"Volumen" y "Parte" deben estar abreviadas como: Vol. 1 / Pt. 1.</li>
            <li>Sólo menciona a un artista en el nivel del lanzamiento si participa en todas las canciones del mismo.</li>
          </ul>
        </DialogContentText>

        <DialogContentText key={3} sx={{ paddingTop: "1em" }}>
          <b>Tampoco se aceptan: </b>
          <ul>
            <li>Imágenes Pixeladas o borrosas</li>
            <li>Arte de tapa genérico (osea, sin metadata)</li>
            <li>Nombres del sello y / o cualquier texto que no sea específico del nombre del lanzamiento / single o nombre de artista.</li>
            <li>Arte de tapa ya usado en otro lanzamiento</li>
            <li>Imágenes con transparencias</li>
            <li>Imágenes rotadas</li>
            <li>Imágenes recortadas / texto en las imágenes que no sean parte de la metadata del lanzamiento</li>
            <li>Imagenes con URL o referencias a otros sitios o DSPs</li>
            <li>Pornografía(desnudos sutiles o pechos está ok)</li>
            <li>Hacer referencia a iTunes / Apple Music y / o a otros competidores, incluidos logos.</li>
            <li>Hacer referencia a formatos físicos("CD" / "compact disk" / barcodes / códigos de barra)</li>
            <li>Propaganda NAZI</li>
          </ul>
        </DialogContentText>

        <DialogContentText key={4} sx={{ paddingTop: "1em" }}>
          <b>Ademas debe cumplir con los el siguiente criterio de formato de lanzamiento: </b>
          <ul>
            <li>1 - 3 tracks: Single(excepto cuando uno de los tracks supera los 10 minutos, en ese caso se considera EP).</li>
            <li>4 - 6 tracks: EP(excepto cuando la duración total de todos los tracks supera los 30 minutos, en ese caso se considera lanzamiento).</li>
            <li>7 + tracks: Album.</li>
          </ul>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-evenly"}}>
        <Button onClick={handleCloseUncheckApple} color="primary">
          No enviar a Apple Music
        </Button>
        <Button onClick={handleCloseOk} color="primary">
          Enviar a Apple Music
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AppleCriteriaDialog;

AppleCriteriaDialog.defaultProps = {
  isOpen: false,
  title: "",
  contentText: ""
}

AppleCriteriaDialog.propTypes = {
  contentTexts: PropTypes.array,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}