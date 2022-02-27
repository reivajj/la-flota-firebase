import React, { useEffect, useState } from 'react';
import {
  CssBaseline, TextField, Typography,
  FormControlLabel, Checkbox, Link, Paper, Box, Grid
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
// import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as actions from 'redux/actions/AuthActions.js';
import Copyright from 'components/Copyright/Copyright.js';
import { createTheme } from '@mui/material/styles';
// import { signInWithGoogle } from 'services/AuthServices';

import { Image } from 'mui-image'
import { to } from 'utils';
// import GoogleColorIcon from '../Icons/GoogleColorIcon';
import TextFieldPassword from '../../components/TextField/TextFieldPassword';
import ProgressButton from 'components/CustomButtons/ProgressButton';

const SignInSide = () => {

  const user = useSelector(store => store.auth.user);
  const email = useSelector(store => store.auth.email);
  const password = useSelector(store => store.auth.password);
  const errorMsgSignInStore = useSelector(store => store.auth.errorMsg);

  const [openLoader, setOpenLoader] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user && navigate("/admin/dashboard");
  }, [user]);

  const login = async () => {
    setOpenLoader(true);
    errorMsgSignInStore && dispatch(actions.loginErrorStore({ error: "", errorMsg: "" }));
    let [errorSignIn] = await to(dispatch(actions.signInDoubleSystem({ email, password, fromSignUp: false })));
    if (errorSignIn) return "ERROR";
    setOpenLoader(false);
  };

  const changeEmail = (text) => {
    dispatch(actions.emailChanged(text.toLowerCase()));
  };

  const changePassword = (text) => {
    dispatch(actions.passwordChanged(text));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') login();
  }

  // const goTosignInWithGoogle = async () => {
  //   let userEmailAndUUID = await signInWithGoogle();
  //   console.log("USER :", userEmailAndUUID);
  //   let [errorAddingInfoToStore] = await to(dispatch(actions.signInFromGoogle(userEmailAndUUID)));
  //   if (errorAddingInfoToStore) {
  //     dispatch({ type: SIGNUP_ERROR, payload: { errorAddingInfoToStore, userEmailAndUUID } });
  //     return;
  //   }
  //   navigate("/admin/dashboard");
  // }

  return (
    <Grid container component="main" sx={rootStyle}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} >
        <Image src="/images/login-full.jpg" alt="image" duration={30} />
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>

        <div style={paperStyle}>
          <Box sx={avatarStyle}>
            <Image src="/images/login-avatar.png" alt="logo" duration={30} />
          </Box>
          <Typography component="h1" variant="h5">
            Inicia Sesión en tu Cuenta
          </Typography>
          <form style={formStyle} noValidate>

            {errorMsgSignInStore &&
              <Alert severity="error">
                {errorMsgSignInStore}
              </Alert>}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(evento) => changeEmail(evento.target.value)}
            />

            <TextFieldPassword
              fullWidth
              password={password}
              onKeyPress={handleKeyPress}
              onChange={(evento) => changePassword(evento.target.value)}
            />

            <ProgressButton
              fullWidth
              variant="contained"
              loading={openLoader}
              color="primary"
              onClickHandler={login}
              buttonFullWidth={true}
              noFab={true}
              buttonSx={submitStyle}
              textButton="Iniciar Sesión"
              buttonProgressSx={buttonProgressSx}
            />

            <Grid container padding={1}>
              <Grid item xs>
                <Link href="https://www.laflota.com.ar/dashboard/contrasena-perdida/" target="_blank" variant="body2" underline="hover">
                  Olvidaste tu contraseña?
                </Link>
              </Grid>
              {/* <Grid item>
                <Link component={RouterLink} to="/sign-up" underline="hover" variant="body2">
                  {"No tienes una cuenta? Regístrate"}
                </Link>
              </Grid> */}
            </Grid>

            {/* <Grid container padding={2}>
              <Grid item>
                <GoogleColorIcon sx={{ height: "50px" }} />
              </Grid>
            </Grid> */}

            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid >
  );
}

export default SignInSide;

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    mode: 'light'
  },
});


const rootStyle = {
  height: '100vh',
}

const paperStyle = {
  margin: theme.spacing(8, 4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const avatarStyle = {
  backgroundColor: theme.palette.common.white,
  width: 100,
  height: 100,

}

const formStyle = {
  width: '100%', // Fix IE 11 issue.
  marginTop: theme.spacing(1),
}

const submitStyle = {
  margin: theme.spacing(3, 0, 2),
}

const buttonProgressSx = {
  // color: green[500],
  position: 'absolute',
  marginTop: '1.5em',
  marginLeft: '-24em',
  zIndex: 1,
}