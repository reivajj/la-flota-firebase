import * as ReducerTypes from 'redux/actions/Types';

const checkNewAlbums = (oldAlbums, albums) => {
  return albums.filter(album => !oldAlbums.map(oldAlbum => oldAlbum.id).includes(album.id))
}

const editOtherArtistName = ({ nameValue, otherArtistIndex }, allOtherArtistOld) => {
  allOtherArtistOld[otherArtistIndex].name = nameValue;
  return allOtherArtistOld;
}

const editOtherArtistSpotifyUri = ({ spotifyUri, otherArtistIndex }, allOtherArtistOld) => {
  allOtherArtistOld[otherArtistIndex].spotify_uri = spotifyUri;
  return allOtherArtistOld;
}

const editOtherArtistPrimary = ({ isPrimary, otherArtistIndex }, allOtherArtistOld) => {
  allOtherArtistOld[otherArtistIndex].primary = isPrimary;
  return allOtherArtistOld;
}

const initialState = {
  albums: [],
  addingAlbum: {
    nombreArtist: "", imagenUrl: "", label_name: "", title: "", id: "", preview: false,
    p_year: 2021, p_line: "", c_year: 2021, c_line: "", dayOfMonth: "", cover: "",
    month: "", year: "", genre: "", languageId: "ES", languageName: "Spanish", disc_number: "", allOtherArtists: [],
    artistFugaId: "", artistId: "", preOrder: false, preOrderDate: "",
    preOrderDayOfMonth: "", preOrderMonth: "", preOrderYear: "",
  }
}


const AlbumsReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.ADD_ALBUMS:
      const newAlbums = checkNewAlbums(state.albums, action.payload)
      return { addingAlbum: initialState.addingAlbum, albums: [...state.albums, ...newAlbums] }

    case ReducerTypes.ALBUMS_UPDATE_ADDING_ALBUM:
      return { ...state, addingAlbum: action.payload }

    case ReducerTypes.ALBUMS_UPDATE_ADDING_ALBUM_IMAGEN_URL_AND_FILE:
      return { ...state, addingAlbum: { ...state.addingAlbum, imagenUrl: action.payload.imagenUrl, cover: action.payload.cover } }

    case ReducerTypes.ALBUMS_UPDATE_OTHER_ARTIST_NAME:
      const newAllOtherArtists = editOtherArtistName(action.payload, state.addingAlbum.allOtherArtists)
      return { ...state, addingAlbum: { ...state.addingAlbum, allOtherArtists: newAllOtherArtists } }

    case ReducerTypes.ALBUMS_UPDATE_OTHER_ARTIST_SPOTIFY_URI:
      const newAllOtherArtistsSpotify = editOtherArtistSpotifyUri(action.payload, state.addingAlbum.allOtherArtists)
      return { ...state, addingAlbum: { ...state.addingAlbum, allOtherArtists: newAllOtherArtistsSpotify } }

    case ReducerTypes.ALBUMS_UPDATE_OTHER_ARTIST_PRIMARY:
      const newAllOtherArtistsPrimary = editOtherArtistPrimary(action.payload, state.addingAlbum.allOtherArtists)
      return { ...state, addingAlbum: { ...state.addingAlbum, allOtherArtists: newAllOtherArtistsPrimary } }


    case ReducerTypes.ALBUMS_SIGN_OUT:
      return initialState;

    default:
      return state;
  }
};

export default AlbumsReducer;