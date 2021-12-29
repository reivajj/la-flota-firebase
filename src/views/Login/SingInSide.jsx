import React, { useEffect } from 'react';
import {
  Button, CssBaseline, TextField, Typography,
  FormControlLabel, Checkbox, Link, Paper, Box, Grid
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as actions from 'redux/actions/AuthActions.js';
import Copyright from 'components/Copyright/Copyright.js';
import { createTheme } from '@mui/material/styles';
import { signInWithGoogle } from 'services/AuthServices';
import { SIGNUP_ERROR } from '../../redux/actions/Types';
import { Image } from 'mui-image'
import { to } from 'utils';
import GoogleColorIcon from '../Icons/GoogleColorIcon';

const SignInSide = () => {

  const user = useSelector(store => store.auth.user);
  const email = useSelector(store => store.auth.email);
  const password = useSelector(store => store.auth.password);
  const errorSignInStore = useSelector(store => store.auth.errorNoExisteUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user ? navigate("/admin/dashboard") : console.log("HEME AQUI DESLOGUEADO");
  }, [user]);

  const login = async () => {
    let [errorSignIn] = await to(dispatch(actions.signInDoubleSystem({ email, password, fromSignUp: false })));
    //  REVEER: Dar una pantalla de error correspondiente
    if (errorSignIn) console.log("Error realizando el signIn: ", errorSignIn);
  };

  const changeEmail = (text) => {
    dispatch(actions.emailChanged(text));
  };

  const changePassword = (text) => {
    dispatch(actions.passwordChanged(text));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') login();
  }

  const goTosignInWithGoogle = async () => {
    let userEmailAndUUID = await signInWithGoogle();
    console.log("USER :", userEmailAndUUID);
    let [errorAddingInfoToStore] = await to(dispatch(actions.signInFromGoogle(userEmailAndUUID)));
    if (errorAddingInfoToStore) {
      dispatch({ type: SIGNUP_ERROR, payload: { errorAddingInfoToStore, userEmailAndUUID } });
      return;
    }
    navigate("/admin/dashboard");
  }

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

            {errorSignInStore &&
              <Alert severity="error">
                Combinación Usuario/Constraseña incorrecta, o no estas registrado
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
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
              sx={submitStyle}
              onClick={login}
            >
              Iniciar Sesión
            </Button>

            <Grid container padding={1}>
              <Grid item xs>
                <Link href="#" variant="body2" underline="hover">
                  Olvidaste tu contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/sign-up" underline="hover" variant="body2">
                  {"No tienes una cuenta? Regístrate"}
                </Link>
              </Grid>
            </Grid>

            <Grid container padding={2}>
              <Grid item>
                <GoogleColorIcon sx={{ height: "50px" }}/>
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