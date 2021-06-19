import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Button from "components/CustomButtons/Button.js";
import { Grid } from '@material-ui/core';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';
import Album from "views/Albums/Album";

const MyAlbums = () => {
  const navigate = useNavigate();
  const classes = useStyles();

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

  const newAlbum = () => {
    navigate("/admin/new-album");
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1 >Mis Lanzamientos</h1>
          <Button color="primary" round onClick={newAlbum}>
            Nuevo Lanzamiento
          </Button>
        </Grid>
        {
          myAlbums
        }
        <Grid item xs={12}>
          {myAlbums.length === 0 &&
            <h4 className={classes.cardTitleWhite}>No tienes Lanzamientos</h4>}
        </Grid>
      </Grid>
    </div >
  );
}

export default MyAlbums;

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
  }
};

const useStyles = makeStyles(styles);
