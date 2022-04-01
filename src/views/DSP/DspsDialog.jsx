import React, { useState } from "react";
import PropTypes from "prop-types";
import ProgressButton from 'components/CustomButtons/ProgressButton';
import {
  Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Grid, Divider
} from '@mui/material';
import CheckboxGroup from "components/Checkbox/CheckboxGroup";
import { dspsFuga } from '../../variables/fuga';
import BasicCheckbox from 'components/Checkbox/BasicCheckbox';
import { toWithOutError } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { albumsPublishAndDeliveryRedux } from '../../redux/actions/AlbumsActions';
import { getAlbumById, getDeliveredTitleDialog, getDeliveredContentTextDialog } from '../../utils/albums.utils';
import SuccessDialog from '../../components/Dialogs/SuccessDialog';
import { warningAppleDelivery } from "utils/textToShow.utils";

const checkboxGroupInfo = dspsFuga.map(dspInfo => {
  return {
    ...dspInfo, checked: false, label: dspInfo.dspName,
    checkBoxHelper: dspInfo.dspName === "Apple Music" ? warningAppleDelivery : "",
    onClickInfo: dspInfo.dspName === "Apple Music" ? () => console.log("APPLE WARNING") : ""
  }
});

const DspsDialog = (props) => {

  const { isOpen, handleClose, albumId } = props;

  const dispatch = useDispatch();
  const albums = useSelector(store => store.albums.albums);

  const [checkedDsps, setCheckedDsps] = useState(checkboxGroupInfo);
  const [deliveryState, setDeliveryState] = useState('none');

  const handleCheckAllDsps = () => {
    setCheckedDsps(checkedDsps.map(dsp => { return { ...dsp, checked: true } }))
  }

  const handleUncheckAllDsps = () => {
    setCheckedDsps(checkedDsps.map(dsp => { return { ...dsp, checked: false } }))
  }

  const handleCheckDsp = dsp => {
    console.log("DSP CHECKED: ", dsp);
    setCheckedDsps(checkedDsps.map(actualDsp => actualDsp.dspId !== dsp.dspId ? actualDsp : { ...dsp, checked: !dsp.checked }))
  }

  const handleDelivery = async () => {
    setDeliveryState('processing');
    let dspsToDelivery = checkedDsps.filter(dsp => dsp.checked);
    let albumFromStoreById = getAlbumById(albums, albumId);
    let responsePublishAndDelivery = await toWithOutError(dispatch(albumsPublishAndDeliveryRedux(albumFromStoreById, dspsToDelivery, dispatch)));
    if (responsePublishAndDelivery === "ERROR") return "ERROR";
    if (responsePublishAndDelivery === "PUBLISHED") { setDeliveryState('published'); return; }
    if (responsePublishAndDelivery === "DELIVERED") { setDeliveryState('delivered'); return; }
    handleClose();
  }

  let allCheckeds = checkedDsps.every(dsp => dsp.checked);
  let labelCheckAll = <p style={{ fontWeight: 500, color: 'black' }}>Selecciona todas las DSPs</p>
  let labelUncheckAll = <p style={{ fontWeight: 500, color: 'black' }}>Deselecciona todas las DSPs</p>

  let successDialogTitle = getDeliveredTitleDialog(deliveryState);
  let successDialogText = getDeliveredContentTextDialog(deliveryState);

  return (
    <Grid>
      <SuccessDialog isOpen={deliveryState !== 'none' && deliveryState !== 'processing'} title={successDialogTitle} contentTexts={successDialogText}
        handleClose={handleClose} successImageSource="/images/success.jpg" size="sm" />

      <Dialog
        maxWidth="md"
        id="info-dialog"
        fullWidth
        open={isOpen}
        onClose={handleClose}>

        <DialogTitle id="title-info-dialog">
          DSPs
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Selecciona las DSPs en las que quieres que tu música esté disponible.
          </DialogContentText>

          <BasicCheckbox checked={allCheckeds} label={allCheckeds ? labelUncheckAll : labelCheckAll} onChecked={allCheckeds ? handleUncheckAllDsps : handleCheckAllDsps} />

          <Grid item xs={12} textAlign="-moz-center">
            <Divider sx={dividerStyle} />
          </Grid>

          <CheckboxGroup allInfo={checkedDsps} onChange={handleCheckDsp} rowsLimit={25} />

        </DialogContent>

        <DialogActions>
          <Grid container spacing={2}>
            <Grid item xs={6} textAlign="initial">
              <Button onClick={handleClose} color="primary">
                Atrás
              </Button>
            </Grid>
            <Grid item xs={6} textAlign="end">
              <ProgressButton
                textButton={"Finalizar"}
                loading={deliveryState === 'processing'}
                buttonState={'none'}
                onClickHandler={handleDelivery}
                noFab={true}
                buttonProgressSx={buttonProgressStyle} />
            </Grid>
          </Grid>
        </DialogActions>

      </Dialog>
    </Grid>
  )
}

export default DspsDialog;

const dividerStyle = { width: "100%", borderColor: "rgba(0,0,0,0.2)", borderBottomWidth: "0.15em" };
const buttonProgressStyle = { color: 'green', position: 'absolute', marginTop: '3px', marginLeft: '-4em', zIndex: 1 };

DspsDialog.defaultProps = {
  isOpen: false,
}

DspsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  albumId: PropTypes.string.isRequired
}