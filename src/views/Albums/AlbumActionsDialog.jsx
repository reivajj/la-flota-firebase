import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Grid
} from '@mui/material';
import ProgressButton from '../../components/CustomButtons/ProgressButton';
import { toWithOutError } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { albumsEditRedux, albumsPublishAndDeliveryRedux } from "redux/actions/AlbumsActions";
import SuccessDialog from '../../components/Dialogs/SuccessDialog';
import { getDeliveredTitleDialog } from "utils/albums.utils";
import { getDeliveredContentTextDialog, getAlbumById } from '../../utils/albums.utils';
import DeleteDialog from '../../components/Dialogs/DeleteDialog';
import { deleteAlbumRedux } from '../../redux/actions/AlbumsActions';
import { deleteAlbumDialogText } from '../../utils/textToShow.utils';
import { Delete, Edit } from '@mui/icons-material/';
import { useNavigate } from 'react-router-dom';
import { mainBlue } from 'variables/colors';
import { lightBlue } from '../../variables/colors';
import EditOrAddFieldsDialog from '../../components/Dialogs/EditOrAddFieldDialog';
import { ourListOfDeliveryStates, ourAlbumStateWithEquivalence } from '../../variables/varias';

const AlbumActionsDialog = (props) => {

  const { isOpen, handleClose, albumId } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const albums = useSelector(store => store.albums.albums);

  const album = getAlbumById(albums, albumId);

  const [loading, setLoading] = useState(false);
  const [buttonState, setButtonState] = useState('none');
  const [deliveryState, setDeliveryState] = useState('none');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState({ open: false, title: "", subtitle: [""] })

  const handleDeliveryTo = async targetDelivery => {
    setLoading(true); setDeliveryState('processing');
    let deliverToApple = Boolean(album.dsps.find(dspInfo => dspInfo.dspName === "Apple Music"));
    const deliveryResponse = await toWithOutError(dispatch(albumsPublishAndDeliveryRedux(album, album.dsps, targetDelivery, deliverToApple)))

    if (deliveryResponse === "ERROR") { setButtonState('error'); return; }
    if (deliveryResponse === "PUBLISHED") { setButtonState('error'); setDeliveryState('published'); return; }
    if (deliveryResponse === "DELIVERED") { setButtonState('success'); setDeliveryState('published'); return; }
    setLoading(false);
    handleClose();
  }

  let successDialogTitle = getDeliveredTitleDialog(deliveryState);
  let successDialogText = getDeliveredContentTextDialog(deliveryState);

  const handleCloseDelete = () => setOpenDeleteDialog(false);

  const handleDelete = async () => {
    setLoading(true);
    let result = await toWithOutError(dispatch(deleteAlbumRedux(album)));
    if (result === "ERROR") { setButtonState("error"); setLoading(false); }
    else { setLoading(false); setOpenDeleteDialog(false); handleClose(); }
  }

  const goToAlbumInfoAndEdit = () => navigate(`/admin/albums/${album.id}?edit=true`);

  const handleEditDeliveryState = () => setOpenEditDialog({
    open: true, title: "Cambiar el estado de Delivery", subtitle: ["Solo se cambiará en la APP"],
    handleConfirm: (newValue) => handleConfirmEditAlbum(newValue, 'state'),
    initialValues: ourAlbumStateWithEquivalence[album.state] || "", optionsValues: ourListOfDeliveryStates
  });

  const handleEditFugaId = () => setOpenEditDialog({
    open: true, title: "Enlazar con lanzamiento de Fuga", subtitle: ["Útil para cuando creamos por nuestra cuenta un lanzamiento en FUGA",
      "y el lanzamiento que se ve en la APP no esta enlazado a ese Lanzamiento."],
    handleConfirm: (newValue) => handleConfirmEditAlbum(newValue, 'fugaId'),
    initialValues: album.fugaId || ""
  });


  const handleConfirmEditAlbum = async (newValue, fieldName) => {
    setButtonState("loading");
    let editResult = await toWithOutError(dispatch(albumsEditRedux(album, { [fieldName]: newValue }, album.ownerEmail, false)));
    if (editResult === "ERROR") { setButtonState("error"); return; }
    setButtonState("none");
    setOpenEditDialog({ open: false, title: "", subtitle: "" });
  }

  const handleCloseEditDialog = () => setOpenEditDialog({ open: false, title: "", subtitle: [""] });

  return (
    <>
      <SuccessDialog isOpen={deliveryState !== 'none' && deliveryState !== 'processing'} title={successDialogTitle} contentTexts={successDialogText}
        handleClose={() => setDeliveryState('none')} successImageSource="/images/success.jpg" size="sm" />

      <DeleteDialog isOpen={openDeleteDialog} setIsOpen={setOpenDeleteDialog} handleClose={handleCloseDelete}
        title={"Eliminar Lanzamiento"} textName={album.title} textContent={deleteAlbumDialogText}
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
          {`Acciones rápidas del Lanzamiento: ${album.title}`}
        </DialogTitle>

        <DialogContent>
          <DialogContentText key={0}>
            Las acciones que se lleven a cabo acá se verán reflejadas en Fuga.
          </DialogContentText>
          <DialogContentText key={1}>
            Si se edita la metadata de un Lanzamiento, al mismo tiempo se realizará el Redelivery del mismo. (PROXIMAMENTE)
          </DialogContentText>

          <Grid container direction="column" paddingTop={2}>
            <Grid item xs={6} padding={1} textAlign="center">
              <ProgressButton
                textButton={"Delivery a las DSPs seleccionadas"}
                loading={loading}
                buttonState={buttonState}
                onClickHandler={() => handleDeliveryTo('all')}
                noFab={true}
                buttonFullWidth={true} />
            </Grid>

            <Grid item xs={6} padding={1} textAlign="center">
              <ProgressButton
                textButton={"Delivery solo a Apple"}
                loading={loading}
                buttonState={buttonState}
                onClickHandler={() => handleDeliveryTo('only-apple')}
                noFab={true}
                buttonFullWidth={true} />
            </Grid>

            <Grid item xs={6} padding={1}>
              <Button
                onClick={goToAlbumInfoAndEdit}
                sx={{ backgroundColor: mainBlue, color: 'white', '&:hover': { backgroundColor: lightBlue } }}
                endIcon={<Edit />}
                fullWidth>
                Editar
              </Button>
            </Grid>

            <Grid item xs={6} padding={1}>
              <Button
                onClick={handleEditDeliveryState}
                sx={{ backgroundColor: mainBlue, color: 'white', '&:hover': { backgroundColor: lightBlue } }}
                endIcon={<Edit />}
                fullWidth>
                Cambiar estado en la APP
              </Button>
            </Grid>

            <Grid item xs={6} padding={1}>
              <Button
                onClick={handleEditFugaId}
                sx={{ backgroundColor: mainBlue, color: 'white', '&:hover': { backgroundColor: lightBlue } }}
                endIcon={<Edit />}
                fullWidth>
                Enlazar a lanzamiento con FUGA ID
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

export default AlbumActionsDialog;

AlbumActionsDialog.defaultProps = {
  isOpen: false,
}

AlbumActionsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  album: PropTypes.object.isRequired,
}