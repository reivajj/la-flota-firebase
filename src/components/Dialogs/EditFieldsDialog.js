import React from "react";
// import PropTypes from "prop-types";
import {
  Button, Grid, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, 
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';

const EditFieldsDialog = ({ isOpenWithFieldsInfo, setIsOpenWithFieldsInfo, handleCloseDialog, handleConfirmEdit }) => {

  const handleChangeValue = (evento) => {
    setIsOpenWithFieldsInfo({ open: true, info: { ...isOpenWithFieldsInfo.info, fieldValue: evento.target.value } })
  }

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      id="reauthenticate-dialog"
      open={isOpenWithFieldsInfo.open}
      onClose={handleCloseDialog}>
      <DialogTitle id="title-reauthenticate-dialog">
        <Typography variant="h3" component="span">{
          `Editar ${isOpenWithFieldsInfo.info.fieldDisplayName} del paciente`
        }</Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="title-delete-dialog-elementTarget">
          Puedes editar a este paciente porque tú mismo lo creaste, si el paciente luego se genera un
          usuario en TurnoSi, él será quien deba ingresar su información.
        </DialogContentText>

        <TextField
          margin="normal"
          required
          fullWidth
          label={`${isOpenWithFieldsInfo.info.fieldDisplayName}`}
          autoFocus
          value={isOpenWithFieldsInfo.info.fieldValue}
          onChange={handleChangeValue}
        />

      </DialogContent>

      <DialogActions id="actions-reauthenticate-dialog">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCloseDialog}
              color="primary">
              Atrás
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={handleConfirmEdit}
              fullWidth>
              Confirmar
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default EditFieldsDialog;

// EditFieldsDialog.defaultProps = {
//   isOpen: false,
//   textContent: "Confirma que quieres eliminar",
//   title: "Eliminar"
// }

// EditFieldsDialog.propTypes = {
//   textContent: PropTypes.string,
//   textName: PropTypes.string,
//   title: PropTypes.string.isRequired,
//   deleteButtonText: PropTypes.string,
//   isOpen: PropTypes.bool.isRequired,
//   setIsOpen: PropTypes.func.isRequired,
//   deleteAction: PropTypes.func.isRequired
// }