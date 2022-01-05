import React from "react";
import PropTypes from "prop-types";
import {
  Button, Grid, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Delete } from '@mui/icons-material';
import ProgressButton from 'components/CustomButtons/ProgressButton';

const DeleteDialog = (props) => {
  const { isOpen, setIsOpen, title, textName, textContent, deleteAction, deleteButtonText, openLoader
  } = props;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      id="delete-dialog"
      open={isOpen}
      onClose={() => setIsOpen(false)}>
      <DialogTitle id="title-delete-dialog">
        <Typography sx={dialogTitleStyle}>{title}</Typography>
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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} >
            <Button
              variant="contained"
              fullWidth
              onClick={() => setIsOpen(false)}
              color="primary">
              Atrás
            </Button>
          </Grid>
          <Grid item xs={6}>
            <ProgressButton
              textButton={deleteButtonText}
              loading={openLoader}
              buttonState="delete"
              onClickHandler={deleteAction}
              noneIcon={<Delete />}
              noFab={true} />
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog;

const dialogTitleStyle = {
  fontWeight: "300px",
  fontSize: "30px",
  marginBottom: "3px",
}

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