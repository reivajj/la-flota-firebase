import React from "react";

import { TextField, MenuItem, Divider, Grid } from '@mui/material';
import { errorFormat } from 'utils';

const TextFieldWithAddElement = (props) => {

  const { name, sx, label, value, onChange, error, required, selectItems, selectKeyField
    , selectValueField, validatorProps, fullWidth, autoFocus, onClickAddElement, addPlaceholder } = props

  return (
    <>
      <TextField
        name={name}
        fullWidth={fullWidth}
        sx={sx}
        autoFocus={autoFocus}
        id={name}
        required={required}
        margin="normal"
        label={label}
        error={error}
        value={value}
        onChange={onChange}
        select
      >
        <MenuItem onClick={onClickAddElement} key={addPlaceholder} value={addPlaceholder}>
          {addPlaceholder}
        </MenuItem>

        <Grid item xs={12} textAlign="-moz-center">
          <Divider sx={dividerStyle} />
        </Grid>

        {selectItems.map((item) => (
          <MenuItem key={selectKeyField ? name + item[`${selectKeyField}`] : name + item} value={selectValueField ? item[`${selectValueField}`] : item}>
            {selectValueField ? item[`${selectValueField}`] : item}
          </MenuItem>
        ))
        }
      </TextField >
      {validatorProps ? validatorProps.validator.current.message(name, value, validatorProps.restrictions, {
        className: 'text-danger',
        messages: { default: validatorProps.message },
        element: (message) => errorFormat(message)
      }) : ""}
    </>
  )
}

export default TextFieldWithAddElement;

const dividerStyle = { borderColor: "rgba(0,0,0,0.2)", borderBottomWidth: "0.15em", margin: "2%", width: "95%" };