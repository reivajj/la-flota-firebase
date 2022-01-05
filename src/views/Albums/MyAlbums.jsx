import React from "react";
// core components
import { Grid, Button } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';
import Album from "views/Albums/Album";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const MyAlbums = () => {

  const navigate = useNavigate();
  const albumsFromStore = useSelector(store => store.albums.albums);

  const myAlbumsProfiles = () => {
    return albumsFromStore.length > 0
      ? albumsFromStore.map((label, index) =>
        <Grid item xs={6} key={index}>
          <Album key={index} dataAlbum={label} index={index} />
        </Grid>
      )
      : []
  }

  let myAlbums = myAlbumsProfiles();

  const navigateToNewAlbum = () => navigate("/admin/new-album");

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1>Lanzamientos</h1>
          <Button variant="contained" color="secondary" onClick={navigateToNewAlbum} endIcon={<AddCircleOutlineIcon />}>
            Nuevo Lanzamiento
          </Button>
        </Grid>
        {
          myAlbums
        }
        <Grid item xs={12}>
          {myAlbums.length === 0 &&
            <h4 style={cardTitleBlack}>No tienes Lanzamientos</h4>}
        </Grid>
      </Grid>
    </div >
  );
}

export default MyAlbums;

const cardTitleBlack =
{
  color: "#000000",
  fontWeight: "300px",
  marginBottom: "3px",
}
