import React from 'react';
import { Grid, IconButton } from '@mui/material';

const ArtistAddedIcon = ({ sx, asIconButton }) => {

  let svgIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ fill: "#616161" }}>
    <title>artista</title>
    <g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1">
      <path d="M18.58 12.263c-.317-.316-.685-.579-.843-.947a.53.53 0 00-.58-.263.512.512 0 00-.42.526v4.737c-.263-.105-.526-.21-.842-.21A1.887 1.887 0 0014 18c0 1.053.842 1.895 1.895 1.895A1.887 1.887 0 0017.789 18v-5.053l.106.106c.737.684 1.316 1.158.684 2.79-.105.262.053.578.316.683.263.106.579-.052.684-.315.842-2.369-.158-3.264-1-3.948zm-2.685 6.58a.832.832 0 01-.842-.843.83.83 0 01.842-.842c.473 0 .842.368.842.842a.832.832 0 01-.842.842zm-.737-3.896c-.158.264-.474.316-.737.21l-1-.525a.553.553 0 01-.263-.474v-1.79c0-.157.105-.315.21-.42.474-.422.843-1.053 1.053-1.737.105-.211.316-.369.526-.369h.21c.159 0 .264-.105.264-.263v-.316c0-.158-.105-.263-.263-.263-.263 0-.526-.21-.526-.474-.158-1.894-1.474-3.368-3-3.368-1.527 0-2.843 1.474-3 3.368 0 .263-.264.474-.527.474-.158 0-.263.105-.263.263v.316c0 .158.105.263.263.263h.21c.264 0 .474.158.527.369.21.684.579 1.315 1.106 1.736a.6.6 0 01.157.421v1.79c0 .21-.105.368-.263.474L6 16.737c-.526.316-.842.842-.842 1.421v.737h7.42c.317 0 .527.21.527.526 0 .316-.21.526-.526.526H4.526c-.315 0-.526-.21-.526-.526v-1.263c0-.948.526-1.842 1.368-2.316l3.58-2v-1.263c-.474-.421-.843-1-1.106-1.684a1.351 1.351 0 01-1.105-1.316v-.316c0-.526.368-1 .842-1.21.316-2.264 2-3.948 4-3.948s3.684 1.684 4 3.948c.526.21.842.684.842 1.21v.316c0 .632-.474 1.158-1.105 1.263a5.198 5.198 0 01-1.105 1.684v1.263l.736.422c.264.158.369.473.21.736z"></path>
    </g></g>
  </svg>

  return (
    <Grid container sx={sx}>
      <Grid item xs={12} >
        {asIconButton
          ?
          <IconButton>
            svgIcon
          </IconButton>
          : svgIcon
        }
      </Grid>
    </Grid>
  )
}

export default ArtistAddedIcon;

