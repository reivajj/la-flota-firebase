import React from "react";
import PropTypes from "prop-types";
import {
  Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Card, Fab
} from '@mui/material';
import { Check } from '@mui/icons-material/';
import { Image } from 'mui-image';
import Success from "components/Typography/Success";
import { buttonSuccessStyle } from '../../utils/commonStyles';

const SuccessDialog = (props) => {

  const { isOpen, handleClose, title, contentTexts, successImageSource, size, msgInGreen } = props;

  return (
    <Dialog
      maxWidth={size ? size : "xs"}
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
      <Card sx={successImageWrapperStyle}>
        <Image
          component="img"
          src={successImageSource}
          duration={30}
          alt="Felicitaciones!."
        />
      </Card>

      <DialogContentText key={"succes text"} sx={{ textAlign: "center" }}>
        <Success>{msgInGreen}</Success>
      </DialogContentText>

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

const successImageWrapperStyle = { marginTop: "1em", marginBottom: "1.5em", width: "14em", borderRadius: "4em", alignSelf: "center" };