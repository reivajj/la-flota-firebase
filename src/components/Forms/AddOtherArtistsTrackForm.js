import React, { useState } from "react";
import { useDispatch } from 'react-redux';

import { Grid, Tooltip, Button, IconButton } from '@mui/material';
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import BasicCheckbox from 'components/Checkbox/BasicCheckbox';
import { Info, Delete } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import InfoSwitch from "components/Switch/InfoSwitch";
import BasicSwitch from 'components/Switch/BasicSwitch';
import { getNumeracionOrdinalFromIndex, infoHelperTextAppleId } from "utils/textToShow.utils";
import { createBackendError } from '../../redux/actions/ErrorHandlerActions';
import { spotifyUriIsValid } from '../../utils/artists.utils';
import Danger from '../Typography/Danger';
import { spotifyUriNotValidText } from '../../utils/textToShow.utils';

const AddOtherArtistsTrackForm = ({ checkBoxLabel, checkBoxHelper, checkBoxColor, buttonColor, setTrackData, trackData, validator }) => {

  const dispatch = useDispatch();
  const buttonColorStyle = { backgroundColor: buttonColor, '&:hover': { backgroundColor: buttonColor } };

  const [spotifyUriInvalid, setSpotifyUriInvalid] = useState([]);

  const addOneArtistSkeleton = () => {
    if (trackData.artists.length + trackData.allOtherArtists.length > 20) {
      dispatch(createBackendError("No puedes agregar más de 20 artistas."));
      return;
    };
    let otherArtist = { name: "", spotify_uri: "", apple_id: "", id: uuidv4(), primary: false };
    setTrackData({ ...trackData, allOtherArtists: [...trackData.allOtherArtists, otherArtist] });
    setSpotifyUriInvalid([...spotifyUriInvalid, false]);
  }

  const getNewOtherArtists = (targetField, value, index) => {
    let newOtherArtists = [...trackData.allOtherArtists];
    newOtherArtists[index][targetField] = value;
    return newOtherArtists;
  }

  const deleteAllOtherArtists = () => setTrackData({ ...trackData, allOtherArtists: [] });
  const handleChangeArtistPrimary = (isPrimary, index) => setTrackData({ ...trackData, allOtherArtists: getNewOtherArtists("primary", isPrimary, index) });
  const handlerAddNameToOtherArtists = (nameValue, index) => setTrackData({ ...trackData, allOtherArtists: getNewOtherArtists("name", nameValue, index) });

  const handlerAddSpotifyUri = (spotify_uri, otherArtistIndex) => {
    setTrackData({ ...trackData, allOtherArtists: getNewOtherArtists("spotify_uri", spotify_uri, otherArtistIndex) });
    if (!spotifyUriIsValid(spotify_uri)) setSpotifyUriInvalid(spotifyUriInvalid.map((uriIsValid, index) => otherArtistIndex === index ? true : uriIsValid));
    else setSpotifyUriInvalid(spotifyUriInvalid.map((uriIsValid, index) => otherArtistIndex === index ? false : uriIsValid));
  }

  const handlerAddAppleID = (apple_id, index) => setTrackData({ ...trackData, allOtherArtists: getNewOtherArtists("apple_id", apple_id, index) });

  const handleDeleteOtherArtist = aIndex => {
    setTrackData({ ...trackData, allOtherArtists: trackData.allOtherArtists.filter((_, i) => i !== aIndex) });
    setSpotifyUriInvalid(spotifyUriInvalid.filter((_, index) => aIndex !== index));
  }

  const handleOnChangeCheckBox = (event) => {
    if (event.target.checked) addOneArtistSkeleton();
    else deleteAllOtherArtists();
  }

  const getOtherArtistPositionFromIndex = otherArtistIndex => {
    if (otherArtistIndex >= 20) return "NO PUEDES AGREGAR MÁS DE 20 ARTISTAS";
    return `Nombre ${getNumeracionOrdinalFromIndex[otherArtistIndex]} Artista`;
  }

  return (
    <>
      <Grid container item xs={12} sx={{ marginLeft: "6%" }}>
        <Grid item xs={7} textAlign="end" >
          <BasicCheckbox
            label={checkBoxLabel}
            onChecked={handleOnChangeCheckBox}
            checked={trackData.allOtherArtists.length > 0}
            color={checkBoxColor}
          />
        </Grid>
        <Grid item xs={1} textAlign="start">
          <Tooltip title={checkBoxHelper} >
            <IconButton>{<Info />}</IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {trackData.allOtherArtists.map((otherArtist, index) => (

        < Grid container item xs={12} key={index + "trackOtherBigGrid"} >

          <Grid item sx={gridSwitcherStyle} key={index + "track-other-switch-primary"}>
            {index === 0
              ? <InfoSwitch
                label={otherArtist.primary ? "Principal" : "Featuring"}
                onChange={(event) => handleChangeArtistPrimary(event.target.checked, index)}
                checked={otherArtist.primary}
                infoTooltip="Indica si el Artista será Principal o  Featuring. 
              Presionar para más información."
                infoAtLeft={true} />
              : <BasicSwitch
                label={otherArtist.primary ? "Principal" : "Featuring"}
                onChange={(event) => handleChangeArtistPrimary(event.target.checked, index)}
                checked={otherArtist.primary} />
            }
          </Grid>

          <Grid item sx={gridNameStyle} key={index + "trackOtherNameGrid"} textAlign="left">
            <TextFieldWithInfo
              name={getOtherArtistPositionFromIndex(index + trackData.artists.length)}
              sx={textFiedNameStyle}
              label={getOtherArtistPositionFromIndex(index + trackData.artists.length)}
              value={otherArtist.name}
              required
              onChange={(event) => handlerAddNameToOtherArtists(event.target.value, index)}
              helperText={index === 0 ? "Ingresa el nombre → Debe coincidir 100% como aparece en las DSPs. Eliminar el campo si no quieres agregar otro artista. " : ""}
            />
          </Grid>

          <Grid item sx={gridUriStyle} key={index + "trackOtherspotifyUriGrid"}>
            <TextFieldWithInfo
              name={`spotifyUri ${index}`}
              sx={textFieldURIStyle}
              label="Código Uri de Spotify"
              value={otherArtist.spotify_uri}
              onChange={(event) => handlerAddSpotifyUri(event.target.value, index)}
              helperText={index === 0 ? "Ingresa el código URi de Spotify. " : ""}
            />
            {spotifyUriInvalid[index] && <Danger key={index + 'spotify'}>{spotifyUriNotValidText}</Danger>}
          </Grid>

          <Grid item sx={gridAppleStyle} key={index + "trackOtherappleIdGrid"}>
            <TextFieldWithInfo
              name={`apple id ${index}`}
              sx={textFieldAppleIDStyle}
              label="Apple ID"
              value={otherArtist.apple_id}
              onChange={(event) => handlerAddAppleID(event.target.value, index)}
              helperText={index === 0 ? infoHelperTextAppleId : ""}
              validatorProps={{ restrictions: 'max:30|numeric', message: "El Apple ID es un código númerico que no contiene letras.", validator }}
            />
          </Grid>

          <Grid item sx={gridDeleteStyle} key={index + "deleteIcon"}>
            <IconButton color="inherit" size="large" onClick={(_) => handleDeleteOtherArtist(index)}>
              <Delete fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>)
      )}

      {trackData.allOtherArtists.length > 0 &&
        <Grid item xs={12}>
          <Button variant="contained" sx={buttonColorStyle} onClick={addOneArtistSkeleton}>
            Agregar Artista
          </Button>
        </Grid>}
    </>
  )
}

export default AddOtherArtistsTrackForm;

const textFiedNameStyle = { width: "93%" }
const textFieldURIStyle = { width: "90%" }
const textFieldAppleIDStyle = { width: "90%" }
const gridSwitcherStyle = { width: "10%", marginTop: "1%" };
const gridNameStyle = { width: "29%" }
const gridUriStyle = { width: "28.5%", textAlign: "left" };
const gridAppleStyle = { width: "22.5%", textAlign: "left" };
const gridDeleteStyle = { width: "5%", marginTop: "1.4%", color: "gray" };