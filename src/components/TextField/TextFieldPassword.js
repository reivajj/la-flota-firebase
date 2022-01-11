import React from "react";

import { TextField, InputAdornment, IconButton } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { errorFormat } from 'utils';
import { useTogglePasswordVisibility } from "customHooks/useTogglePasswordVisibility";


const TextFieldPassword = ({ sx, password, onChange, error, validator, fullWidth, onKeyPress }) => {

  const { passwordVisibility, handlePasswordVisibility } = useTogglePasswordVisibility();

  const endAddormentJSX = <InputAdornment position="end">
    <IconButton
      aria-label="toggle password visibility"
      onClick={handlePasswordVisibility}
    >
      {passwordVisibility ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  </InputAdornment>

  return (
    <>
      <TextField
        name='password'
        fullWidth={fullWidth}
        sx={sx}
        autoComplete="current-password"
        id='password'
        required
        margin="normal"
        type={passwordVisibility ? 'text' : 'password'}
        label="Contraseña"
        error={error}
        value={password}
        onChange={onChange}
        onKeyPress={onKeyPress ? onKeyPress : () => {}}
        InputProps={{
          endAdornment: endAddormentJSX,
        }} />

      {validator ? validator.current.message('password', password, 'required|min:8', {
        className: 'text-danger',
        messages: { default: "La contraseña debe tener 8 o más carácteres." },
        element: (message) => errorFormat(message)
      }) : ""}
    </>
  )
}

export default TextFieldPassword;
