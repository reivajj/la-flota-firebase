import React, { useState } from "react";
// core components
// import Button from "components/CustomButtons/Button.js";
import ArtistCard from 'views/Artists/ArtistCard';
import { Grid, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getFilteredArtistByUrl } from '../../utils/artists.utils';
import useQuery from '../../customHooks/useQuery';
import InfoDialog from 'components/Dialogs/InfoDialog';
import { maxArtistsText } from "utils/textToShow.utils";

const MyArtists = () => {

  const navigate = useNavigate();
  const params = useQuery();

  const artistsFromStore = useSelector(store => store.artists.artists);
  const currentUser = useSelector(store => store.userData);
  const plan = currentUser.plan;

  const [openMaxArtistsDialog, setOpenMaxArtistsDialog] = useState(false);

  const filteredArtistsIfNeeded = getFilteredArtistByUrl(params, artistsFromStore);

  const misArtistasProfiles = () => {
    return filteredArtistsIfNeeded.length > 0
      ? filteredArtistsIfNeeded.map((artista, index) =>
        <Grid item xs={3} key={index}>
          <ArtistCard key={index} dataArtist={artista} index={index} />
        </Grid>
      )
      : []
  }

  let misArtistas = misArtistasProfiles();

  const agregarArtista = () => {
    if (plan === "charly-garcia" && artistsFromStore.length > 1) setOpenMaxArtistsDialog(true);
    else navigate("/admin/new-artist");
  }

  return (
    <Grid container spacing={2} sx={{ textAlign: "center" }}>

      <InfoDialog isOpen={openMaxArtistsDialog} handleClose={() => setOpenMaxArtistsDialog(false)}
        title={"No puedes agregar más Artistas"} contentTexts={maxArtistsText} />

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