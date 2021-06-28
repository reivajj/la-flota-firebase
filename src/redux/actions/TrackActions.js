import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';

export const createTrackLocalRedux = (track, userId) => {
  track.provisionalId = uuidv4();
  track.ownerId = userId;
  return {
    type: ReducerTypes.ADD_TRACKS,
    payload: [track]
  };
}


export const createTrackDashGoAndFireStore = (track, userId) => {
  return async dispatch => {
    let formDataTrack = new FormData();
    formDataTrack.append("name", track.nombre);
    if(track.bio) formDataTrack.append("bio", track.bio);
    if(track.apple_id) formDataTrack.append("apple_id", track.apple_id);
    if(track.spotify_uri) formDataTrack.append("spotify_uri", track.spotify_uri);

    track.id = uuidv4();

    let trackFromThirdWebApi = BackendCommunication.createTrackDashGo(formDataTrack);
    track.dashGoId = trackFromThirdWebApi.data.response.id;

    await FirestoreServices.createTrack(track, userId);

    return dispatch({
      type: ReducerTypes.EDIT_TRACK,
      payload: track
    });
  }
}
