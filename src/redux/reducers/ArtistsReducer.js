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
  addingArtist: { name: "", biography: "", imagenUrl: "", id: "", spotify_uri: "", apple_id: "", imagenRef: "" }
}

const ArtistsReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.ADD_ARTISTS:
      const newArtists = filterArtistsWithSameIdThanNewOne(state.artists, action.payload);
      return { addingArtist: initialState.addingArtist, artists: [...state.artists, ...newArtists] }

    case ReducerTypes.EDIT_ARTIST_WITH_ID:
      return { addingArtist: initialState.addingArtist, artists: editAndAddArtist(state.artists, action.payload) }

    case ReducerTypes.ARTIST_DELETE_WITH_ID:
      return { ...state, artists: state.artists.filter(artist => artist.id !== action.payload) };

    case ReducerTypes.ARTISTS_SIGN_OUT:
      return initialState;

    case ReducerTypes.ADDING_ARTIST_NAME:
      return { ...state, addingArtist: { ...state.addingArtist, name: action.payload } }

    case ReducerTypes.ADDING_ARTIST_BIO:
      return { ...state, addingArtist: { ...state.addingArtist, biography: action.payload } }

    case ReducerTypes.ADDING_ARTIST_IMAGEN_URL:
      return { ...state, addingArtist: { ...state.addingArtist, imagenUrl: action.payload.imagenUrl, imagenRef: action.payload.imagenRef } }

    case ReducerTypes.ADDING_ARTIST_ID:
      return { ...state, addingArtist: { ...state.addingArtist, id: action.payload } }

    case ReducerTypes.ADDING_ARTIST_SPOTIFY_URI:
      return { ...state, addingArtist: { ...state.addingArtist, spotify_uri: action.payload } }
      
    case ReducerTypes.ADDING_ARTIST_APPLE_ID:
      return { ...state, addingArtist: { ...state.addingArtist, apple_id: action.payload } }
    default:
      return state;
  }
};

export default ArtistsReducer;