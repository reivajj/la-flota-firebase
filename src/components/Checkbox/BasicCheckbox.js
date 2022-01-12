import * as React from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const BasicCheckbox = ({ checked, label, onChecked }) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onChecked} />}
        label={label}
        sx={{ display: "inline" }}
      />
    </FormGroup>
  );
}

export default BasicCheckbox;