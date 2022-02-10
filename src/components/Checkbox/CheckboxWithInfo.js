import * as React from 'react';
import { Grid, Tooltip, IconButton } from '@mui/material';
import { Info } from '@mui/icons-material';
import BasicCheckbox from 'components/Checkbox/BasicCheckbox';

const CheckboxWithInfo = ({ checked, label, onChecked, color, checkBoxHelper, onClickInfo }) => {

  return (
    <Grid container item xs={12}>
      <Grid item xs={7} textAlign="end" >
        <BasicCheckbox
          label={label}
          onChecked={onChecked}
          checked={checked}
          color={color}
        />
      </Grid>
      <Grid item xs={1} textAlign="start">
        <Tooltip title={checkBoxHelper} >
          <IconButton onClick={onClickInfo ? onClickInfo : null} >{<Info />}</IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default CheckboxWithInfo;