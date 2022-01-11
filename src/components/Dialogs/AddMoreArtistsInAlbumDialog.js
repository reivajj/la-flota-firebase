import React from "react";
import PropTypes from "prop-types";
import {
  Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions
} from '@mui/material';
import Typography from '@mui/material/Typography';

const AddMoreArtistsInAlbumDialog = (props) => {

  const { isOpen, handleClose, title } = props;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      id="collaborative-dialog"
      open={isOpen}
      onClose={handleClose}>

      <DialogTitle id="title-info-dialog">
        <Typography variant="h4">{title}</Typography>
      </DialogTitle>

      {/* <DialogContent>
        <DialogContentText key={index}>
          {contentText}
        </DialogContentText>
      </DialogContent> */}

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddMoreArtistsInAlbumDialog;

AddMoreArtistsInAlbumDialog.defaultProps = {
  isOpen: false,
}

AddMoreArtistsInAlbumDialog.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}