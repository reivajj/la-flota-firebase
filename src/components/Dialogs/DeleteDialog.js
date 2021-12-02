import React from "react";
import PropTypes from "prop-types";
import {
  Button, Grid, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Delete } from '@mui/icons-material';

const DeleteDialog = (props) => {
  const { isOpen, setIsOpen, title, textName, textContent, deleteAction, deleteButtonText
  } = props;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      id="delete-dialog"
      open={isOpen}
      onClose={() => setIsOpen(false)}>
      <DialogTitle id="title-delete-dialog">
        <Typography variant="h2">{title}</Typography>
      </DialogTitle>
      <DialogContent>

        <DialogContentText id="content-delete-dialog">
          {textContent}
        </DialogContentText>

        <DialogContentText id="title-delete-dialog-elementTarget">
          {`Nombre: ${textName}`}
        </DialogContentText>

      </DialogContent>
      <DialogActions id="actions-delete-dialog">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setIsOpen(false)}
              color="primary">
              Atrás
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              endIcon={<Delete />}
              onClick={deleteAction}
              fullWidth
              style={{ backgroundColor: "#c50e29", color: "white" }}>
              {deleteButtonText}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog;

DeleteDialog.defaultProps = {
  isOpen: false,
  textContent: "Confirma que quieres eliminar",
  title: "Eliminar"
}

DeleteDialog.propTypes = {
  textContent: PropTypes.string,
  textName: PropTypes.string,
  title: PropTypes.string.isRequired,
  deleteButtonText: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired
}