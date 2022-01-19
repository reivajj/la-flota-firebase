import * as ReducerTypes from 'redux/actions/Types';
import { createArtistRedux } from './ArtistsActions';
import { toWithOutError, to } from 'utils';

export const createOtherArtistsInFuga = (allOtherArtistsAlbum, ownerId) => async dispatch => {
  let allOtherArtistsNotEmptyAlbum = allOtherArtistsAlbum.filter(otherArtist => otherArtist.name !== "");

  const createOtherArtistOneByOne = allOtherArtistsNotEmptyAlbum.map(async dataArtist => {
    dataArtist.ownerId = ownerId;
    let artistCreatedResult = await toWithOutError(dispatch(createArtistRedux(dataArtist, ownerId, "artistsInvited", "totalArtistsInvited")));
    if (artistCreatedResult === "ERROR") return "ERROR";
    return "SUCCESS";
  });

  let [errorCreatingAllArtists, successCreatingAllArtists] = await to(Promise.all(createOtherArtistOneByOne));
  if (errorCreatingAllArtists) {
    console.log("ERROR EN EL PROMISE ALL :", errorCreatingAllArtists);
    return "ERROR";
  }

  console.log("Success creando los tracks en el album: ", successCreatingAllArtists);
  console.log("Los artists despues de agregar todo: ", allOtherArtistsNotEmptyAlbum);

  dispatch({
    type: ReducerTypes.ADD_INVITED_ARTISTS,
    payload: allOtherArtistsNotEmptyAlbum
  });

  return "SUCCESS";
}

export const addArtistsInvited = artistsInvited => {
  return {
    type: ReducerTypes.ADD_INVITED_ARTISTS,
    payload: artistsInvited
  };
};