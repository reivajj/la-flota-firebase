import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';
import { createArtistModel } from '../../services/CreateModels';

export const createArtistRedux = (artist, userId) => async dispatch => {

  let formDataArtist = createArtistModel(artist)
  let artistFromThirdWebApi = await BackendCommunication.createArtistFuga(formDataArtist);
  if (artistFromThirdWebApi.error) {
    console.log("Error from FUGA, or connection error: ", artistFromThirdWebApi);
    // ACA REALIZAR EL DISPATCH PARA HANDLEAR EL ERROR
    return;
  }

  console.log("Lo que vuelve de FUGA en ArtistsAction: ", artistFromThirdWebApi);
  
  // const artistFromThirdWebApi = {
  //   data:
  //     { response: { id: "testingFS", proprietary_id: "testingFS" } }
  // }
  
  artist.id = uuidv4();
  artist.ownerId = userId;

  artist.fugaId = artistFromThirdWebApi.data.response.id;
  artist.fugaPropietaryId = artistFromThirdWebApi.data.response.proprietary_id;

  await FirestoreServices.createElementFS(artist, userId, "artists", "totalArtists", 1, dispatch);

  return dispatch({
    type: ReducerTypes.ADD_ARTISTS,
    payload: [artist]
  });
}
