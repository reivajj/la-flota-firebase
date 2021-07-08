import * as ReducerTypes from 'redux/actions/Types';

const checkNewTracks = (oldTracks, tracks) => {
  return tracks.filter(track => !oldTracks.map(oldTracks => { return { provisionalId: oldTracks.provisionalId, id: oldTracks.id || "" } })
    .includes({ provisionalId: track.provisionalId, id: track.id || "" }))
}

// el newTrack tendrá del album_id y album_dashgo_id;
const editTrackPostUploadInDB = newTracks => {
  return newTracks.map(track => {
    delete track.provisionalId;
    return track;
  });
}

const initialState = {
  tracks: []
}

const TracksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReducerTypes.ADD_TRACKS:
      const newTracks = checkNewTracks(state.tracks, action.payload);
      return { ...state, tracks: [...state.tracks, ...newTracks] }
    case ReducerTypes.EDIT_TRACK_POST_UPLOAD_IN_DB:
      const editedTracks = editTrackPostUploadInDB(action.payload);
      return { ...state, tracks: [...state.tracks, ...editedTracks] }
    case ReducerTypes.TRACKS_SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export default TracksReducer;