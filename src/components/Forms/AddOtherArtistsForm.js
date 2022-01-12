import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Tooltip, Button, IconButton } from '@mui/material';
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import BasicCheckbox from 'components/Checkbox/BasicCheckbox';
import { Info } from '@mui/icons-material';
import { updateAddingAlbumRedux, updateNameOtherArtistsAlbumRedux, updateSpotifyUriOtherArtistsAlbumRedux } from 'redux/actions/AlbumsActions';
import { v4 as uuidv4 } from 'uuid';
import InfoSwitch from "components/Switch/InfoSwitch";
import { updatePrimaryOtherArtistsAlbumRedux } from '../../redux/actions/AlbumsActions';
import BasicSwitch from 'components/Switch/BasicSwitch';

const lanzamientoColaborativoTooltip = "Seleccioná si el lanzamiento pertenece a dos o más artistas";

const AddOtherArtistsForm = () => {

  const dispatch = useDispatch();
  const currentAddingAlbum = useSelector(store => store.albums.addingAlbum);

  const addOneArtistSkeleton = () => {
    let artist = { name: "", spotify_uri: "", id: uuidv4(), primary: false };
    dispatch(updateAddingAlbumRedux({ ...currentAddingAlbum, allOtherArtists: [...currentAddingAlbum.allOtherArtists, artist] }));
    // setTrackData({ ...trackData, allOtherArtists: [...currentAddingAlbum.allOtherArtists, artist] });
  }

  const deleteAllOtherArtists = () => {
    dispatch(updateAddingAlbumRedux({ ...currentAddingAlbum, allOtherArtists: [] }));
    // setTrackData({ ...trackData, allOtherArtists: [] });
  }

  const handleChangeArtistPrimary = (isPrimary, otherArtistIndex) => dispatch(updatePrimaryOtherArtistsAlbumRedux(isPrimary, otherArtistIndex));
  const handlerAddNameToOtherArtists = (nameValue, otherArtistIndex) => dispatch(updateNameOtherArtistsAlbumRedux(nameValue, otherArtistIndex));
  const handlerAddSpotifyUri = (spotifyUri, otherArtistIndex) => dispatch(updateSpotifyUriOtherArtistsAlbumRedux(spotifyUri, otherArtistIndex));

  const handleOnChangeCheckBox = (event) => {
    if (event.target.checked) addOneArtistSkeleton();
    else deleteAllOtherArtists();
  }

  // const deleteOtherArtistWithIndex = otherArtistIndex => {
  //   const newOtherArtists = currentAddingAlbum.allOtherArtists.filter((_, index) => index !== otherArtistIndex);
  //   console.log("NEW OTHER ARTIST: ", newOtherArtists);
  //   dispatch(updateAddingAlbumRedux({ ...currentAddingAlbum, allOtherArtists: newOtherArtists }));
  // }

  const getOtherArtistPositionFromIndex = otherArtistIndex => {
    if (otherArtistIndex > 4) return "";
    return ["Segundo Artista Principal", "Tercer Artista Principal", "Cuarto Artista Principal", "Quinto Artista Principal"][otherArtistIndex];
  }

  return (
    <>
      <Grid container item xs={12}>
        <Grid item xs={7} textAlign="end">
          <BasicCheckbox
            label={"Es un lanzamiento colaborativo?"}
            onChecked={handleOnChangeCheckBox}
            checked={currentAddingAlbum.allOtherArtists.length > 0}
          />
        </Grid>
        <Grid item xs={1} textAlign="start">
          <Tooltip title={lanzamientoColaborativoTooltip} >
            <IconButton>{<Info />}</IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {currentAddingAlbum.allOtherArtists.map((otherArtist, index) => (

        < Grid container item xs={12} key={index + "bigGrid"} >

          <Grid item sx={gridSwitcherStyle} key={"switch-primary"}>
            {index === 0
              ? <InfoSwitch
                label={otherArtist.primary ? "Principal" : "Featuring"}
                onChange={(event) => handleChangeArtistPrimary(event.target.checked, index)}
                checked={otherArtist.primary}
                infoTooltip="Indica si el Artista será Principal o  Featuring. 
              Presionar para más información." />
              : <BasicSwitch
                label={otherArtist.primary ? "Principal" : "Featuring"}
                onChange={(event) => handleChangeArtistPrimary(event.target.checked, index)}
                checked={otherArtist.primary} />
            }

          </Grid>

          <Grid item sx={gridNameStyle} key={index + "nameGrid"} textAlign="left">
            <TextFieldWithInfo
              name={getOtherArtistPositionFromIndex(index)}
              sx={textFiedNameStyle}
              label={getOtherArtistPositionFromIndex(index)}
              value={otherArtist.name}
              onChange={(event) => handlerAddNameToOtherArtists(event.target.value, index)}
              helperText={index === 0 ? "Ingresá el nombre → Debe coincidir 100% como aparece en las DSPs. Dejar vacío si no quieres agregarlo. " : ""}
            />
          </Grid>

          <Grid item sx={gridUriStyle} key={index + "spotifyUriGrid"}>
            <TextFieldWithInfo
              name="spotifyUriSecondArtist"
              sx={textFieldURIStyle}
              label="Codigo Uri de Spotify"
              value={otherArtist.spotify_uri}
              onChange={(event) => handlerAddSpotifyUri(event.target.value, index)}
              helperText={index === 0 ? "Ingresá el código URi de Spotify. " : ""}
            />
          </Grid>
        </Grid>)
      )}

      {currentAddingAlbum.allOtherArtists.length > 0 &&
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={addOneArtistSkeleton}>
            Agregar Artista
          </Button>
        </Grid>}
    </>
  )
}

export default AddOtherArtistsForm;

const textFiedNameStyle = { width: "66.8%" }
const textFieldURIStyle = { width: "66.8%", marginLeft: "11%" }
const gridSwitcherStyle = { width: "10%", marginTop: "1%" };
const gridNameStyle = { width: "45%" }
const gridUriStyle = { width: "45%", textAlign: "left" };
