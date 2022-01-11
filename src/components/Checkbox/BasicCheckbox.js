import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const BasicCheckbox = ({ checked, label, onChecked }) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onChecked} />}
        label={label}
        sx={{ display:"inline" }}
      />
    </FormGroup>
  );
}

export default BasicCheckbox;