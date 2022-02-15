import * as ReducerTypes from 'redux/actions/Types';
import { createArtistRedux } from './ArtistsActions';
import { toWithOutError, to } from 'utils';

export const createOtherArtistsRedux = (allOtherArtistsAlbum, ownerId, artistsInvited) => async dispatch => {
  let allOtherArtistsNotEmptyAlbum = allOtherArtistsAlbum.filter(otherArtist => otherArtist.name !== "");
  
  let allOtherArtistNotCreatedPreviously = allOtherArtistsNotEmptyAlbum.filter(otherArtist => {
    let artistExist = artistsInvited.find(oldInvitedArtist => oldInvitedArtist.name === otherArtist.name);
    return !(artistExist && artistExist.spotify_uri === otherArtist.spotify_uri && artistExist.apple_id === otherArtist.apple_id)
  })

  const createOtherArtistOneByOne = allOtherArtistNotCreatedPreviously.map(async dataArtist => {
    dataArtist.ownerId = ownerId;
    let artistCreatedResult = await toWithOutError(dispatch(createArtistRedux(dataArtist, ownerId, "artistsInvited", "totalArtistsInvited")));
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