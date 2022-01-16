import * as React from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const BasicCheckbox = ({ checked, label, onChecked, color }) => {

  const checkBoxStyle = {
    color: color,
    '&.Mui-checked': {
      color: color,
    },
  }

  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onChecked} sx={color ? checkBoxStyle : {}} />}
        label={label}
        sx={{ display: "inline" }}
      />
    </FormGroup>
  );
}

export default BasicCheckbox;
