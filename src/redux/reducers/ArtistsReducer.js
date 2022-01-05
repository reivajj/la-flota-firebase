import * as ReducerTypes from 'redux/actions/Types';

const filterArtistsWithSameIdThanNewOne = (oldArtists, addedArtists) => {
  return addedArtists.filter(artist => !oldArtists.map(oldArtist => oldArtist.id).includes(artist.id))
}

const editAndAddArtist = (oldArtists, editedFieldsFromArtist) => {
  return oldArtists.map(oldArtist => {
    if (oldArtist.id === editedFieldsFromArtist.id) return { ...oldArtist, ...editedFieldsFromArtist };
    else return oldArtist;
  })
}

const initialState = {
  artists: [],
  addingArtist: { name: "", biography: "", imagenUrl: "", id: "" }
}

const ArtistsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReducerTypes.ADD_ARTISTS:
      const newArtists = filterArtistsWithSameIdThanNewOne(state.artists, action.payload);
      return {
        addingArtist: { name: "", biography: "", imagenUrl: "", id: "" },
        artists: [...state.artists, ...newArtists]
      }
    case ReducerTypes.EDIT_ARTIST_WITH_ID:
      const newArtistsPostEdit = editAndAddArtist(state.artists, action.payload);
      return {
        addingArtist: { name: "", biography: "", imagenUrl: "", id: "" },
        artists: newArtistsPostEdit
      }
    case ReducerTypes.ARTISTS_SIGN_OUT:
      return initialState;
    case ReducerTypes.ADDING_ARTIST_NAME:
      return { ...state, addingArtist: { ...state.addingArtist, name: action.payload } }
    case ReducerTypes.ADDING_ARTIST_BIO:
      return { ...state, addingArtist: { ...state.addingArtist, biography: action.payload } }
    case ReducerTypes.ADDING_ARTIST_IMAGEN_URL:
      return { ...state, addingArtist: { ...state.addingArtist, imagenUrl: action.payload } }
    case ReducerTypes.ADDING_ARTIST_ID:
      return { ...state, addingArtist: { ...state.addingArtist, id: action.payload } }
    default:
      return state;
  }
};

export default ArtistsReducer;