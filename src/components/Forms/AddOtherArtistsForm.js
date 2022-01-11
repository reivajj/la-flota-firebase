import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Typography, Tooltip, Button, IconButton } from '@mui/material';
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import BasicCheckbox from 'components/Checkbox/BasicCheckbox';
import { Info } from '@mui/icons-material';
import { updateAddingAlbumRedux } from 'redux/actions/AlbumsActions';
import { updateNameOtherArtistsAlbumRedux } from 'redux/actions/AlbumsActions';
import { updateSpotifyUriOtherArtistsAlbumRedux } from 'redux/actions/AlbumsActions';

const lanzamientoColaborativoTooltip = "Seleccioná si el lanzamiento pertenece a dos o más artistas";

const AddOtherArtistsForm = ({ sx }) => {

  const dispatch = useDispatch();

  const currentAlbumData = useSelector(store => store.albums.addingAlbum);

  const addOneArtistSkeleton = () => {
    let artist = { name: "", spotify_uri: "" };
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, allOtherArtists: [...currentAlbumData.allOtherArtists, artist] }));
    // setTrackData({ ...trackData, allOtherArtists: [...currentAlbumData.allOtherArtists, artist] });
  }

  const deleteAllOtherArtists = () => {
    dispatch(updateAddingAlbumRedux({ ...currentAlbumData, allOtherArtists: [] }));
    // setTrackData({ ...trackData, allOtherArtists: [] });
  }

  const handlerAddNameToOtherArtists = (nameValue, otherArtistIndex) => {
    dispatch(updateNameOtherArtistsAlbumRedux(nameValue, otherArtistIndex));
  }

  const handlerAddSpotifyUri = (spotifyUri, otherArtistIndex) => {
    dispatch(updateSpotifyUriOtherArtistsAlbumRedux(spotifyUri, otherArtistIndex));
  }

  const handleOnChangeCheckBox = (event) => {
    if (event.target.checked) addOneArtistSkeleton();
    else deleteAllOtherArtists();
  }


  return (
    <>
      <Grid container item xs={12}>
        <Grid item xs={7} textAlign="end">
          <BasicCheckbox
            label={"Es un lanzamiento colaborativo?"}
            onChecked={handleOnChangeCheckBox}
            checked={currentAlbumData.allOtherArtists.length > 0}
          />
        </Grid>
        <Grid item xs={1}>
          <Tooltip title={lanzamientoColaborativoTooltip} >
            <IconButton
              edge="end">
              {<Info />}
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {currentAlbumData.allOtherArtists.map((otherArtist, index) => {
        console.log("INDEX:", index);

        return (< Grid container item xs={12} key={index + "bigGrid"} >
          <Grid item xs={6} key={index + "nameGrid"}>
            <TextFieldWithInfo
              name="nombreSecondArtist"
              sx={sx}
              label="Nombre Segundo Artista "
              value={otherArtist.name}
              onChange={(event) => handlerAddNameToOtherArtists(event.target.value, index)}
              helperText="Ingresá el nombre → Debe coincidir 100% como aparece en las DSPs. "
            />
          </Grid>

          <Grid item xs={6} key={index + "spotifyUriGrid"}>
            <TextFieldWithInfo
              name="spotifyUriSecondArtist"
              sx={sx}
              label="Codigo Uri de Spotify"
              value={otherArtist.spotify_uri}
              onChange={(event) => handlerAddSpotifyUri(event.target.value, index)}
              helperText="Ingresá el código URi de Spotify. "
            />
          </Grid>
        </Grid>)
      })}

      {currentAlbumData.allOtherArtists.length > 0 &&
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={addOneArtistSkeleton}>
            Agregar Artista
          </Button>
        </Grid>}
    </>
  )
}

export default AddOtherArtistsForm;