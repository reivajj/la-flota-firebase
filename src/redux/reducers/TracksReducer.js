import * as ReducerTypes from 'redux/actions/Types';

const checkNewTracks = (oldTracks, tracks) => {
  return tracks.filter(track => !oldTracks.map(oldTracks => { return { provisionalId: oldTracks.provisionalId, id: oldTracks.id || "" } })
    .includes({ provisionalId: track.provisionalId, id: track.id || "" }))
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
      return { ...state, uploadingTracks: [...state.uploadingTracks, ...action.payload] }

    case ReducerTypes.EDIT_TRACK_POST_UPLOAD_IN_DB:
      return { ...state, tracks: [...state.tracks, ...action.payload], uploadingTracks: [] }

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