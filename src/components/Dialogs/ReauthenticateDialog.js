import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
import {
  Button, Grid, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Alert
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Person } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { authUpdateEmail, authUpdatePassword, reauthenticateWithCredentialOk } from "../../services/AuthServices";
import { useDispatch, useSelector } from 'react-redux';
import { userDataUpdateRedux } from "../../redux/actions/UserDataActions";

const ReauthenticateDialog = ({ isOpen, setIsOpen }) => {

  const dispatch = useDispatch();
  const userData = useSelector(store => store.userData);

  let [reauthSuccess, setReauthSuccess] = useState("wait");

  const handleReauthenticate = async () => {
    console.log("Credentials enviadas: ", { currentEmail, currentPassword });
    const resultReauthenticate = await reauthenticateWithCredentialOk(currentEmail, currentPassword);
    console.log("Result reauth: ", resultReauthenticate);
    if (resultReauthenticate) setReauthSuccess(true);
    else setReauthSuccess(false);
  }

  const updateEmail = async newEmail => {
    const resultUpdateEmail = await authUpdateEmail(newEmail);
    if (resultUpdateEmail) {
      console.log("Email actualizado");
      dispatch(userDataUpdateRedux({ email: newEmail, id: userData.id, rol: userData.rol }));
      setIsOpen(false);
    }
    else console.log("Hubo un problema al actualizar el email");
  }

  const updatePassword = async newPassword => {
    const resultUpdatePassword = await authUpdatePassword(newPassword);
    if (resultUpdatePassword) {
      console.log("Password actualizado");
      setIsOpen(false);
    }
    else console.log("Hubo un problema al actualizar la password");
  }

  const handleUpdateCredentials = async () => {
    console.log("Handel update credentiasl");
    if (currentEmail !== "") await updateEmail(currentEmail);
    if (currentPassword !== "" && currentPassword.toString() === repeatPassword.toString()) await updatePassword(currentPassword);
  }

  const handleCloseDialog = () => {
    setReauthSuccess("wait");
    setCurrentEmail("");
    setCurrentPassword("");
    setIsOpen(false);
  }

  let [currentEmail, setCurrentEmail] = useState('');
  let [currentPassword, setCurrentPassword] = useState('');
  let [repeatPassword, setRepeatPassword] = useState('');

  useEffect(() => {
    if (reauthSuccess || !isOpen) {
      setCurrentEmail("");
      setCurrentPassword("");
    }
  }, [reauthSuccess, isOpen])

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      id="reauthenticate-dialog"
      open={isOpen}
      onClose={handleCloseDialog}>
      <DialogTitle id="title-reauthenticate-dialog">
        <Typography variant="h3" component="span">{
          `${(reauthSuccess === true) ? "Puedes editar tu Email, tu Contrase??a o ambas" : "Ingresa tu email y contrase??a actuales"}`
        }</Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="title-delete-dialog-elementTarget">
          {`${(reauthSuccess === true)
            ? "Si no quieres cambiar tu Email, solo ingresa una nueva contrase??a." 
            : "Debes reingresar tus credenciales para confirmar que eres el due??o de la cuenta."}`}
        </DialogContentText>

        {!reauthSuccess &&
          <Alert severity="error">
            Combinaci??n Usuario/Constrase??a incorrecta
          </Alert>}

        <TextField
          margin="normal"
          required
          fullWidth
          label={`${(reauthSuccess === true) ? "Nuevo " : ""}Correo Electr??nico`}
          autoFocus
          value={currentEmail}
          onChange={(evento) => setCurrentEmail(evento.target.value)}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label={`${(reauthSuccess === true) ? "Nueva " : ""}Contrase??a`}
          type="password"
          value={currentPassword}
          onChange={(evento) => setCurrentPassword(evento.target.value)}
        />

        {(reauthSuccess === true) &&
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Confirma la nueva contrase??a"
            type="password"
            value={currentPassword}
            onChange={(evento) => setRepeatPassword(evento.target.value)}
          />}
      </DialogContent>

      <DialogActions id="actions-reauthenticate-dialog">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCloseDialog}
              color="primary">
              Atr??s
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              endIcon={<Person />}
              onClick={() => (reauthSuccess === true) ? handleUpdateCredentials() : handleReauthenticate()}
              fullWidth>
              {`${(reauthSuccess === true) ? "Confirmar" : "Reingresar"}`}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default ReauthenticateDialog;

// ReauthenticateDialog.defaultProps = {
//   isOpen: false,
//   textContent: "Confirma que quieres eliminar",
//   title: "Eliminar"
// }

// ReauthenticateDialog.propTypes = {
//   textContent: PropTypes.string,
//   textName: PropTypes.string,
//   title: PropTypes.string.isRequired,
//   deleteButtonText: PropTypes.string,
//   isOpen: PropTypes.bool.isRequired,
//   setIsOpen: PropTypes.func.isRequired,
//   deleteAction: PropTypes.func.isRequired
// }