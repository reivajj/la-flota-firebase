import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';

export const createTrackLocalRedux = (trackData, userId) => {
  trackData.provisionalId = uuidv4();
  trackData.ownerId = userId;
  return {
    type: ReducerTypes.ADD_TRACKS,
    payload: [trackData]
  };
}


export const createTrackDashGoAndFireStore = (track, userId) => {
  return async dispatch => {
    let formDataTrack = new FormData();
    formDataTrack.append("name", track.nombre);

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
