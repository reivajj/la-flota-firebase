import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, DialogContentText
} from '@mui/material';
import { toWithOutError } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import SuccessDialog from '../../components/Dialogs/SuccessDialog';
import DeleteDialog from '../../components/Dialogs/DeleteDialog';
import { Delete, Edit } from '@mui/icons-material/';
import { mainBlue, lightBlue, grayColor } from 'variables/colors';
import EditOrAddFieldsDialog from '../../components/Dialogs/EditOrAddFieldDialog';
import { getPayoutById } from "utils/payouts.utils";
import { payoutDeleteRedux } from "redux/actions/PayoutsActions";
import { addMpIdSubtitle, completePayoutSubtitle } from "utils/textToShow.utils";
import { payoutCompleteRequestRedux, payoutEditRedux } from '../../redux/actions/PayoutsActions';

const PayoutActionsDialog = (props) => {

  const { isOpen, handleClose, payoutId } = props;

  const dispatch = useDispatch();
  const payouts = useSelector(store => store.payouts.payouts);

  const payout = getPayoutById(payouts, payoutId);

  const [loading, setLoading] = useState(false);
  const [buttonState, setButtonState] = useState('none');
  const [completePayoutState, setCompletePayoutState] = useState('none');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState({ open: false, title: "", subtitle: [""] })

  let successDialogTitle = "Pago actualizado correctamente.";
  let successDialogText = ["Se le envío un Email al usuario para notificarlo."];

  const handleCloseDelete = () => setOpenDeleteDialog(false);

  const handleDelete = async () => {
    setLoading(true);
    let result = await toWithOutError(dispatch(payoutDeleteRedux(payoutId)));
    if (result === "ERROR") { setButtonState("error"); setLoading(false); }
    else { setLoading(false); setOpenDeleteDialog(false); handleClose(); }
  }

  const handleAddPayId = () => setOpenEditDialog({
    open: true, title: "ID del Pago", subtitle: completePayoutSubtitle, handleConfirm: (payId) => handleCompletePayout(payId),
    initialValues: ""
  });

  const handleAddMpId = () => setOpenEditDialog({
    open: true, title: "ID de Mercado Pago del Pago", subtitle: addMpIdSubtitle, handleConfirm: (mpId) => handleAddMpIdPayout(mpId),
    initialValues: ""
  });

  const handleAddMpIdPayout = async mpId => {
    setButtonState("loading");
    let editResult = await toWithOutError(dispatch(payoutEditRedux({ ...payout, mpId })));
    if (editResult === "ERROR") { setButtonState("error"); return; }
    setButtonState("none");
    setOpenEditDialog({ open: false, title: "", subtitle: "" });
  }

  const handleCompletePayout = async payId => {
    setButtonState("loading");
    let editResult = await toWithOutError(dispatch(payoutCompleteRequestRedux(payout, payId)));
    if (editResult === "ERROR") { setButtonState("error"); return; }
    setButtonState("none");
    setOpenEditDialog({ open: false, title: "", subtitle: "" });
  }

  const handleCloseEditDialog = () => setOpenEditDialog({ open: false, title: "", subtitle: [""] });
  console.log("PAYOUT: ", payout);
  return (
    <>
      <SuccessDialog isOpen={completePayoutState !== 'none' && completePayoutState !== 'processing'} title={successDialogTitle}
        contentTexts={successDialogText} handleClose={() => setCompletePayoutState('none')}
        successImageSource="/images/success.jpg" size="sm" />

      <DeleteDialog isOpen={openDeleteDialog} setIsOpen={setOpenDeleteDialog} handleClose={handleCloseDelete}
        title={"Eliminar Solicitud"} textName={payout.ownerEmail} textContent={['']}
        deleteAction={handleDelete} deleteButtonText={"Eliminar"} openLoader={loading} buttonState={'delete'}
      />

      <EditOrAddFieldsDialog isOpen={openEditDialog.open} handleCloseDialog={handleCloseEditDialog} handleConfirm={openEditDialog.handleConfirm}
        title={openEditDialog.title} subtitle={openEditDialog.subtitle} loading={buttonState === "loading"}
        buttonState={buttonState} initialValues={openEditDialog.initialValues} type={""} optionsValues={openEditDialog.optionsValues} />

      <Dialog
        maxWidth="sm"
        id="info-dialog"
        open={isOpen}
        onClose={handleClose}>

        <DialogTitle id="title-info-dialog">
          {`Acciones para la solicitud del usuario: ${payout.ownerEmail}`}
        </DialogTitle>

        <DialogContent>
          <DialogContentText key={'subtitle'}>
            <p style={{ fontSize: "20px" }}><b>Información del Pago</b></p>
          </DialogContentText>

          {payout.userName && <DialogContentText key={0}>
            Nombre Usuario: <b>{`${payout.userName} ${payout.userLastName}`}</b>
          </DialogContentText>}

          {payout.userCuit && <DialogContentText key={1}>
            CUIT: <b>{`${payout.userCuit}`}</b>
          </DialogContentText>}

          {payout.cbuCvuAlias && <DialogContentText key={1}>
            CBU/CVU: <b>{`${payout.cbuCvuAlias}`}</b>
          </DialogContentText>}

          {payout.otherPayId && <DialogContentText key={1}>
            {`${payout.cbuCvuAlias ? "COELSA ID: " : "Cupón ID: "}`} <b>{`${payout.otherPayId}`}</b>
          </DialogContentText>}

          {payout.paypalEmail && <DialogContentText key={2}>
            Email de Paypal: <b>{`${payout.paypalEmail}`}</b>
          </DialogContentText>}

          {payout.paypalEmail && <DialogContentText key={2}>
            ID de Paypal: <b>{`${payout.paypalId ? payout.paypalId : "no provisto"}`}</b>
          </DialogContentText>}

          {payout.payoneerEmail && <DialogContentText key={3}>
            Email de Payoneer: <b>{`${payout.payoneerlEmail}`}</b>
          </DialogContentText>}

          {payout.payoneerEmail && <DialogContentText key={3}>
            ID de Payoneer: <b>{`${payout.payoneerId ? payout.payoneerId : "no provisto"}`}</b>
          </DialogContentText>}

          <DialogContentText key={3}>
            ID del pago en la APP: <b>{`${payout.id}`}</b>
          </DialogContentText>

          {payout.mpId && <DialogContentText key={4}>
            Id de Mercado Pago: <b>{`${payout.mpId}`}</b>
          </DialogContentText>}

          <Grid container direction="column" paddingTop={2}>

            <Grid item xs={6} padding={1}>
              <Button
                onClick={handleAddPayId}
                sx={{
                  backgroundColor: payout.status === "REQUESTED" ? mainBlue : grayColor[11],
                  color: 'white',
                  '&:hover': { backgroundColor: payout.status === "REQUESTED" ? lightBlue : grayColor[11] }
                }}
                endIcon={<Edit />}
                disabled={payout.status !== "REQUESTED"}
                fullWidth>
                {payout.status === "REQUESTED" ? "Completar Pago" : "Pago Realizado"}
              </Button>
            </Grid>

            <Grid item xs={6} padding={1}>
              <Button
                onClick={handleAddMpId}
                sx={{
                  backgroundColor: !payout.mpId ? mainBlue : grayColor[11], color: 'white',
                  '&:hover': { backgroundColor: !payout.mpId ? lightBlue : grayColor[11] }
                }}
                endIcon={<Edit />}
                disabled={payout.mpId !== ""}
                fullWidth>
                {!payout.mpId ? "Agregar MP ID" : "MP ID Agregado"}
              </Button>
            </Grid>

            <Grid item xs={6} padding={1}>
              <Button
                onClick={() => setOpenDeleteDialog(true)}
                sx={{ backgroundColor: '#c20202', color: 'white', '&:hover': { backgroundColor: '#c20202' } }}
                endIcon={<Delete />}
                fullWidth>
                Eliminar
              </Button>
            </Grid>

          </Grid>

        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleClose(false)} color="primary">
            Atrás
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PayoutActionsDialog;

PayoutActionsDialog.defaultProps = {
  isOpen: false,
}

PayoutActionsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  payoutId: PropTypes.string.isRequired,
}