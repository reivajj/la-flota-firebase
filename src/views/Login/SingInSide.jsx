import React, { useEffect, useState } from 'react';
import {
  Avatar, Button, CssBaseline, TextField,
  FormControlLabel, Checkbox, Link, Paper, Box, Grid
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { useNavigate } from 'react-router-dom';
// import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as actions from 'redux/actions/AuthActions.js';
import firebase from 'firebaseConfig/firebase.js';
import { SIGNUP_ERROR } from 'redux/actions/Types.js';

const db = firebase.firestore();

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignInSide = () => {

  const classes = useStyles();
  const user = useSelector(store => store.auth.user);
  const email = useSelector(store => store.auth.email);
  const password = useSelector(store => store.auth.password);
  const errorSignInStore = useSelector(store => store.auth.errorNoExisteUser);
  const signUpInfo = useSelector(store => store.signUpInfo);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [openMultiStep, setOpenMultiStep] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [errorSignIn, setErrorSignIn] = useState(false);

  const [errorSignUpFirebase, setErrorSignUpFirebase] = useState(false);
  const [userData, setUserData] = useState(false);

  function to(promise) {
    return promise.then(data => {
      return [null, data];
    })
      .catch(err => [err]);
  }

  const onSubmit = async ({email, password}) => {

    console.log("ON SUBMIT");

    let [errorSignUp] = await to(dispatch(actions.signUp({ email, password })));
    if (errorSignUp) {
      setErrorSignUpFirebase(true);
      return;
    };

    setUserData({ email, password });
  };


  useEffect(() => {

    const uploadAllData = async newUserData => {
      console.log("el newUSerData: ", newUserData);
      let userPorMailRef = db.collection("usersPorMail").doc(newUserData.email);
      let userGoogleIdRef = db.collection("users").doc(newUserData.id);
      let [errorSettingUserInUsers] = await to(userGoogleIdRef.set(newUserData));
      if (errorSettingUserInUsers) dispatch({ type: SIGNUP_ERROR, payload: { errorSettingUserInUsers, newUserData } });

      setUserData(newUserData);

      let [errorAddingInfoToStore] = await to(dispatch(actions.signIn({ email: newUserData.email, password: newUserData.password })));
      if (errorAddingInfoToStore) setErrorSignUpFirebase(true);
      navigate("/admin/dashboard")
    }

    if (signUpInfo.userCreds && userData) {
      console.log("UserCreds from create: ", signUpInfo.userCreds);
      let rol = "admin";
      let user = { ...signUpInfo.userCreds.user, rol };
      let newUserData = userData;
      newUserData.id = user.uid;

      uploadAllData(newUserData)
    }
    else return;

  }, [signUpInfo, userData])

  // const handleClickOpen = () => {
  //   setOpenDialog(true);
  // };

  const handleClose = () => {
    setOpenDialog(false);
  };

  //ESTO DEBE IR A /Inicio
  useEffect(() => {
    user ? navigate("/admin/dashboard") : console.log("HEME AQUI DESLOGUEADO");
  }, [user]);

  const login = async () => {
    let [errorSignIn, signInRespuesta] = await to(dispatch(actions.signIn({ email, password })));
    //  REVEER: Dar una pantalla de error correspondiente
    if (errorSignIn) console.log("Error realizando el signIn: ", errorSignIn);
    console.log("SIGN IN OK:", signInRespuesta);
  };

  const changeEmail = (text) => {
    dispatch(actions.emailChanged(text));
  };

  const handleCloseDialog = (tipoUser) => {
    setTipoUsuario(tipoUser);
    setOpenDialog(false);
    setOpenMultiStep(true);
  }

  const changePassword = (text) => {
    dispatch(actions.passwordChanged(text));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') login();
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>

            {errorSignInStore &&
              <Alert severity="error">
                Combinacion Usuario/Constrasenia incorrecta o no estas registrado
                </Alert>}

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(evento) => changeEmail(evento.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(evento) => changePassword(evento.target.value)}
              onKeyPress={handleKeyPress}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={login}
            >
              Iniciar Sesión
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => onSubmit({email, password})}
            >
              Registro
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default SignInSide;