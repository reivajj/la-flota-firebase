import React from "react";
// core components
// import Button from "components/CustomButtons/Button.js";
import ArtistCard from 'views/Artists/ArtistCard';
import { Grid, Button, Typography } from '@mui/material';
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
          <ArtistCard key={index} dataArtist={artista} index={index} />
        </Grid>
      )
      : []
  }

  let misArtistas = misArtistasProfiles();

  const agregarArtista = () => navigate("/admin/new-artist");

  return (
    <Grid container spacing={2} sx={{ textAlign: "center" }}>
      <Grid item xs={12}>
        <Typography sx={artistsTitleStyles}>Artistas</Typography>
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

const artistsTitleStyles = { color: "#000000", fontWeight: "400px", fontSize: "50px", marginBottom: "2%" }