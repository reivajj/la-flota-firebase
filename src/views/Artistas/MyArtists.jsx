import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Button from "components/CustomButtons/Button.js";
import Artist from 'views/Artistas/Artist';
import { Grid } from '@material-ui/core';
import { useNavigate } from "react-router";

const useStyles = makeStyles(styles);

const MyArtists = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const misArtistasData = [
    {
      nombre: "Juano", apellido: "Lopez"
    },
    {
      nombre: "Roman", apellido: "Gutierrez"
    }
  ];

  const misArtistasProfiles = () => {
    console.log("mis artistas: ", misArtistasData);
    return misArtistasData.length > 0
      ? misArtistasData.map((artista, index) =>
        <Grid xs={6} key={index}>
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
          <h1 >Mis Artistas</h1>
        </Grid>

          {
            misArtistas
          }

        <Grid item xs={12}>
          {misArtistas.length === 0 &&
            <h4 className={classes.cardTitleWhite}>No tienes Artistas</h4>}
          <Button color="primary" round onClick={agregarArtista}>
            Agregar Artista
          </Button>
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