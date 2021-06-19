import * as ReducerTypes from 'redux/actions/Types';

const initialState = {
  artists: []
}

const ArtistsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReducerTypes.ADD_ARTISTS:
      return { ...state, artists: [...state.artists, ...action.payload] }
    case ReducerTypes.ARTISTS_SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export default ArtistsReducer;