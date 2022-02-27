import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContentText, DialogContent, Grid, DialogActions, Fab, IconButton
} from '@mui/material';
import { Check } from '@mui/icons-material/';
import { Image } from 'mui-image';
import { buttonSuccessStyle } from '../../utils/commonStyles';
import { dspIds } from "variables/fuga";

const LiveLinksDialog = (props) => {

  const { isOpen, liveLinksInfo, handleClose } = props;

  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [appleUrl, setAppleUrl] = useState("");

  const getLiveLinkTextByDSP = () => {
    if (spotifyUrl && appleUrl) return "Los Live Links de Spotify y Apple ya están disponibles.";
    if (spotifyUrl) return "El Live Link de Spotify ya está disponible, el de Apple todavía no.";
    if (appleUrl) return "El Live Link de Apple ya está disponible, el de Spotify todavía no.";
    return "Live Links todavía no disponibles.";
  }

  useEffect(() => {
    console.log("Live links useEffect: ", liveLinksInfo);
    if (liveLinksInfo.length === 0) return;

    let spotifyLink = liveLinksInfo.find(liveLink => liveLink.dsp.id === dspIds.spotify_dsp_id);
    if (spotifyLink) setSpotifyUrl(spotifyLink.url);
    let appleLink = liveLinksInfo.find(liveLink => liveLink.dsp.id === dspIds.apple_dsp_id);
    if (appleLink) setAppleUrl(appleLink.url);
  }, [liveLinksInfo])

  return (
    <Dialog
      maxWidth="md"
      id="success-dialog"
      open={isOpen}
      onClose={handleClose}>

      <DialogTitle id="title-success-dialog">
        {`${(spotifyUrl || appleUrl) ? getLiveLinkTextByDSP() : "Live Links todavía no disponibles."}`}
      </DialogTitle>

      <DialogContent>
        <DialogContentText key={"Live link"}>
          {`${(spotifyUrl || appleUrl) ? "Haz click en el logo de la DSP para ir al link"
            : "Todavía estamos esperando que las DSPs generen los Live Links."}`}
        </DialogContentText>
      </DialogContent>

      <Grid container textAlign="center">
        {spotifyUrl &&
          <Grid item xs={appleUrl ? 6 : 12} >
            <IconButton href={spotifyUrl} target="_blank">
              <Image
                component="img"
                src={"/images/spotify.png"}
                duration={30}
                alt="Felicitaciones!."
              />
            </IconButton>
          </Grid>
        }

        {appleUrl &&
          <Grid item xs={spotifyUrl ? 6 : 12}>
            <IconButton href={appleUrl} target="_blank">
              <Image
                component="img"
                src={"/images/apple-music.png"}
                duration={30}
                alt="Felicitaciones!."
              />
            </IconButton>
          </Grid>
        }
      </Grid>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Fab
          aria-label="success"
          sx={buttonSuccessStyle}
          onClick={handleClose}
        >
          <Check sx={{ color: "rgba(255,255,255, 1)" }} />
        </Fab>
      </DialogActions>
    </Dialog>
  )
}

export default LiveLinksDialog;