import React from "react";
import makeStyles from '@mui/styles/makeStyles';
// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";

// import avatar from "assets/img/faces/marc.jpg";
import { Grid } from '@mui/material';

const Album = ({ dataAlbum }) => {
  const classes = useStyles();
  dataAlbum.urlImagen = "https://firebasestorage.googleapis.com/v0/b/laflota-dashboard.appspot.com/o/covers%2FLaFlota-NO-3mill.jpg?alt=media&token=de6c1c37-abe8-4710-b734-53ba4174b690"; 
  return (
    <div>
      <Grid container>
        <Grid item xs={12} sm={10}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={dataAlbum.urlImagen} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h4 className={classes.cardTitle}>{dataAlbum.title}</h4>
              <Button color="primary" round>
                Editar
              </Button>
            </CardBody>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Album;

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