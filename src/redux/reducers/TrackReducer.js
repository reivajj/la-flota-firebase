import * as ReducerTypes from 'redux/actions/Types';

const checkNewTracks = (oldTracks, tracks) => {
  return tracks.filter(track => !oldTracks.map(oldTracks => { return { provisionalId: oldTracks.provisionalId, id: oldTracks.id || "" } })
    .includes({ provisionalId: track.provisionalId, id: track.id || "" }))
}

const editTrack = (oldTracks, newTrack) => {
  return oldTracks.map(oldTrack => {
    if (oldTrack.provisionalId === newTrack.provisionalId) {
      oldTrack = { ...newTrack };
      delete oldTrack.provisionalId;
    }
    return oldTrack;
  })
}

const initialState = {
  tracks: []
}

const TracksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReducerTypes.ADD_TRACKS:
      const newTracks = checkNewTracks(state.tracks, action.payload);
      return { ...state, tracks: [...state.tracks, ...newTracks] }
    case ReducerTypes.EDIT_TRACK:
      const editedTracks = editTrack(state.tracks, action.payload);
      return { ...state, tracks: [...state.tracks, ...editedTracks] }
    case ReducerTypes.TRACKS_SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export default TracksReducer;