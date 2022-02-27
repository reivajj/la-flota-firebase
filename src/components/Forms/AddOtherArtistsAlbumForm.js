import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Button, IconButton } from '@mui/material';
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import { updateAddingAlbumRedux, updateNameOtherArtistsAlbumRedux, updateIdentifierOtherArtistsAlbumRedux } from 'redux/actions/AlbumsActions';
import { v4 as uuidv4 } from 'uuid';
import InfoSwitch from "components/Switch/InfoSwitch";
import { updatePrimaryOtherArtistsAlbumRedux } from '../../redux/actions/AlbumsActions';
import BasicSwitch from 'components/Switch/BasicSwitch';
import ImageDialog from '../Dialogs/ImageDialog';
import CheckboxWithInfo from "components/Checkbox/CheckboxWithInfo";
import { featuringArtistTooltip, getNumeracionOrdinalFromIndex, infoSpotifyUri } from "utils/textToShow.utils";
import { Delete } from '@mui/icons-material';


const AddOtherArtistsForm = ({ checkBoxLabel, checkBoxHelper, checkBoxColor, buttonColor }) => {

  const [openTutorialDialog, setOpenTutorialDialog] = useState(false);
  const [openFeatTutorialDialog, setOpenFeatTutorialDialog] = useState(false);

  const buttonColorStyle = {
    backgroundColor: buttonColor,
    '&:hover': {
      backgroundColor: buttonColor,
    },
  }

  const dispatch = useDispatch();
  const currentAddingAlbum = useSelector(store => store.albums.addingAlbum);

  const addOneArtistSkeleton = () => {
    if (currentAddingAlbum.allOtherArtists.length >= 4) return;
    let artist = { name: "", spotify_uri: "", apple_id: "", id: uuidv4(), primary: false };
    dispatch(updateAddingAlbumRedux({ ...currentAddingAlbum, allOtherArtists: [...currentAddingAlbum.allOtherArtists, artist] }));
  }

  const deleteAllOtherArtists = () => {
    dispatch(updateAddingAlbumRedux({ ...currentAddingAlbum, allOtherArtists: [] }));
  }

  const handleChangeArtistPrimary = (isPrimary, otherArtistIndex) => dispatch(updatePrimaryOtherArtistsAlbumRedux(isPrimary, otherArtistIndex));
  const handlerAddNameToOtherArtists = (nameValue, otherArtistIndex) => dispatch(updateNameOtherArtistsAlbumRedux(nameValue, otherArtistIndex));
  const handleAddIdentifier = (identifierValue, identifierField, otherArtistIndex) => dispatch(updateIdentifierOtherArtistsAlbumRedux(identifierValue, identifierField, otherArtistIndex))
  const handleOnChangeCheckBox = (event) => {
    if (event.target.checked) addOneArtistSkeleton();
    else deleteAllOtherArtists();
  }

  const handleDeleteOtherArtist = otherArtistIndex => {
    const newOtherArtists = currentAddingAlbum.allOtherArtists.filter((_, index) => index !== otherArtistIndex);
    dispatch(updateAddingAlbumRedux({ ...currentAddingAlbum, allOtherArtists: newOtherArtists }));
  }


  const getOtherArtistPositionFromIndex = otherArtistIndex => {
    if (otherArtistIndex >= 20) return "NO PUEDES AGREGAR MÁS DE 20 ARTISTAS";
    return `Nombre ${getNumeracionOrdinalFromIndex[otherArtistIndex]} Artista`;
  }

  const handleTutorialDialog = () => setOpenTutorialDialog(!openTutorialDialog);
  const handleFeatTutorialDialog = () => setOpenFeatTutorialDialog(!openFeatTutorialDialog);

  return (
    <>
      <Grid container item xs={12}>
        <CheckboxWithInfo
          label={checkBoxLabel}
          onChecked={handleOnChangeCheckBox}
          checked={currentAddingAlbum.allOtherArtists.length > 0}
          color={checkBoxColor}
          checkBoxHelper={checkBoxHelper}
          onClickInfo={handleTutorialDialog}
        />

        <ImageDialog title="Ejemplo de un Lanzamiento con dos artistas Principales:" contentTexts={[[""]]}
          handleClose={handleTutorialDialog} isOpen={openTutorialDialog} imageSource="/images/ejemploDosArtistasPrincipales.png" />
      </Grid>

      <ImageDialog title="Ejemplo de un Lanzamiento con un Featuring Artist:" contentTexts={[[""]]}
        handleClose={handleFeatTutorialDialog} isOpen={openFeatTutorialDialog} imageSource="/images/ejemploDosArtistasPrincipales.png" />

      {currentAddingAlbum.allOtherArtists.map((otherArtist, index) => (

        < Grid container item xs={12} key={index + "bigGrid"} >

          <Grid item sx={gridSwitcherStyle} key={index + "switch-primary"}>
            {index === 0
              ? <InfoSwitch
                key={index + "switch-info"}
                label={otherArtist.primary ? "Principal" : "Featuring"}
                onChange={(event) => handleChangeArtistPrimary(event.target.checked, index)}
                checked={otherArtist.primary}
                infoTooltip={featuringArtistTooltip}
                infoAtLeft={true}
                onClickInfo={handleFeatTutorialDialog} />
              : <BasicSwitch
                key={index + "switch-basic"}
                label={otherArtist.primary ? "Principal" : "Featuring"}
                onChange={(event) => handleChangeArtistPrimary(event.target.checked, index)}
                checked={otherArtist.primary} />
            }
          </Grid>

          <Grid item sx={gridNameStyle} key={index + "nameGrid"} textAlign="left">
            <TextFieldWithInfo
              key={index + "nameTextfield"}
              name={getOtherArtistPositionFromIndex(index)}
              sx={textFiedNameStyle}
              label={getOtherArtistPositionFromIndex(index)}
              value={otherArtist.name}
              onChange={(event) => handlerAddNameToOtherArtists(event.target.value, index)}
              helperText={index === 0 ? "Ingresa el nombre → Debe coincidir 100% como aparece en las DSPs. Dejar vacío si no quieres agregarlo. " : ""}
            />
          </Grid>

          <Grid item sx={gridUriStyle} key={index + "spotifyUriGrid"}>
            <TextFieldWithInfo
              key={index + "spotyAlbum"}
              name="spotifyUriSecondArtist"
              sx={textFieldURIStyle}
              label="Código Uri de Spotify"
              value={otherArtist.spotify_uri}
              onChange={(event) => handleAddIdentifier(event.target.value, "spotify_uri", index)}
              helperText={index === 0 ? infoSpotifyUri : ""}
              hrefInfo="https://www.laflota.com.ar/spotify-for-artists/"
              targetHref="_blank"
              // validatorProps={{
              //   restrictions: [{ regex: '^(spotify:artist:)([a-zA-Z0-9]+)(.*)$' }],
              //   message: "El formato del Spotify Uri es inválido. (Formato: spotify:artist:2ERtLJTrO8RXGMAEYOJeQc)", validator
              // }}
            />
          </Grid>

          <Grid item sx={gridAppleStyle} key={index + "trackOtherappleIdGrid"}>
            <TextFieldWithInfo
              key={index + "appleAlbum"}
              name="appleIdOhterTackArtist"
              sx={textFieldAppleIDStyle}
              label="Apple ID"
              value={otherArtist.apple_id}
              onChange={(event) => handleAddIdentifier(event.target.value, "apple_id", index)}
              helperText={index === 0 ? "Si tenes el Apple ID del perfil de Artista donde queres que subamos la música, ingresalo. Podes encontrarla en tu perfil en iTunes (son los últimos dígitos de la URL de tu perfil)." : ""}
            // validatorProps={{ restrictions: 'max:30|numeric', message: "El Apple ID es un código númerico que no contiene letras.", validator }}
            />
          </Grid>

          <Grid item sx={gridDeleteStyle} key={index + "deleteIcon"}>
            <IconButton color="inherit" size="large" onClick={(_) => handleDeleteOtherArtist(index)}>
              <Delete fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>)
      )}

      {currentAddingAlbum.allOtherArtists.length > 0 &&
        <Grid item xs={12} sx={{ paddingTop: "1%" }}>
          <Button variant="contained" sx={buttonColorStyle} onClick={addOneArtistSkeleton}>
            Agregar Artista
          </Button>
        </Grid>}
    </>
  )
}

export default AddOtherArtistsForm;

const textFiedNameStyle = { width: "93%" }
const textFieldURIStyle = { width: "90%" }
const textFieldAppleIDStyle = { width: "90%" }
const gridSwitcherStyle = { width: "10%", marginTop: "1%" };
const gridNameStyle = { width: "35%" }
const gridUriStyle = { width: "22.5%", textAlign: "left" };
const gridAppleStyle = { width: "22.5%", textAlign: "left" };
const gridDeleteStyle = { width: "5%", marginTop: "1.2%", color: "gray", textAlign: "initial" };