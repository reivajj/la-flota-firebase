import React from "react";

import { TextField, Tooltip, InputAdornment, IconButton, MenuItem, Grid } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { errorFormat } from 'utils';

const TextFieldWithInfo = (props) => {

  const { name, sx, label, value, onChange, error, required, helperText, select, selectItems, selectKeyField
    , selectValueField, validatorProps, fullWidth, multiline, autoFocus, onClickInfo, hrefInfo, targetHref, type, disabled } = props

  const endAddormentJSX = <InputAdornment position="end">
    <Tooltip title={helperText ? helperText : ""} >
      <IconButton
        aria-label={"info" + name}
        edge="end"
        sx={{ marginRight: "0.5em" }}
        onClick={onClickInfo ? onClickInfo : null}
        href={hrefInfo}
        target={targetHref}>
        {<InfoIcon />}
      </IconButton>
    </Tooltip>
  </InputAdornment >
  
  return (
    <>
      <TextField
        name={name}
        fullWidth={fullWidth}
        sx={sx}
        autoFocus={autoFocus}
        id={name}
        type={type ? type : ""}
        required={required}
        margin="normal"
        disabled={disabled}
        label={label}
        error={error}
        value={value}
        onChange={onChange}
        select={select ? true : false}
        InputProps={{
          endAdornment: helperText ? endAddormentJSX : ""
        }}
        multiline={multiline}
      >
        {select ? selectItems.map((item) => (
          <MenuItem key={selectKeyField ? name + item[`${selectKeyField}`] : name + item} value={selectValueField ? item[`${selectValueField}`] : item}>
            {selectValueField ? item[`${selectValueField}`] : item}
          </MenuItem>
        )) : ""}
      </TextField >
      <Grid sx={validatorProps && validatorProps.sx ? validatorProps.sx : {}}>
        {validatorProps ? validatorProps.validator.current.message(name, value, validatorProps.restrictions, {
          className: 'text-danger',
          messages: { default: validatorProps.message },
          element: (message) => errorFormat(message)
        }) : ""}
      </Grid>

    </>
  )
}

export default TextFieldWithInfo;
