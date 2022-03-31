import * as React from 'react';
import { Grid, Tooltip, IconButton } from '@mui/material';
import PropTypes from "prop-types";
import { Info } from '@mui/icons-material';
import BasicCheckbox from 'components/Checkbox/BasicCheckbox';

const CheckboxWithInfo = ({ checked, label, onChecked, color, checkBoxHelper, onClickInfo, labelGridSize, labelTextAlign }) => {

  return (
    <Grid container item xs={12}>
      <Grid item xs={labelGridSize} textAlign={labelTextAlign} >
        <BasicCheckbox
          key={label}
          label={label}
          onChecked={onChecked}
          checked={checked}
          color={color}
        />
      </Grid>
      <Grid item xs={1} textAlign="start">
        <Tooltip key={checkBoxHelper} title={checkBoxHelper} >
          <IconButton onClick={onClickInfo ? onClickInfo : null} >{<Info />}</IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default CheckboxWithInfo;

CheckboxWithInfo.defaultProps = {
  labelGridSize: 7,
  labelTextAlign: "end"
}

CheckboxWithInfo.propTypes = {
  labelGridSize: PropTypes.number.isRequired,
  labelTextAlign: PropTypes.string.isRequired,
}