import React, { useEffect, useState, useRef } from 'react';
import {
  Avatar, Button, CssBaseline, TextField, Typography,
  FormControlLabel, Checkbox, Link, Box, Grid, Container, ThemeProvider
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SimpleReactValidator from "simple-react-validator";

// import * as actions from 'redux/actions/AuthActions.js';
import firebase from 'firebaseConfig/firebase.js';
import { SIGNUP_ERROR } from 'redux/actions/Types.js';
import Copyright from 'components/Copyright/Copyright.js';
import useForceUpdate from 'components/Varios/ForceUpdate.js';

import Danger from 'components/Typography/Danger.js';
import * as actions from '../../redux/actions/AuthActions';

const db = firebase.firestore();

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

const SignUp = () => {
  const classes = useStyles();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  let errorFormat = (message) => (
    <Danger color="error" variant="h6">{message}</Danger>
  )

  const email = useSelector(store => store.auth.email);
  const password = useSelector(store => store.auth.password);
  const errorSignInStore = useSelector(store => store.auth.errorNoExisteUser);
  const signUpInfo = useSelector(store => store.signUpInfo);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [errorSignIn, setErrorSignIn] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [tipoDeUsuario, setTipoDeUsuario] = useState("");

  const [errorSignUpFirebase, setErrorSignUpFirebase] = useState(false);
  const [userData, setUserData] = useState(false);

  const allFieldsValidSignUp = () => {
    if (simpleValidator.current.allValid()) {
      signUp();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate();
    }
  }

  const signUp = async () => {
    let [errorSignUp] = await to(dispatch(actions.signUp({ email, password })));
    if (errorSignUp) {
      setErrorSignUpFirebase(true);
      return;
    }
    setUserData({ email, password, nombre, apellido });
  };

  const assignEmptyValuesToUserData = userData => {
    let newUserData = { ...userData };
    newUserData.usuarioActivo = true;
    newUserData.artists = [];
    newUserData.rol = "";
    newUserData.ciudad = "";
    newUserData.provincia = "";
    newUserData.telefono = "";
    newUserData.dni = "";
    newUserData.imagenUrl = "";
    return newUserData;
  }

  useEffect(() => {

    const uploadAllData = async newUserData => {
      let userPorMailRef = db.collection("usersPorMail").doc(newUserData.email);
      let userGoogleIdRef = db.collection("users").doc(newUserData.id);

      let userDataComplete = assignEmptyValuesToUserData(newUserData);

      let [errorSettingUserInUsers] = await to(userGoogleIdRef.set(userDataComplete));
      if (errorSettingUserInUsers) dispatch({ type: SIGNUP_ERROR, payload: { errorSettingUserInUsers, userDataComplete } });

      let [errorSettingUserByMail] = await to(userPorMailRef.set(userDataComplete));
      if (errorSettingUserByMail) dispatch({ type: SIGNUP_ERROR, payload: { errorSettingUserByMail, userDataComplete } });

      let [errorAddingInfoToStore] = await to(dispatch(actions.signIn({ email: userDataComplete.email, password: userDataComplete.password, fromSignUp: true })));
      if (errorAddingInfoToStore) {
        dispatch({ type: SIGNUP_ERROR, payload: { errorAddingInfoToStore, userDataComplete } })
        setErrorSignUpFirebase(true);
      }
      navigate("/admin/dashboard");
    }

    if (signUpInfo.userCreds && userData) {
      let newUserData = userData;
      newUserData.id = signUpInfo.userCreds.user.uid;
      newUserData.rol = tipoDeUsuario;
      newUserData.timestampWhenCreatedUser = Date.now();

      uploadAllData(newUserData)
    }
    else return;
  }, [signUpInfo, userData]);

  const changeEmail = text => {
    dispatch(actions.emailChanged(text));
  };

  const changePassword = text => {
    dispatch(actions.passwordChanged(text));
  };

  const changeNombre = text => {
    setNombre(text);
  }

  const changeApellido = text => {
    setApellido(text);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>

          {errorSignInStore &&
            <Alert severity="error">
              Combinación Usuario/Constraseña incorrecta, o no estas registrado
            </Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="nombre"
                variant="outlined"
                required
                fullWidth
                id="nombre"
                label="Nombre"
                autoFocus
                value={nombre}
                onChange={(evento) => changeNombre(evento.target.value)}
              />
              {simpleValidator.current.message('nombre', nombre, 'required', {
                className: 'text-danger',
                messages: { default: "Debes ingresar un nombre." },
                element: (message) => errorFormat(message)
              })}

            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="apellido"
                label="Apellido"
                name="apellido"
                autoComplete="lname"
                value={apellido}
                onChange={(evento) => changeApellido(evento.target.value)}
              />
              {simpleValidator.current.message('apellido', apellido, 'required', {
                className: 'text-danger',
                messages: { default: "Debes ingresar un apellido." },
                element: (message) => errorFormat(message)
              })}

            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(evento) => changeEmail(evento.target.value)}
                onBlur={simpleValidator.current.showMessageFor('email')}
              />
              {simpleValidator.current.message('email', email, 'required|email', {
                className: 'text-danger',
                messages: { default: "Formato de Mail inválido." },
                element: (message) => errorFormat(message)
              })}

            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(evento) => changePassword(evento.target.value)}
              />
              {simpleValidator.current.message('password', password, 'required|min:8|max:100"', {
                className: 'text-danger',
                messages: { default: "Debes ingresar una contraseña que tenga un mínimo de 8 carácteres y máximo de 100." },
                element: (message) => errorFormat(message)
              })}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="Condiciones? Acepto recibir mails?."
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={allFieldsValidSignUp}
          >
            Registrarse
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Ya tiene una cuenta? Ingresa
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default SignUp;