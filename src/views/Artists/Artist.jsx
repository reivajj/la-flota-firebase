import React from "react";
import makeStyles from '@mui/styles/makeStyles';
// core components
// import Card from "components/Card/Card.js";
// import CardBody from "components/Card/CardBody.js";

import { Grid, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import { Image } from 'mui-image';
// import CardFooter from "components/Card/CardFooter";


const Artist = ({ dataArtist, index }) => {
  // const classes = useStyles();
  return (
    <Grid container spacing={2} justifyContent="center">

      <Card sx={{ borderRadius: "30px", marginTop: "20px", maxWidth: "350px" }}>

        <CardContent>

          <Grid container spacing={2} sx={{ textAlign: "center" }}>
            <Grid item xs={12}>
              {dataArtist.imagenUrl && (
                <Grid >
                  <Image
                    style={{ width: 250, height: 220, borderRadius: 40 }}
                    alt="artist-image"
                    duration={30}
                    src={dataArtist.imagenUrl}
                  />
                </Grid>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography noWrap sx={cardTitleBlackStyles}>{dataArtist.name}</Typography>
              <Typography noWrap sx={cardSubtitleBlackStyles}>{dataArtist.biography}</Typography >
            </Grid>

          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: "center" }}>
          <Grid item xs={8}>
            <Button color="secondary" variant="contained" fullWidth>
              Editar
            </Button>
          </Grid>
        </CardActions>

      </Card>
    </Grid>
  );
}

export default Artist;

const cardSubtitleBlackStyles = {
  color: "rgba(0,0,0,0.5)",
  margin: "0",
  fontSize: "14px",
  marginTop: "0",
  marginBottom: "0"
}
const cardTitleBlackStyles = {
  color: "rgba(0,0,0,1)",
  marginTop: "0px",
  minHeight: "auto",
  fontWeight: "300px",
  fontSize: "30px",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none"
}


// const useStyles = makeStyles(styles);
