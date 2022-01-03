import React from "react";
// core components
// import Button from "components/CustomButtons/Button.js";
import Artist from 'views/Artists/Artist';
import { Grid, Button } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const MyArtists = () => {

  const navigate = useNavigate();
  const artistsFromStore = useSelector(store => store.artists.artists);

  const misArtistasProfiles = () => {
    return artistsFromStore.length > 0
      ? artistsFromStore.map((artista, index) =>
        <Grid item xs={3} key={index}>
          <Artist key={index} dataArtist={artista} index={index} />
        </Grid>
      )
      : {}
  }

  let misArtistas = misArtistasProfiles();

  const agregarArtista = () => navigate("/admin/new-artist");

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1>Mis Artistas</h1>
          <Button variant="contained" color="secondary" onClick={agregarArtista} endIcon={<PersonAddIcon />}>
            Agregar Artista
          </Button>
        </Grid>
        <Grid container item >
          {
            misArtistas
          }
        </Grid>
        <Grid item xs={12}>
          {misArtistas.length === 0 &&
            <h4 style={cardTitleBlack}>No tienes Artistas</h4>}
        </Grid>
      </Grid>
    </div >
  );
}

export default MyArtists;

const cardTitleBlack = {
  color: "#000000",
  marginTop: "0px",
  minHeight: "auto",
  fontWeight: "300",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none"
};