import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';
import { createArtistModel } from '../../services/CreateModels';

export const createArtistRedux = (artist, userId) => async dispatch => {

  let formDataArtist = createArtistModel(artist)
  let artistFromThirdWebApi = await BackendCommunication.createArtistFuga(formDataArtist, dispatch);
  if (artistFromThirdWebApi === "ERROR") return "ERROR";

  artist.id = uuidv4();
  artist.ownerId = userId;
  artist.fugaId = artistFromThirdWebApi.data.response.id;
  artist.fugaPropietaryId = artistFromThirdWebApi.data.response.proprietary_id;
  delete artist.photo;

  await FirestoreServices.createElementFS(artist, artist.id, userId, "artists", "totalArtists", 1, dispatch);

  dispatch({
    type: ReducerTypes.ADD_ARTISTS,
    payload: [artist]
  });

  return "SUCCESS";
}
