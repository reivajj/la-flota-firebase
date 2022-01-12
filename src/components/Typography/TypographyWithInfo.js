import React, { useState } from "react"
import { Grid, Typography, Tooltip, IconButton } from '@mui/material';
import { Info } from '@mui/icons-material';
import InfoDialog from 'components/Dialogs/InfoDialog';

const TypographyWithInfo = ({ infoTooltip, infoDialog, title }) => {

  const [openInfoDialog, setOpenInfoDialog] = useState(false);

  return (
    <>
      <Grid container item xs={3} justifyContent="center">

        <Grid item xs={9} textAlign="end">
          <Typography variant="h5">{title}</Typography>
        </Grid>

        <Grid item xs={2}>
          <IconButton
            aria-label={"info-publication-date"}
            sx={{ paddingTop: "8%", paddingRight: "30%" }}
            edge="start"
            onClick={() => setOpenInfoDialog(true)}
          >
            <Tooltip title={infoTooltip} >{<Info />}</Tooltip>
          </IconButton>
        </Grid>

      </Grid>
      <InfoDialog isOpen={openInfoDialog} handleClose={() => setOpenInfoDialog(false)} title={title} contentTexts={infoDialog} />
    </>
  )
}

export default TypographyWithInfo;