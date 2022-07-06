import React, { useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Button } from '@mui/material';

import TextFieldWithInfo from '../../components/TextField/TextFieldWithInfo';
import { LockOpen, Save } from '@mui/icons-material';
import useForm from '../../customHooks/useForm';
import ProgressButton from 'components/CustomButtons/ProgressButton';
import SimpleReactValidator from 'simple-react-validator';
import { useForceUpdate } from '../../utils';
import { planesLaFlota, subscriptionsStatusLaFlota } from '../../variables/varias';
import { toWithOutError } from 'utils';
import { useDispatch } from 'react-redux';
import { createUserRedux, editUserRedux } from '../../redux/actions/UsersActions';
import { getPlanIdFromName, getPlanNameFromId, getSubscriptionStatusFromId, getSubscriptionStatusIdFromName } from '../../utils/users.utils';

const NewUserDialog = ({ isOpen, handleCloseDialog, userSelected }) => {

  const dispatch = useDispatch()
  const validator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const editing = isOpen.action === 'edit';

  const [openLoader, setOpenLoader] = useState(false);
  const [buttonState, setButtonState] = useState("none");
  const [buttonText, setButtonText] = useState("Finalizar");
  const [lockedCredentials, setLockedCredentials] = useState(true);

  let defaultData = {
    email: userSelected.email || "",
    password: userSelected.password || "",
    plan: getPlanNameFromId(userSelected.plan) || "Charly García",
    userStatus: getSubscriptionStatusFromId(userSelected.userStatus) || "Activa",
  };

  const [formData, setForm] = useForm(defaultData);
  let { email, password, plan, userStatus } = formData;

  const allFieldsValidCreateUser = () => {
    if (validator.current.allValid()) createOrEditUser();
    else {
      validator.current.showMessages();
      forceUpdate();
    }
  }

  // const handlerLanguageChoose = event => {
  //   let language = languagesFuga.find(l => l.name === event.target.value);
  //   if (language === undefined) language.id = "ES";
  //   dispatch(updateAddingAlbumRedux({ ...currentAlbumData, languageId: language.id, languageName: event.target.value }));
  // }

  const createOrEditUser = async () => {
    setOpenLoader(true);
    let result = "ERROR";

    let newUserStatus = getSubscriptionStatusIdFromName(formData.userStatus);
    let newPlan = getPlanIdFromName(formData.plan);

    let passwordChange = userSelected.password !== formData.password;

    result = await toWithOutError(dispatch(editing
      ? editUserRedux({ ...userSelected, ...formData, plan: newPlan, userStatus: newUserStatus }, passwordChange)
      : createUserRedux({ ...userSelected, ...formData, plan: newPlan, userStatus: newUserStatus })));

    if (result === "SUCCESS") {
      setButtonState("success");
      handleCloseDialog();
    }
    else {
      setButtonState("error");
      setButtonText("Error");
      handleCloseDialog();
    }
  }

  let title = isOpen.action === 'add' ? "Agregar Usuario" : "Editar Usuario";

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      id="collaborative-dialog"
      open={isOpen.open}
      onClose={handleCloseDialog}>

      <DialogTitle sx={{ fontSize: '2em', fontWeigth: 500, textAlign: 'center' }} id="add-artist-dialog">
        {title}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ textAlign: "center", paddingTop: "6px" }}>

          <Grid container item xs={12}>
            <Grid item xs={6} padding={1}>
              <TextFieldWithInfo
                fullWidth
                name="email"
                label="Email"
                disabled={isOpen.action === 'add' ? false : true}
                value={email}
                onChange={setForm}
                validatorProps={{ restrictions: 'required|email|max:100', message: "Debes ingresar un email.", validator: validator }} />
            </Grid>

            <Grid item xs={6} padding={1}>
              <TextFieldWithInfo
                fullWidth
                disabled={isOpen.action === 'add' ? false : lockedCredentials}
                name="password"
                label="Contraseña"
                value={password}
                onChange={setForm}
                validatorProps={{
                  restrictions: lockedCredentials ? '' : 'required|max:100|min:6', message: "Debes ingresar una contraseña que tenga al menos 6 carácteres y un máximo de 100."
                  , validator: validator
                }} />
            </Grid>

            {isOpen.action !== 'add' && <Grid item xs={12} textAlign="center">
              <Button variant="contained" color="secondary" onClick={() => setLockedCredentials(false)} endIcon={<LockOpen />}>
                Editar Contraseña
              </Button>
            </Grid>}

            <Grid item xs={6} padding={2}>
              <TextFieldWithInfo
                name="plan"
                fullWidth
                required
                label="Plan"
                value={plan}
                onChange={setForm}
                select
                selectItems={planesLaFlota}
                selectKeyField="id"
                selectValueField="name"
              />
            </Grid>

            <Grid item xs={6} padding={2}>
              <TextFieldWithInfo
                name="userStatus"
                fullWidth
                required
                label="Estado de Subscripción"
                value={userStatus}
                onChange={setForm}
                select
                selectItems={subscriptionsStatusLaFlota}
                selectKeyField="id"
                selectValueField="name"
                validatorProps={{
                  restrictions: 'required', message: "Selecciona el estado de Subscripción del Usuario."
                  , validator: validator
                }} />
            </Grid>

          </Grid>

        </Grid>
      </DialogContent >

      <DialogActions sx={{ overflow: "scroll" }}>
        <ProgressButton textButton={buttonText} loading={openLoader} buttonState={buttonState}
          onClickHandler={allFieldsValidCreateUser} noneIcon={<Save sx={{ color: "rgba(255,255,255, 1)" }} />} noFab={false} />
      </DialogActions>

      <DialogActions>
        <Button onClick={handleCloseDialog}>
          Atras
        </Button>
      </DialogActions>
    </Dialog >
  );
}

// const buttonColorStyle = { color: "#508062" };

export default NewUserDialog;
