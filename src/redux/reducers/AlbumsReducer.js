import * as ReducerTypes from 'redux/actions/Types';

const initialState = {
  albums: []
}

const AlbumsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReducerTypes.ADD_ALBUMS:
      return { ...state, albums: [...state.albums, ...action.payload] }
    case ReducerTypes.ALBUMS_SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export default AlbumsReducer;