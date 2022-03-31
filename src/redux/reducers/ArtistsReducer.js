import * as ReducerTypes from 'redux/actions/Types';

const filterArtistsWithSameIdThanNewOne = (oldArtists, addedArtists) => {
  if (!addedArtists) return oldArtists;
  return oldArtists.filter(artist => !addedArtists.map(addedArtist => addedArtist.id).includes(artist.id));
}

const editAndAddArtist = (oldArtists, editedFieldsFromArtist) => {
  return oldArtists.map(oldArtist => {
    if (oldArtist.id === editedFieldsFromArtist.id) return { ...oldArtist, ...editedFieldsFromArtist };
    else return oldArtist;
  })
}

const initialState = {
  artists: [],
  addingArtist: {
    name: "", biography: "", imagenUrl: "", id: "", spotify_uri: "", apple_id: "", imagenRef: "",
    spotifyIdentifierIdFuga: "", appleIdentifierIdFuga: "", fugaId: "", ownerEmail: "", ownerId: "",
  }
}

const ArtistsReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.ADD_ARTISTS:
      const oldUniqueArtistsInvited = filterArtistsWithSameIdThanNewOne(state.artists, action.payload);
      return { addingArtist: initialState.addingArtist, artists: [...oldUniqueArtistsInvited, ...action.payload] }

    case ReducerTypes.EDIT_ARTIST_WITH_ID:
      return { addingArtist: initialState.addingArtist, artists: editAndAddArtist(state.artists, action.payload) }

    case ReducerTypes.ADDING_ARTIST_UPDATE:
      return { ...state, addingArtist: action.payload }

    case ReducerTypes.ARTIST_DELETE_WITH_ID:
      return { ...state, artists: state.artists.filter(artist => artist.id !== action.payload) };

    case ReducerTypes.ARTISTS_SIGN_OUT:
      return initialState;

    case ReducerTypes.ADDING_ARTIST_NAME:
      return { ...state, addingArtist: { ...state.addingArtist, name: action.payload } }

    case ReducerTypes.ADDING_ARTIST_FUGA_ID:
      return { ...state, addingArtist: { ...state.addingArtist, fugaId: action.payload } }

    case ReducerTypes.ADDING_ARTIST_EMAIL:
      return { ...state, addingArtist: { ...state.addingArtist, ownerEmail: action.payload } }

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