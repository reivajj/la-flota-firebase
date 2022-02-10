import React from "react";
// core components
import Label from 'views/Labels/Label';
import { Grid, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const MyLabels = () => {

  const navigate = useNavigate();
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

  const addLabel = () => navigate("/admin/new-label");

  return (
    <div>
      <Grid container spacing={2} textAlign="center">
        <Grid item xs={12}>
        <Typography sx={labelsTitleStyles}>Sellos</Typography>
          <Button variant="contained" color="secondary" onClick={addLabel} endIcon={<AddCircleOutlineIcon />}>
            Agregar Sello
          </Button>
        </Grid>
        {
          myLabels
        }
        <Grid item xs={12}>
          {myLabels.length === 0 &&
            <h4 style={noLabelsTitleBlackStyles}>No tienes Sellos</h4>}
        </Grid>
      </Grid>
    </div >
  );
}

export default MyLabels;

const labelsTitleStyles = { color: "#000000", fontWeight: "400px", fontSize: "50px", marginBottom: "2%" };
const noLabelsTitleBlackStyles = { color: "#000000", fontWeight: "300px", marginBottom: "3px" };