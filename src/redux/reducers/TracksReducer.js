import * as ReducerTypes from 'redux/actions/Types';
import { recalculatePositions, reorderTracksByPosition } from '../../utils/tracks.utils';

const checkNewTracks = (oldTracks, tracks) => {
  return tracks.filter(track => !oldTracks.map(oldTracks => { return { provisionalId: oldTracks.provisionalId, id: oldTracks.id || "" } })
    .includes({ provisionalId: track.provisionalId, id: track.id || "" }))
}

const editAndAddTrack = (oldTracks, editedTrack) => {
  return oldTracks.map(oldTrack => {
    if (oldTrack.id === editedTrack.id) return editedTrack;
    else return oldTrack;
  })
}

const checkIfAddedTrackExistAndEditPosition = (oldTracks, newTrack) => {
  if (oldTracks === []) return [newTrack];
  oldTracks.forEach(oldTrack => {
    if (oldTrack.id === newTrack.id) newTrack.position = oldTrack.position;
  })
  return [...oldTracks.filter(oldTrack => oldTrack.id !== newTrack.id), newTrack]
}

const initialState = {
  tracks: [], uploadingTracks: []
}

const TracksReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.ADD_TRACKS:
      const newTracks = checkNewTracks(state.tracks, action.payload);
      return { ...state, tracks: [...state.tracks, ...newTracks] }

    case ReducerTypes.ADD_UPLOADING_TRACKS:
      return { ...state, uploadingTracks: reorderTracksByPosition(checkIfAddedTrackExistAndEditPosition(state.uploadingTracks, action.payload)) }

    case ReducerTypes.TRACK_UPLOADING_EDIT:
      return { ...state, uploadingTracks: editAndAddTrack(state.uploadingTracks, action.payload) }

    case ReducerTypes.TRACK_UPLOADING_DELETE:
      return { ...state, uploadingTracks: recalculatePositions(state.uploadingTracks.filter(uT => uT.id !== action.payload)) }

    case ReducerTypes.EDIT_TRACK_POST_UPLOAD_IN_DB:
      return { ...state, tracks: [...state.tracks, ...action.payload] }

    case ReducerTypes.TRACKS_UPLOADING_CLEAN:
      return { ...state, uploadingTracks: [] };  

    case ReducerTypes.SET_TRACK_UPLOAD_PROGRESS:
      return {
        ...state, uploadingTracks: state.uploadingTracks.map(track => {
          if (track.position === action.payload.position) track.progress = action.payload.percentageProgress
          return track;
        })
      }

    case ReducerTypes.TRACKS_SIGN_OUT:
      return initialState;

    default:
      return state;
  }
};

export default TracksReducer;