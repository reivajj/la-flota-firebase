import React from "react";
import PropTypes from "prop-types";
// core components
import Typography from '@mui/material/Typography';
import { dangerColor } from '../../variables/colors';

const Warning = (props) => {
  const { children, sxOverride } = props;
  return (
    <Typography sx={{ color: dangerColor[0], ...sxOverride }}>
      {children}
    </Typography>
  );
}

export default Warning;

Warning.propTypes = {
  children: PropTypes.node
};
