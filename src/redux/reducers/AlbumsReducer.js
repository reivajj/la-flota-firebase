import * as ReducerTypes from 'redux/actions/Types';

const checkNewAlbums = (oldAlbums, albums) => {
  return albums.filter(album => !oldAlbums.map(oldAlbum => oldAlbum.id).includes(album.id))
}

const initialState = {
  albums: []
}

const AlbumsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReducerTypes.ADD_ALBUMS:
      const newAlbums = checkNewAlbums(state.albums, action.payload)
      return { ...state, albums: [...state.albums, ...newAlbums] }
    case ReducerTypes.ALBUMS_SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export default AlbumsReducer;