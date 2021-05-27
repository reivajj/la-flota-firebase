import React, { useState, useRef, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import SimpleReactValidator from "simple-react-validator";
import useForceUpdate from 'components/Varios/ForceUpdate.js';
import Danger from 'components/Typography/Danger.js';
import { MenuItem, TextField, Grid } from "@material-ui/core";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userDataCreateArtist } from '../../redux/actions/UserDataActions';


const generosMusicales = [
  { value: "alt", nombre: "Alternativo" }, { value: "alt_indie", nombre: "ALTERNATIVO/INDIE ROCK" }, { value: "alt_hard", nombre: "ALTERNATIVO/PUNK" },
  { value: "alt_dance", nombre: "ROCK ALTERNATIVO/DANCE ALTERNATIVO" }, { value: "alt_brit", nombre: "ROCK ALTERNATIVO/BRITISH" }
];

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

let errorFormat = (message) => (
  <Danger color="error" variant="h6">{message}</Danger>
)

const NewArtist = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserId = useSelector(store => store.userData.id);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [biografia, setBiografia] = useState("");
  const [generoMusical, setGeneroMusical] = useState("");
  const [labelId, setLabelId] = useState("");

  const allFieldsValidCreateArtist = () => {
    if (simpleValidator.current.allValid()) {
      createArtist();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate();
    }
  }

  const createArtist = async () => {
    let [errorCreatingArtist] = await to(dispatch(userDataCreateArtist({ nombre, email, biografia, generoMusical, labelId }, currentUserId)));
    if (errorCreatingArtist) throw new Error("Error creating artist: ", errorCreatingArtist);

    navigate('admin/artists');
  }

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={8}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Crear Artista</h4>
            <p className={classes.cardCategoryWhite}>Completa con los datos del Artista</p>
          </CardHeader>

          <CardBody>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={5}>
                <TextField
                  name="nombre"
                  // variant="outlined"
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre del Artista"
                  autoFocus
                  value={nombre}
                  onChange={evento => setNombre(evento.target.value)}
                />
                {simpleValidator.current.message('nombre', nombre, 'required', {
                  className: 'text-danger',
                  messages: { default: "Debes ingresar un nombre." },
                  element: (message) => errorFormat(message)
                })}
              </Grid>

              <Grid item xs={12} sm={12} md={7}>
                <TextField
                  // variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={evento => setEmail(evento.target.value)}
                />
                {simpleValidator.current.message('email', email, 'required|email', {
                  className: 'text-danger',
                  messages: { default: "Formato de Correo Electrónico inválido." },
                  element: (message) => errorFormat(message)
                })}
              </Grid>
            </Grid>

            <Grid container spacing={10}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  name="generoMusical"
                  id="generoMusical"
                  // variant="outlined"
                  required
                  margin="normal"
                  select
                  label={"Género musical principal."}
                  value={generoMusical}
                  onChange={evento => setGeneroMusical(evento.target.value)}
                >
                  {generosMusicales.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.nombre}
                    </MenuItem>
                  ))}
                </TextField>
                {simpleValidator.current.message('generoMusical', generoMusical, 'required', {
                  className: 'text-danger',
                  messages: { default: "Debes elegir tu género musical principal." },
                  element: (message) => errorFormat(message)
                })}
              </Grid>
            </Grid>
            <Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  // variant="outlined"
                  margin="normal"
                  id="biografia"
                  name="biografia"
                  label="Breve Biografía del Artista (max 100 caracteres)"
                  fullWidth
                  value={biografia}
                  multiline={true}
                  inputProps={{ maxLength: 100 }}
                  rowsMax="3"
                  rows="3"
                  onChange={(evento) => setBiografia(evento.target.value)} />
              </Grid>
            </Grid>
          </CardBody>
          <CardFooter>
            <Button color="primary" onClick={allFieldsValidCreateArtist} >Finalizar</Button>
          </CardFooter>
        </Card>
      </Grid>
    </Grid>
  );
}

export default NewArtist;

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
};

const useStyles = makeStyles(styles);