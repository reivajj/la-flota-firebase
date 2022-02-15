import React from "react";
// core components
import Label from 'views/Labels/Label';
import { Grid, Button, Typography } from '@mui/material';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import useQuery from '../../customHooks/useQuery';

const MyLabels = () => {

  const navigate = useNavigate();
  const params = useQuery();

  const getFilteredLabelsByName = (params, labels) => {
    if (params.view === "label") return labels.filter(label => label.name === params.label_name);
    return labels;
  }

  const labelsFromStore = useSelector(store => store.labels.labels);
  const labelsFilteredIfNeeded = getFilteredLabelsByName(params, labelsFromStore);

  const myLabelsProfiles = () => {
    return labelsFilteredIfNeeded.length > 0
      ? labelsFilteredIfNeeded.map((label, index) =>
        <Grid item xs={3} key={index}>
          <Label key={index} dataLabel={label} index={index} />
        </Grid>
      )
      : []
  }

  let myLabels = myLabelsProfiles();

  const addLabel = () => navigate("/admin/new-label");

  return (
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
  );
}

export default MyLabels;

const labelsTitleStyles = { color: "#000000", fontWeight: "400px", fontSize: "50px", marginBottom: "2%" };
const noLabelsTitleBlackStyles = { color: "#000000", fontWeight: "300px", marginBottom: "3px" };