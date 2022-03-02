import React from "react";
import PropTypes from "prop-types";
import {
  Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Typography, Grid
} from '@mui/material';

const UserDialog = (props) => {

  const { userData, isOpen, handleClose, title, contentTexts } = props;

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      id="info-dialog"
      open={isOpen}
      onClose={handleClose}>
      <DialogTitle id="title-info-dialog">
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom sx={importantTextStyle}>
          {`Email: ${userData.email}`}
        </Typography>

        <Typography variant="body2" gutterBottom sx={importantTextStyle}>
          {`Password: ${userData.password}`}
        </Typography>

        <Grid item xs={12} sx={{ paddingTop: "1em" }}>
          <Typography sx={importantTextStyle}>
            {`Nombre y Apellido: ${userData.nombre} ${userData.apellido}`}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography sx={importantTextStyle}>
            {`Plan: ${userData.plan}`}
          </Typography>
        </Grid>

        <Grid item xs container sx={{ paddingTop: "1em" }}>

          <Grid item xs={12}>
            <Typography sx={moreInfoTextStyle}>
              {`Último Inicio de Sesión: ${userData.lastTimeSignedInString}`}
            </Typography>
          </Grid>


          <Grid item xs={12}>
            <Typography sx={moreInfoTextStyle}>
              {`Ciudad: ${userData.ciudad}`}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography sx={moreInfoTextStyle}>
              {`Id en La Flota Nuevo Sistema: ${userData.id}`}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography sx={moreInfoTextStyle}>
              {`Id en La Flota Wordpress: ${userData.userIdWp}`}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>

    </Dialog>
  )
}

export default UserDialog;

const importantTextStyle = { color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap", margin: "0", fontWeight: 400, fontSize: "1em", marginBottom: "0" };
const moreInfoTextStyle = { color: "rgba(0,0,0,0.4)", whiteSpace: "nowrap", margin: "0", fontWeight: 300, fontSize: "1em", marginBottom: "0" };
const selloTextStyle = { color: "rgba(0,0,0,0.7)", whiteSpace: "nowrap", margin: "0", fontWeight: 400, fontSize: "1em", marginBottom: "0" };

UserDialog.defaultProps = {
  isOpen: false,
  title: "",
  contentText: ""
}

UserDialog.propTypes = {
  contentTexts: PropTypes.array,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}
