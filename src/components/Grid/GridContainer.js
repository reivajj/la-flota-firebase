import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";

const gridStyle = {
  margin: "0 -15px !important",
  width: "unset"
}

export default function GridContainer(props) {
  const { children, ...rest } = props;
  return (
    <Grid container {...rest} sx={gridStyle}>
      {children}
    </Grid>
  );
}

GridContainer.propTypes = {
  children: PropTypes.node
};
