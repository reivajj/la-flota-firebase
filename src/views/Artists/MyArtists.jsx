import React from "react";
import makeStyles from '@mui/styles/makeStyles';
// core components
import Button from "components/CustomButtons/Button.js";
import Artist from 'views/Artists/Artist';
import { Grid } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';

const MyArtists = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const artistsFromStore = useSelector(store => store.artists.artists);

  const misArtistasProfiles = () => {
    return artistsFromStore.length > 0
      ? artistsFromStore.map((artista, index) =>
        <Grid item xs={6} key={index}>
          <Artist key={index} dataArtist={artista} index={index} />
        </Grid>
      )
      : []
  }

  let misArtistas = misArtistasProfiles();

  const agregarArtista = () => {
    console.log("Agregar artista");
    navigate("/admin/new-artist");
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1>Mis Artistas</h1>
          <Button color="primary" round onClick={agregarArtista}>
            Agregar Artista
          </Button>
        </Grid>
        {
          misArtistas
        }
        <Grid item xs={12}>
          {misArtistas.length === 0 &&
            <h4 style={styles.cardTitleBlack}>No tienes Artistas</h4>}
        </Grid>
      </Grid>
    </div >
  );
}

export default MyArtists;

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleBlack: {
    color: "#000000",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);
