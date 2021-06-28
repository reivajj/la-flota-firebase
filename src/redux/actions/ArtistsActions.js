import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';

export const createArtistRedux = (artist, userId) => {
  return async dispatch => {
    let formDataArtist = new FormData();
    formDataArtist.append("name", artist.nombre);
    if(artist.bio) formDataArtist.append("bio", artist.bio);
    if(artist.apple_id) formDataArtist.append("apple_id", artist.apple_id);
    if(artist.spotify_uri) formDataArtist.append("spotify_uri", artist.spotify_uri);

    artist.id = uuidv4();
    artist.ownerId = userId;

    let artistFromThirdWebApi = await BackendCommunication.createArtistDashGo(formDataArtist);
    artist.dashGoId = artistFromThirdWebApi.data.response.id;

    await FirestoreServices.createArtist(artist, userId);

    return dispatch({
      type: ReducerTypes.ADD_ARTISTS,
      payload: [ artist ]
    });
  }
}
