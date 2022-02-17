import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Typography, Button, DialogContentText
} from '@mui/material';
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import { useSelector } from 'react-redux';
import { infoSpotifyUri, maxArtistsText } from 'utils/textToShow.utils';


export const AddMoreArtistsInAlbumDialog = (props) => {

  const { validator, isOpen, handleClose, title, changeArtistName, changeArtistBio, changeAppleId, changeSpotifyUri
    , progressButton, cannotAddArtists } = props;

  const currentArtistData = useSelector(store => store.artists.addingArtist);
  const currentPlan = useSelector(store => store.userData.plan);

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      id="collaborative-dialog"
      open={isOpen}
      onClose={handleClose}>

      {!cannotAddArtists
        ? <>
          <DialogTitle id="add-artist-dialog">
            <Typography >{title}</Typography>
          </DialogTitle>

          <DialogContent>
            <Grid container spacing={2} sx={{ textAlign: "center", paddingTop: "6px" }}>

              <TextFieldWithInfo
                name="name"
                required
                fullWidth
                label="Nombre del Artista"
                autoFocus
                value={currentArtistData.name}
                onChange={changeArtistName}
                validatorProps={{ restrictions: 'required|max:50', message: "Debes ingresar un nombre.", validator }}
              />

              <TextFieldWithInfo
                name="spotify_uri"
                fullWidth
                label="Spotify Uri"
                value={currentArtistData.spotify_uri}
                onChange={changeSpotifyUri}
                helperText={infoSpotifyUri}
                hrefInfo="https://www.laflota.com.ar/spotify-for-artists/"
                targetHref="_blank"
              />

              <TextFieldWithInfo
                name="apple_id"
                fullWidth
                label="Apple ID"
                value={currentArtistData.apple_id}
                onChange={changeAppleId}
                helperText="Si tenes el Apple ID del perfil de Artista donde queres que subamos la música, ingresalo. 
                    Podes encontrarla en tu perfil en iTunes (son los últimos dígitos de la URL de tu perfil)."
              />

              <TextField
                margin="normal"
                id="bio"
                name="bio"
                label="Breve Biografía (max 500 caracteres)"
                fullWidth
                value={currentArtistData.biography}
                multiline={true}
                inputProps={{ maxLength: 500 }}
                maxRows="3"
                onChange={changeArtistBio} />

            </Grid>
          </DialogContent >
        </>
        : <>
          <DialogTitle id="add-artist-dialog">
            <Typography >No puedes agregar más Artistas</Typography>
          </DialogTitle>
          <DialogContent>
            {maxArtistsText.map((contentText, index) =>
              <DialogContentText key={index}>
                {contentText}
              </DialogContentText>
            )}
            <DialogContentText key={"plan"} sx={{ paddingTop: "2em" }}>
                <Typography sx={{ fontWeight: 500 }}>{`Tu Plan actual es: ${currentPlan}. (Si crees que es un error, contáctanos)`}</Typography>
              </DialogContentText>
          </DialogContent>

        </>
      }

      {!cannotAddArtists && <DialogActions sx={{ overflow: "scroll" }}>
        {progressButton}
      </DialogActions>}
      <DialogActions>
        <Button onClick={handleClose} sx={buttonColorStyle}>
          Atras
        </Button>
      </DialogActions>
    </Dialog >
  )
}

const buttonColorStyle = { color: "#508062" };