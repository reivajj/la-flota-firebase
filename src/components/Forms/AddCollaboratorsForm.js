import React, { useEffect } from "react";

import { Grid, Tooltip, Button, IconButton, FormControl, InputLabel, Select, OutlinedInput, MenuItem } from '@mui/material';
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import BasicCheckbox from 'components/Checkbox/BasicCheckbox';
import { Info, Delete } from '@mui/icons-material';
import { peopleRoles } from "variables/varias";
import { getHelperCollaboratorText } from "utils/textToShow.utils";
import { cloneDeepLimited } from '../../utils';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};

const AddCollaboratorsForm = ({ setTrackData, trackData, validator }) => {

  const addOneCollaboratorSkeleton = () => {
    if (trackData.collaborators.length >= 20) return;
    let collaborator = { name: "", roles: [] };
    setTrackData({ ...trackData, collaborators: [...trackData.collaborators, collaborator] });
  }

  let isComposeOrLyricist = index => index === 0 || (index === 1 && trackData.audio_locale_name !== "Instrumental");
  let isLyricist = index => index === 1 && trackData.audio_locale_name !== "Instrumental";
  
  const deleteLyricistCollaborator = () => {
    validator.current.fields[`Nombre Liricista`] = true;
    setTrackData({ ...trackData, collaborators: trackData.collaborators.filter(coll => !coll.roles.includes("LYRICIST")) })
  }

  const addLyricistCollaborator = () => {
    if (trackData.collaborators.filter(coll => coll.roles.includes("LYRICIST")).length > 0) return;
    let newCollaboratorsWithLyricist = cloneDeepLimited(trackData.collaborators);
    newCollaboratorsWithLyricist.splice(1, 0, { name: "", roles: ["LYRICIST"] });
    setTrackData({ ...trackData, collaborators: newCollaboratorsWithLyricist });
  }

  useEffect(() => {
    if (trackData.audio_locale_name === "Instrumental") deleteLyricistCollaborator();
    else addLyricistCollaborator();
  }, [trackData.audio_locale_name])

  const deleteCollaborators = () => setTrackData({ ...trackData, collaborators: trackData.collaborators.filter((_, i) => i < 2) });
  const handleOnChangeCheckBox = event => event.target.checked ? addOneCollaboratorSkeleton() : deleteCollaborators();
  const handleDeleteCollaborator = cIndex => setTrackData({ ...trackData, collaborators: trackData.collaborators.filter((_, i) => i !== cIndex) });
  const handleAddNameToCollaborator = (cName, index) => setTrackData({ ...trackData, collaborators: trackData.collaborators.map((coll, i) => i === index ? { ...coll, name: cName } : coll) });
  const handleSelectRole = (newRoles, index) => setTrackData({ ...trackData, collaborators: trackData.collaborators.map((coll, i) => i === index ? { ...coll, roles: newRoles } : coll) });

  const getValidatorProps = indexCollaborator => {
    if (indexCollaborator === 0) return { restrictions: 'required|max:50', message: "Debés indicar el nombre del Compositor", validator };
    if (isLyricist(indexCollaborator)) return { restrictions: 'required|max:50', message: "Debés indicar el nombre del Liricista", validator };
    return null;
  }

  return (
    <>
      {trackData.collaborators.map((collaborator, index) => (

        <Grid container item key={index + "bigGrid-coll"}>

          <Grid item sx={gridDeleteStyle} key={index + "switch-primary"}>
            {!isComposeOrLyricist(index) && <IconButton color="inherit" size="large" onClick={(_) => handleDeleteCollaborator(index)}>
              <Delete fontSize="inherit" />
            </IconButton>}
          </Grid>

          <Grid item sx={gridNameStyle} key={index + "nameGrid=coll"} textAlign="left">
            <TextFieldWithInfo
              name={!isComposeOrLyricist(index) ? `Nombre Colaborador ${index - 1 > 0 ? index - 1 : 1}` : index === 0 ? "Nombre Compositor" : "Nombre Liricista"}
              required
              sx={textFiedNameStyle}
              label={!isComposeOrLyricist(index) ? `Nombre Colaborador ${index - 1 > 0 ? index - 1 : 1}` : index === 0 ? "Nombre Compositor" : "Nombre Liricista"}
              value={collaborator.name}
              onChange={event => handleAddNameToCollaborator(event.target.value, index)}
              helperText={getHelperCollaboratorText(index)}
              validatorProps={getValidatorProps(index)}
            />
          </Grid>

          <Grid item sx={gridUriStyle} key={index + "selectRol-coll"}>

            <FormControl sx={textFieldRoleStyle} required >
              <InputLabel id="roles">Elige su o sus Roles</InputLabel>
              <Select
                fullWidth
                labelId="roles"
                sx={textFieldRoleStyle}
                id="roles"
                multiple
                value={collaborator.roles}
                disabled={isComposeOrLyricist(index)}
                onChange={event => handleSelectRole(event.target.value, index)}
                input={<OutlinedInput id="roles" label="Chip" />}
                renderValue={selected => (
                  selected.map((value, index) => (
                    `${index === 0 ? value : `, ${value}`}`
                  ))
                )}
                MenuProps={MenuProps}
              >
                {peopleRoles.map((rol) => (
                  <MenuItem key={rol} value={rol} >
                    {rol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          </Grid>
        </Grid>)
      )}

      <Grid container item xs={12} sx={{ marginLeft: "6%" }}>

        <Grid item xs={7} textAlign="end">
          <BasicCheckbox
            label={"¿Quieres agregar más colaboradores?"}
            onChecked={handleOnChangeCheckBox}
            checked={trackData.collaborators.length > 2}
            color={"#508062"}
          />
        </Grid>

        <Grid item xs={1} textAlign="start">
          <Tooltip title={"Agrega artistas que hayan colaborado en esta canción."} >
            <IconButton>{<Info />}</IconButton>
          </Tooltip>
        </Grid>

      </Grid>

      {trackData.collaborators.length > 2 &&
        <Grid item xs={12} sx={buttonGridtyle}>
          <Button variant="contained" sx={buttonColorStyle} onClick={addOneCollaboratorSkeleton}>
            Agregar Colaborador
          </Button>
        </Grid>}
    </>
  )
}

export default AddCollaboratorsForm;

const textFiedNameStyle = { width: "100%" }
const textFieldRoleStyle = { width: "90%" }
const gridDeleteStyle = { width: "10%", marginTop: "1.4%", color: "gray" };
const gridNameStyle = { width: "25%" }
const gridUriStyle = { width: "65%", marginTop: "1.4%" };
const buttonGridtyle = { padding: "16px" }
const buttonColorStyle = { backgroundColor: "#508062", '&:hover': { backgroundColor: "#508062" } };
