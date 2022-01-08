import * as ReducerTypes from 'redux/actions/Types';

const checkNewAlbums = (oldAlbums, albums) => {
  return albums.filter(album => !oldAlbums.map(oldAlbum => oldAlbum.id).includes(album.id))
}

const initialState = {
  albums: [],
  addingAlbum: {
    nombreArtist: "", imagenUrl: "", label_name: "", title: "", id: "",
    p_year: 2021, p_line: "", c_year: 2021, c_line: "", dayOfMonth: "", cover: "",
    month: "", year: "", genre: "", language: "", disc_number: ""
  }
}


const AlbumsReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.ADD_ALBUMS:
      const newAlbums = checkNewAlbums(state.albums, action.payload)
      return { addingAlbum: initialState.addingAlbum, albums: [...state.albums, ...newAlbums] }

    case ReducerTypes.ALBUMS_UPDATE_ADDING_ALBUM:
      return { ...state, addingAlbum: action.payload }
  
    case ReducerTypes.ALBUMS_SIGN_OUT:
      return initialState;

    default:
      return state;
  }
};

export default AlbumsReducer;