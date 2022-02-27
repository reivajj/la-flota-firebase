import React, { useState } from "react";

import { TextField, Tooltip, InputAdornment, IconButton, MenuItem } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { errorFormat } from 'utils';
import ImageDialog from "../Dialogs/ImageDialog";

const TextFieldWithInfoImage = (props) => {

  const { name, sx, label, value, onChange, error, required, helperText, select, selectItems, selectKeyField
    , selectValueField, validatorProps, fullWidth, multiline, autoFocus, imageSource, contentTexts } = props

  const [openImageDialog, setOpenImageDialog] = useState(false);

  const endAddormentJSX = <InputAdornment position="end">
    <Tooltip title={helperText ? helperText : ""} >
      <IconButton
        aria-label={"info" + name}
        edge="end"
        sx={{ marginRight: "0.5em" }}
        onClick={() => setOpenImageDialog(!openImageDialog)}>
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
        required={required}
        margin="normal"
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
          <MenuItem key={selectKeyField ? item[`${selectKeyField}`] : item} value={selectValueField ? item[`${selectValueField}`] : item}>
            {selectValueField ? item[`${selectValueField}`] : item}
          </MenuItem>
        )) : ""}
      </TextField >
      {validatorProps ? validatorProps.validator.current.message(name, value, validatorProps.restrictions, {
        className: 'text-danger',
        messages: { default: validatorProps.message },
        element: (message) => errorFormat(message)
      }) : ""}

      <ImageDialog title="Ejemplo de un Lanzamiento con su Versión en el Título." contentTexts={contentTexts ? contentTexts : [[""]]}
        imageSource={imageSource} isOpen={openImageDialog} handleClose={() => setOpenImageDialog(!openImageDialog)} />
    </>
  )
}

export default TextFieldWithInfoImage;
