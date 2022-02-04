import React from "react";
import PropTypes from "prop-types";
import {
  Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Card, CardMedia
} from '@mui/material';

const ImageDialog = (props) => {

  const { isOpen, handleClose, title, contentTexts, imageSource } = props;

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
        {contentTexts.map((contentText, index) =>
          <DialogContentText key={index}>
            {contentText}
          </DialogContentText>
        )}
        <Card sx={{ marginTop: "1em" }}>
          <CardMedia 
            component="img"
            image={imageSource}
            alt="Ejemplo de dos Artistas Principales."
          />
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog >
  )
}

export default ImageDialog;

ImageDialog.defaultProps = {
  isOpen: false,
}

ImageDialog.propTypes = {
  contentTexts: PropTypes.array,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}