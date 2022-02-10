import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Button } from '@mui/material';
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import { updateAddingAlbumRedux, updateNameOtherArtistsAlbumRedux, updateIdentifierOtherArtistsAlbumRedux } from 'redux/actions/AlbumsActions';
import { v4 as uuidv4 } from 'uuid';
import InfoSwitch from "components/Switch/InfoSwitch";
import { updatePrimaryOtherArtistsAlbumRedux } from '../../redux/actions/AlbumsActions';
import BasicSwitch from 'components/Switch/BasicSwitch';
import ImageDialog from '../Dialogs/ImageDialog';
import CheckboxWithInfo from "components/Checkbox/CheckboxWithInfo";
import { infoSpotifyUri } from "utils/textToShow.utils";


const AddOtherArtistsForm = ({ checkBoxLabel, checkBoxHelper, checkBoxColor, buttonColor }) => {

  const [openTutorialDialog, setOpenTutorialDialog] = useState(false);

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
  const handleAddIdentifier = (identifier, identifierField, otherArtistIndex) => dispatch(updateIdentifierOtherArtistsAlbumRedux(identifier, identifierField, otherArtistIndex))
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

  const handleTutorialDialog = () => setOpenTutorialDialog(!openTutorialDialog);

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

        <ImageDialog title="Ejemplo de un Album con dos artistas Principales:" contentTexts={[[""]]}
          handleClose={handleTutorialDialog} isOpen={openTutorialDialog} imageSource="/images/ejemploDosArtistasPrincipales.png" />
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
              Presionar para más información."
                infoAtLeft={true} />
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
              onChange={(event) => handleAddIdentifier(event.target.value, "spotify_uri", index)}
              helperText={index === 0 ? infoSpotifyUri : ""}
              hrefInfo="https://www.laflota.com.ar/spotify-for-artists/"
              targetHref="_blank"
            />
          </Grid>

          <Grid item sx={gridAppleStyle} key={index + "trackOtherappleIdGrid"}>
            <TextFieldWithInfo
              name="appleIdOhterTackArtist"
              sx={textFieldAppleIDStyle}
              label="Apple ID"
              value={otherArtist.apple_id}
              onChange={(event) => handleAddIdentifier(event.target.value, "apple_id", index)}
              helperText={index === 0 ? "Ingresá el Apple ID. " : ""}
            />
          </Grid>
        </Grid>)
      )}

      {currentAddingAlbum.allOtherArtists.length > 0 &&
        <Grid item xs={12}>
          <Button variant="contained" sx={buttonColorStyle} onClick={addOneArtistSkeleton}>
            Agregar Artista
          </Button>
        </Grid>}
    </>
  )
}

export default AddOtherArtistsForm;

// const textFiedNameStyle = { width: "66.8%" }
// const textFieldURIStyle = { width: "66.8%", marginLeft: "11%" }
// const gridSwitcherStyle = { width: "10%", marginTop: "1%" };
// const gridNameStyle = { width: "45%" }
// const gridUriStyle = { width: "45%", textAlign: "left" };

const textFiedNameStyle = { width: "93%" }
const textFieldURIStyle = { width: "90%" }
const textFieldAppleIDStyle = { width: "90%" }
const gridSwitcherStyle = { width: "10%", marginTop: "1%" };
const gridNameStyle = { width: "40%" }
const gridUriStyle = { width: "22.5%", textAlign: "left" };
const gridAppleStyle = { width: "22.5%", textAlign: "left" };