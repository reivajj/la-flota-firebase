import React from "react";
import PropTypes from "prop-types";
import {
  Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions
} from '@mui/material';
import Typography from '@mui/material/Typography';

const InfoDialog = (props) => {

  const { isOpen, handleClose, title, contentTexts } = props;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      id="info-dialog"
      open={isOpen}
      onClose={handleClose}>
      <DialogTitle id="title-info-dialog">
        <Typography variant="h4">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        {contentTexts.map((contentText, index) =>
          <DialogContentText key={index}>
            {contentText}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default InfoDialog;

InfoDialog.defaultProps = {
  isOpen: false,
}

InfoDialog.propTypes = {
  contentTexts: PropTypes.array,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}