import * as React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

const BasicCheckbox = ({ checked, label, onChecked, color }) => {

  const checkBoxStyle = {
    color: color,
    '&.Mui-checked': {
      color: color,
    },
  }

  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={onChecked} sx={color ? checkBoxStyle : {}} />}
      label={label}
      sx={{ display: "inline", fontSize: "20px" }}
    />
  );
}

export default BasicCheckbox;
