import React from "react";
import PropTypes from "prop-types";
import {
  Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Card, Fab
} from '@mui/material';
import { Image } from 'mui-image';
import Success from "components/Typography/Success";
import ProgressButton from 'components/CustomButtons/ProgressButton';
import PendingIcon from '@mui/icons-material/Pending';

const WaitingDialog = (props) => {

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

      <DialogActions sx={{ justifyContent: "center", paddingBottom: 3 }}>
        <ProgressButton
          textButton={"Esperando"}
          loading={isOpen}
          buttonState={'success'}
          onClickHandler={handleClose}
          successIcon={<PendingIcon sx={{ color: "rgba(255,255,255, 1)", width: "100%", height: "100%" }} />}
          noFab={false} />
      </DialogActions>
    </Dialog>
  )
}

export default WaitingDialog;

WaitingDialog.defaultProps = {
  isOpen: false,
}

WaitingDialog.propTypes = {
  contentTexts: PropTypes.array,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}

const successImageWrapperStyle = { marginTop: "1em", marginBottom: "1.5em", width: "14em", borderRadius: "4em", alignSelf: "center" };
