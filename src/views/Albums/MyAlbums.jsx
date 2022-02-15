import React from "react";
// core components
import { Grid, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';
import AlbumCard from "views/Albums/AlbumCard";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import useQuery from '../../customHooks/useQuery';
import { getFilteredAlbumsByUrl } from '../../utils/albums.utils';

const MyAlbums = () => {

  const navigate = useNavigate();
  const params = useQuery();

  const albumsFromStore = useSelector(store => store.albums.albums);

  const filteredAlbumsIfNeeded = getFilteredAlbumsByUrl(params, albumsFromStore);

  const myAlbumsProfiles = () => {
    return filteredAlbumsIfNeeded.length > 0
      ? filteredAlbumsIfNeeded.map((label, index) =>
        <Grid item xs={3} key={index} sx={{ margintTop: "2%" }}>
          <AlbumCard key={index} dataAlbum={label} index={index} />
        </Grid>
      )
      : []
  }

  let myAlbums = myAlbumsProfiles();

  const navigateToNewAlbum = () => navigate("/admin/new-album");

  return (
    <Grid container spacing={2} textAlign="center">
      <Grid item xs={12}>
        <Typography sx={albumsTitleStyles}>Lanzamientos</Typography>
        <Button variant="contained" color="secondary" onClick={navigateToNewAlbum} endIcon={<AddCircleOutlineIcon />}>
          Nuevo Lanzamiento
        </Button>
      </Grid>
      {
        myAlbums
      }
      <Grid item xs={12}>
        {myAlbums.length === 0 &&
          <h4 style={noAlbumsTitleBlackStyles}>No tienes Lanzamientos</h4>}
      </Grid>
    </Grid>
  );
}

export default MyAlbums;

const noAlbumsTitleBlackStyles = { color: "#000000", fontWeight: "300px", marginBottom: "3px" }
const albumsTitleStyles = { color: "#000000", fontWeight: "400px", fontSize: "50px", marginBottom: "2%" }
