import React, { useState } from "react";
// import PropTypes from "prop-types";
import {
  Button, Grid, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import ProgressButton from 'components/CustomButtons/ProgressButton';
import { AddCircleOutline } from '@mui/icons-material/';

const EditOrAddFieldsDialog = ({ isOpen, handleCloseDialog, handleConfirm, title, subtitle, labelTextField, loading, buttonState }) => {

  const [value, setValue] = useState("");
  const addCircleIcon = <AddCircleOutline />;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      id="edit-or-add-dialog"
      open={isOpen}
      onClose={handleCloseDialog}>
      <DialogTitle id="edit-or-add-field-dialog-title">
        <Typography sx={{ fontSize: "1.5em", fontWeight: 500 }} component="span">{title}</Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="edit-or-add-field-dialog-subtitle">
          {subtitle}
        </DialogContentText>

        <TextField
          margin="normal"
          required
          fullWidth
          label={labelTextField}
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />

      </DialogContent>

      <DialogActions id="edit-or-add-field-dialog-actions">
        <Grid container spacing={2}>

          <Grid item xs={6}>
            <Button
              variant="contained"
              sx={buttonMainColor}
              fullWidth
              onClick={handleCloseDialog}
              color="primary">
              Atrás
            </Button>
          </Grid>

          <Grid item xs={6}>
            <ProgressButton
              textButton={"Confirmar"}
              loading={loading}
              buttonState={buttonState}
              onClickHandler={() => handleConfirm(value)}
              noneIcon={addCircleIcon}
              noFab={true}
              buttonFullWidth={true} />
          </Grid>

        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default EditOrAddFieldsDialog;

const buttonMainColor = { backgroundColor: "#9c27b0", '&:hover': { backgroundColor: "#9c27b0" } };

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