import React, { useState, useRef } from "react";
// import InputLabel from "@mui/material/InputLabel";
// core components
// import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
// import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import SimpleReactValidator from "simple-react-validator";
import useForceUpdate from 'components/Varios/ForceUpdate.js';
import Danger from 'components/Typography/Danger.js';
import { TextField, Grid, Button } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createArtistRedux } from '../../redux/actions/ArtistsActions';
import { to } from '../../utils';

let errorFormat = (message) => (
  <Danger color="error" variant="h6">{message}</Danger>
)

const NewArtist = () => {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const simpleValidator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();

  const currentUserId = useSelector(store => store.userData.id);

  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");

  const allFieldsValidCreateArtist = () => {
    if (simpleValidator.current.allValid()) {
      createArtist();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate();
    }
  }

  const createArtist = async () => {
    await to(dispatch(createArtistRedux({ nombre, bio, }, currentUserId)));
    navigate('/admin/artists');
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={12} md={8}>
        <Card sx={{ width: "60em" }}>
          <CardHeader color="primary">
            <h4 sx={styles.cardTitleWhite}>Crear Artista</h4>
            <p sx={styles.cardCategoryWhite}>Completa con los datos del Artista</p>
          </CardHeader>

          <CardBody>
            <Grid item xs={12}>
              <TextField
                name="nombre"
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

            <Grid item xs={12}>
              <TextField
                margin="normal"
                id="bio"
                name="bio"
                label="Breve Biografía del Artista (max 100 caracteres)"
                fullWidth
                value={bio}
                multiline={true}
                inputProps={{ maxLength: 100 }}
                maxRows="3"
                onChange={(evento) => setBio(evento.target.value)} />
            </Grid>
          </CardBody>
          <CardFooter>
            <Button onClick={allFieldsValidCreateArtist}>Finalizar</Button>
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