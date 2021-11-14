import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";

const gridStyle = {
  padding: "0 15px !important"
}
export default function GridItem(props) {
  const { children, ...rest } = props;
  return (
    <Grid item {...rest} sx={gridStyle}>
      {children}
    </Grid>
  );
}

GridItem.propTypes = {
  children: PropTypes.node
};
