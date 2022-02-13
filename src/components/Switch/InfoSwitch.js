import * as React from 'react';
import { Switch, Typography, Grid, Tooltip, IconButton } from '@mui/material';
import { Info } from '@mui/icons-material';

const InfoSwitch = ({ onChange, label, checked, infoTooltip, infoDialog, infoAtLeft, onClickInfo }) => {
  return (
    <>
      <Grid container item xs={12} justifyContent="center" sx={infoAtLeft ? { marginRigth: 0 } : { marginLeft: "11%" } }>

        {infoAtLeft &&
          <Grid item xs={2}>
            <IconButton sx={{ padding: 0, marginLeft: 0 }} aria-label={"info-publication-date"} edge="start" onClick={onClickInfo}>
              <Tooltip title={infoTooltip} >{<Info />}</Tooltip>
            </IconButton>
          </Grid>}

        <Grid item xs={9} sx={{ textAlign: "start", paddingLeft: "10%" }}>
          <Typography >{label}</Typography>
        </Grid>

        {!infoAtLeft &&
          <Grid item xs={2}>
            <IconButton sx={{ padding: 0, marginLeft: 0 }} aria-label={"info-publication-date"} edge="start" onClick={onClickInfo}>
              <Tooltip title={infoTooltip} >{<Info />}</Tooltip>
            </IconButton>
          </Grid>}

      </Grid>

      <Switch
        checked={Boolean(checked)}
        onChange={onChange}
        inputProps={{ 'aria-label': 'controlled' }}
      />
    </>
  );
}

export default InfoSwitch;