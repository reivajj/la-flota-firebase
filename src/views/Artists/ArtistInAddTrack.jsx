import React from "react";
import { Grid, Paper, IconButton, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';

import ArtistAddedIcon from '../Icons/ArtistAddedIcon';
import LabelledAndColoredSwitch from '../../components/Switch/LabelledAndColoredSwitch';

const ArtistInAddTrack = ({ index, handleDelete, handleSliderChange, artists, allOtherArtists, from }) => {

  const checkIfCanDeleteArtist = () => {
    if (from === "album-info") return false;
    let allArtistsInTrack = [...artists, ...allOtherArtists];
    allArtistsInTrack = allArtistsInTrack.filter((_, i) => index !== i);
    return allArtistsInTrack.filter(otherA => otherA.primary).length >= 1;
  }

  return (
    <Grid item xs={3} justifyContent="center">
      <Paper elevation={0} sx={artistPaperStyle} >

        <Grid container item xs={12}>

          <Grid item xs={3}>
            <ArtistAddedIcon sx={artistAddedIconStyle} asIconButton={false} />
          </Grid>

          <Grid container item xs={9} direction="column" justifyContent="center" alignItems="center">

            <Grid item xs={5} sx={nameGridStyle}>
              <Typography sx={nameStyle} noWrap>{artists[index].name}</Typography>
            </Grid>

            <Grid container item xs={4}>

              <Grid item xs={8} sx={switchGridStyle}>
                <LabelledAndColoredSwitch size="small" checked={artists.length === 1 || artists[index].primary} color={"#508062"}
                  onChange={(event) => handleSliderChange(index, event.target.checked)} labelPlacement={"end"}
                  label={(artists.length === 1 || artists[index].primary) ? "Principal" : "Featuring"} disabled={from === "album-info"} />
              </Grid>

              {checkIfCanDeleteArtist() &&
                <Grid item xs={4} sx={deleteGridStyle}>
                  <IconButton sx={deleteIconStyle} size="small" onClick={() => handleDelete(index)}>
                    <Delete fontSize="inherit" />
                  </IconButton>
                </Grid>}

            </Grid>

          </Grid>

        </Grid>

      </Paper>
    </Grid>
  );
}

export default ArtistInAddTrack;

const artistPaperStyle = { width: "100%", height: "60px", border: "1px solid rgba(0, 0, 0, 0.12)" };
const artistAddedIconStyle = { width: "62px" };
const nameStyle = { color: "#508062", fontWeight: "400", fontSize: "20px", textAlign: "initial" };
const switchGridStyle = { width: "100%", textAlign: "start" };
const nameGridStyle = { width: "100%" };
const deleteGridStyle = { textAlign: "end" };
const deleteIconStyle = { color: "grey" };