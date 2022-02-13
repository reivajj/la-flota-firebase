import React from "react";
import PropTypes from "prop-types";
import {
  Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions
} from '@mui/material';
import { green } from '@mui/material/colors';
import { Fab } from '@mui/material';
import { Check } from '@mui/icons-material/';

const SuccessDialog = (props) => {

  const { isOpen, handleClose, title, contentTexts } = props;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      id="success-dialog"
      open={isOpen}
      onClose={handleClose}>
      <DialogTitle id="title-success-dialog">
        {title}
      </DialogTitle>
      <DialogContent>
        {contentTexts.map((contentText, index) =>
          <DialogContentText key={index}>
            {contentText}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Fab
          aria-label="success"
          sx={buttonSuccessStyle}
          onClick={handleClose}
        >
          <Check sx={{ color: "rgba(255,255,255, 1)" }} />
        </Fab>
      </DialogActions>
    </Dialog>
  )
}

export default SuccessDialog;

SuccessDialog.defaultProps = {
  isOpen: false,
}

SuccessDialog.propTypes = {
  contentTexts: PropTypes.array,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}

const buttonSuccessStyle = {
  backgroundColor: green[500],
  '&:hover': {
    backgroundColor: green[700],
  },
}