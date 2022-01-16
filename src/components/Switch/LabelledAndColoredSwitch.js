import * as React from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import { alpha, styled } from '@mui/material/styles';

const LabelledAndColoredSwitch = ({ size, label, color, labelPlacement, checked, onChange }) => {

  const ColorSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color,
      '&:hover': { backgroundColor: alpha(color, theme.palette.action.hoverOpacity) },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: color },
  }));

  return (
    <FormControl component="fieldset">
      <FormControlLabel
        control={<ColorSwitch size={size} sx={{ color: color }} checked={checked} onChange={onChange} inputProps={{ 'aria-label': 'controlled' }} />}
        label={label}
        labelPlacement={labelPlacement}
      />
    </FormControl>
  );
}

export default LabelledAndColoredSwitch;