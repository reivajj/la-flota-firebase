import React from "react";
// core components
import Button from "components/CustomButtons/Button.js";
import { Grid } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';
import Album from "views/Albums/Album";

const MyAlbums = () => {

  const navigate = useNavigate();
  const albumsFromStore = useSelector(store => store.albums.albums);
  console.log("ALbums: ", albumsFromStore);
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

  const newAlbum = () => {
    navigate("/admin/new-album");
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1>Lanzamientos</h1>
          <Button color="primary" round onClick={newAlbum}>
            Nuevo Lanzamiento
          </Button>
        </Grid>
        {
          myAlbums
        }
        <Grid item xs={12}>
          {myAlbums.length === 0 &&
            <h4 style={styles.cardTitleBlack}>No tienes Lanzamientos</h4>}
        </Grid>
      </Grid>
    </div >
  );
}

export default MyAlbums;

const styles = {
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
