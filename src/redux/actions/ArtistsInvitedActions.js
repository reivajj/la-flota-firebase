import * as ReducerTypes from 'redux/actions/Types';
import { createArtistRedux } from './ArtistsActions';
import { toWithOutError, to } from 'utils';

export const createOtherArtistsRedux = (allOtherArtistsAlbum, ownerId) => async dispatch => {
  let allOtherArtistsNotEmptyAlbum = allOtherArtistsAlbum.filter(otherArtist => otherArtist.name !== "");

  const createOtherArtistOneByOne = allOtherArtistsNotEmptyAlbum.map(async dataArtist => {
    dataArtist.ownerId = ownerId;
    let artistCreatedResult = await toWithOutError(dispatch(createArtistRedux(dataArtist, ownerId, "artistsInvited", "totalArtistsInvited")));
    if (artistCreatedResult === "ERROR") return "ERROR";
    return "SUCCESS";
  });

  let [errorCreatingAllArtists] = await to(Promise.all(createOtherArtistOneByOne));
  if (errorCreatingAllArtists) return "ERROR";

  dispatch({
    type: ReducerTypes.INVITED_ARTISTS_ADD,
    payload: allOtherArtistsNotEmptyAlbum
  });

  return "SUCCESS";
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