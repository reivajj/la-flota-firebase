import * as ReducerTypes from 'redux/actions/Types';
import { createArtistRedux } from './ArtistsActions';
import { toWithOutError, to } from 'utils';

export const createOtherArtistsInFuga = (allOtherPrimaryArtistsAlbum, ownerId) => async dispatch => {
  allOtherPrimaryArtistsAlbum = allOtherPrimaryArtistsAlbum.filter(otherArtist => otherArtist.name !== "");

  const createOtherArtistOneByOne = allOtherPrimaryArtistsAlbum.map(async dataArtist => {
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
  console.log("Los artists despues de agregar todo: ", allOtherPrimaryArtistsAlbum);

  dispatch({
    type: ReducerTypes.ADD_INVITED_ARTISTS,
    payload: allOtherPrimaryArtistsAlbum
  });

  return "SUCCESS";
}

export const addArtistsInvited = artistsInvited => {
  return {
    type: ReducerTypes.ADD_INVITED_ARTISTS,
    payload: artistsInvited
  };
};