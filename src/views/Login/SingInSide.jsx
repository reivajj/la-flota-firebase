import React, { useEffect } from 'react';
import {
  Avatar, Button, CssBaseline, TextField, Typography,
  FormControlLabel, Checkbox, Link, Paper, Box, Grid
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as actions from 'redux/actions/AuthActions.js';
import Copyright from 'components/Copyright/Copyright.js';

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

const SignInSide = () => {

  const classes = useStyles();
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
    let [errorSignIn, signInRespuesta] = await to(dispatch(actions.signIn({ email, password, fromSignUp: false })));
    //  REVEER: Dar una pantalla de error correspondiente
    if (errorSignIn) console.log("Error realizando el signIn: ", errorSignIn);
    console.log("SIGN IN OK:", signInRespuesta);
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
                Combinación Usuario/Constraseña incorrecta, o no estas registrado
              </Alert>}

            <TextField
              variant="outlined"
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
              variant="outlined"
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
              className={classes.submit}
              onClick={login}
            >
              Iniciar Sesión
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Olvidaste tu contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/sign-up" variant="body2">
                  {"No tienes una cuenta? Regístrate"}
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
