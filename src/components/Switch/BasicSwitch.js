import * as React from 'react';
import { Switch, Typography } from '@mui/material';

const BasicSwitch = ({ onChange, label, checked }) => {
  return (
    <>
      <Typography>{label}</Typography>
      <Switch
        checked={checked}
        onChange={onChange}
        inputProps={{ 'aria-label': 'controlled' }}
        label={label}
      />
    </>
  );
}

export default BasicSwitch;