import React, { useEffect } from 'react';
import {
  Avatar, Button, CssBaseline, TextField, Typography,
  FormControlLabel, Checkbox, Link, Paper, Box, Grid
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as actions from 'redux/actions/AuthActions.js';
import Copyright from 'components/Copyright/Copyright.js';
import { createTheme } from '@mui/material/styles';
import { signInWithGoogle } from 'services/AuthServices';
import { SIGNUP_ERROR } from '../../redux/actions/Types';

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

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
    let [errorSignIn] = await to(dispatch(actions.signIn({ email, password, fromSignUp: false })));
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
      <Grid item xs={false} sm={4} md={7} sx={imageStyle} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div style={paperStyle}>
          <Avatar sx={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
              <Grid item>
                <Button
                  color="primary"
                  sx={submitStyle}
                  onClick={goTosignInWithGoogle}
                >
                  Ingresa con Google
                </Button>
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

const imageStyle = {
  backgroundImage: 'url(https://source.unsplash.com/random)',
  backgroundRepeat: 'no-repeat',
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

const paperStyle = {
  margin: theme.spacing(8, 4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const avatarStyle = {
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}

const formStyle = {
  width: '100%', // Fix IE 11 issue.
  marginTop: theme.spacing(1),
}

const submitStyle = {
  margin: theme.spacing(3, 0, 2),
}