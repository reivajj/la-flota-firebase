import React from "react";
import makeStyles from '@mui/styles/makeStyles';
// core components
import Button from "components/CustomButtons/Button.js";
import Label from 'views/Labels/Label';
import { Grid } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';

const MyLabels = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const labelsFromStore = useSelector(store => store.labels.labels);

  const myLabelsProfiles = () => {
    return labelsFromStore.length > 0
      ? labelsFromStore.map((label, index) =>
        <Grid item xs={6} key={index}>
          <Label key={index} dataLabel={label} index={index} />
        </Grid>
      )
      : []
  }

  let myLabels = myLabelsProfiles();

  const addLabel = () => {
    console.log("Agregar Label");
    navigate("/admin/new-label");
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1 >Mis Sellos</h1>
          <Button color="primary" round onClick={addLabel}>
            Agregar Sello
          </Button>
        </Grid>
        {
          myLabels
        }
        <Grid item xs={12}>
          {myLabels.length === 0 &&
            <h4 style={styles.cardTitleBlack}>No tienes Sellos</h4>}
        </Grid>
      </Grid>
    </div >
  );
}

export default MyLabels;

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
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

const useStyles = makeStyles(styles);
