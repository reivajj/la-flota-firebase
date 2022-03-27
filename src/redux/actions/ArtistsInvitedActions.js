import * as ReducerTypes from 'redux/actions/Types';
import { createArtistRedux } from './ArtistsActions';
import { toWithOutError, to } from 'utils';
import { updateAddingAlbumRedux } from 'redux/actions/AlbumsActions';

export const createOtherArtistsRedux = (allOtherArtistsAlbum, ownerId, ownerEmail, artistsInvited, currentAddingAlbum) => async dispatch => {
  let allOtherArtistsNotEmptyAlbum = allOtherArtistsAlbum.filter(otherArtist => otherArtist.name !== "");

  let allOtherArtistNotCreatedPreviously = allOtherArtistsNotEmptyAlbum.filter(otherArtist => {
    let artistExist = artistsInvited.find(oldInvitedArtist => oldInvitedArtist.name === otherArtist.name);
    return !(artistExist && artistExist.fugaId && artistExist.spotify_uri === otherArtist.spotify_uri && artistExist.apple_id === otherArtist.apple_id)
  })

  // Si el artista invitado ya existe en FUGA y en FS, simplemente agrego su fugaId al artist correspondiente en el album que estoy agregando.
  allOtherArtistsNotEmptyAlbum.forEach(otherArtist => {
    let artistExist = artistsInvited.find(oldInvitedArtist => oldInvitedArtist.name === otherArtist.name);
    if (artistExist && artistExist.fugaId && artistExist.spotify_uri === otherArtist.spotify_uri && artistExist.apple_id === otherArtist.apple_id) {
      let newOtherArtists = currentAddingAlbum.allOtherArtists.filter(oldOtherArtists => oldOtherArtists.name !== artistExist.name);
      dispatch(updateAddingAlbumRedux({ ...currentAddingAlbum, allOtherArtists: [...newOtherArtists, artistExist] }));
    }
  })

  // Solo creo artistas invitados si no existian en fuga o fs.
  const createOtherArtistOneByOne = allOtherArtistNotCreatedPreviously.map(async dataArtist => {
    dataArtist.ownerId = ownerId; dataArtist.ownerEmail = ownerEmail;
    let artistCreatedResult = await toWithOutError(dispatch(createArtistRedux(false, dataArtist, ownerId, ownerEmail, "artistsInvited", "totalArtistsInvited")));
    if (artistCreatedResult === "ERROR") return "ERROR";
    return "SUCCESS";
  });

  let [errorCreatingAllArtists] = await to(Promise.all(createOtherArtistOneByOne));
  if (errorCreatingAllArtists) return "ERROR";

  dispatch({
    type: ReducerTypes.INVITED_ARTISTS_ADD,
    payload: allOtherArtistNotCreatedPreviously
  });

  return allOtherArtistNotCreatedPreviously;
}

export const addArtistsInvited = artistsInvited => {
  return {
    type: ReducerTypes.INVITED_ARTISTS_ADD,
    payload: artistsInvited
  };
};

export const invitedArtistSignOut = () => {
  return {
    type: ReducerTypes.INVITED_ARTISTS_SIGN_OUT
  }
}