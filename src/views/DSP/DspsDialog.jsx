import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Grid, Divider
} from '@mui/material';
import CheckboxGroup from "components/Checkbox/CheckboxGroup";
import BasicCheckbox from 'components/Checkbox/BasicCheckbox';
import { useDispatch } from 'react-redux';
import { albumAddDspsStore } from '../../redux/actions/AlbumsActions';
import AppleCriteriaDialog from './AppleCriteriaDialog';
import { updateAddingAlbumRedux } from 'redux/actions/AlbumsActions';

const DspsDialog = ({ isOpen, setIsOpen, currentAlbumData }) => {

  const dispatch = useDispatch();

  const [openAppleCriteria, setOpenAppleCriteria] = useState(false);
  const [showAtLeastOneDspMustBeSelected, setShowAtLeastOneDspMustBeSelected] = useState(false);
  const [checkedDsps, setCheckedDsps] = useState(currentAlbumData.dsps);

  useEffect(() => {
    if (checkedDsps.filter(dsp => dsp.checked).length === 0) setShowAtLeastOneDspMustBeSelected(true);
    else setShowAtLeastOneDspMustBeSelected(false);
  }, [checkedDsps])

  const handleCheckAllDsps = () => {
    setCheckedDsps(checkedDsps.map(dsp => { return { ...dsp, checked: true } }));
  }

  const handleUncheckAllDsps = () => {
    setCheckedDsps(checkedDsps.map(dsp => { return { ...dsp, checked: false } }));
  }

  const handleCheckDsp = dsp => {
    setCheckedDsps(checkedDsps.map(actualDsp => actualDsp.dspId !== dsp.dspId ? actualDsp : { ...dsp, checked: !dsp.checked }));
  }

  const appleIsChecked = dsps => dsps.find(dsp => dsp.dspName === "Apple Music" && dsp.checked);

  const handleCloseDsps = () => {
    if (checkedDsps.filter(dsp => dsp.checked).length === 0) {
      setShowAtLeastOneDspMustBeSelected(true);
      return;
    }
    if (appleIsChecked(checkedDsps)) {
      setOpenAppleCriteria(true);
      return;
    }
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, dsps: checkedDsps }));
    setIsOpen(false);
  }

  let allCheckeds = checkedDsps.every(dsp => dsp.checked);
  let labelCheckAll = <p style={{ fontWeight: 500, color: 'black' }}>Selecciona todas las DSPs</p>
  let labelUncheckAll = <p style={{ fontWeight: 500, color: 'black' }}>Deselecciona todas las DSPs</p>

  const uncheckAppleDsp = () => {
    let dspsWithAppleUnchecked = checkedDsps.map(dsp => {
      if (dsp.dspName === "Apple Music") dsp.checked = false;
      return dsp;
    })
    setOpenAppleCriteria(false);
    setCheckedDsps(dspsWithAppleUnchecked);
    dispatch(albumAddDspsStore(currentAlbumData, dspsWithAppleUnchecked.filter(dsp => dsp.checked)));
    setIsOpen(false);
  }

  const handleCloseAppleCriteriaOk = () => {
    setOpenAppleCriteria(false);
    dispatch(albumAddDspsStore(currentAlbumData, checkedDsps.filter(dsp => dsp.checked)));
    setIsOpen(false);
  }

  return (
    <Grid>
      <AppleCriteriaDialog isOpen={openAppleCriteria} handleCloseOk={handleCloseAppleCriteriaOk}
        handleCloseUncheckApple={uncheckAppleDsp} />

      <Dialog
        maxWidth="md"
        id="info-dialog"
        fullWidth
        open={isOpen}
        onClose={handleCloseDsps}>

        <DialogTitle id="title-info-dialog">
          DSPs
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Selecciona las DSPs en las que quieres que tu música esté disponible.
          </DialogContentText>

          <BasicCheckbox checked={allCheckeds} label={allCheckeds ? labelUncheckAll : labelCheckAll} onChecked={allCheckeds ? handleUncheckAllDsps : handleCheckAllDsps} />

          {showAtLeastOneDspMustBeSelected &&
            <DialogContentText>
              <p style={{ fontWeight: 500, fontSize: "medium", color: 'red' }}>Deberás elegir al menos una DSP</p>
            </DialogContentText>}

          <Grid item xs={12} textAlign="-moz-center">
            <Divider sx={dividerStyle} />
          </Grid>

          <CheckboxGroup allInfo={checkedDsps} onChange={handleCheckDsp} rowsLimit={25} />

        </DialogContent>

        <DialogActions textAlign="center">
          <Button onClick={handleCloseDsps} color="primary">
            Continuar
          </Button>
        </DialogActions>

      </Dialog>
    </Grid>
  )
}

export default DspsDialog;

const dividerStyle = { width: "100%", borderColor: "rgba(0,0,0,0.2)", borderBottomWidth: "0.15em" };

DspsDialog.defaultProps = {
  isOpen: false,
}

DspsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  albumId: PropTypes.string.isRequired
}