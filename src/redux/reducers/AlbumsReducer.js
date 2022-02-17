import * as ReducerTypes from 'redux/actions/Types';
import { getActualYear } from 'utils/timeRelated.utils';

const checkNewAlbums = (oldAlbums, albums) => {
  return albums.filter(album => !oldAlbums.map(oldAlbum => oldAlbum.id).includes(album.id))
}

const editOtherArtistName = ({ nameValue, otherArtistIndex }, allOtherArtistOld) => {
  allOtherArtistOld[otherArtistIndex].name = nameValue;
  return allOtherArtistOld;
}

const editOtherArtistIdentifier = ({ identifierValue, identifierField, otherArtistIndex }, allOtherArtistOld) => {
  console.log("action paylaod que recibo: ", { identifierValue, identifierField, otherArtistIndex });
  allOtherArtistOld[otherArtistIndex][`${identifierField}`] = identifierValue;
  console.log("ALL OTHER ARTISTS: ", allOtherArtistOld);
  return allOtherArtistOld;
}

const editOtherArtistPrimary = ({ isPrimary, otherArtistIndex }, allOtherArtistOld) => {
  allOtherArtistOld[otherArtistIndex].primary = isPrimary;
  return allOtherArtistOld;
}

const initialState = {
  albums: [],
  addingAlbum: {
    nombreArtist: "", imagenUrl: "", label_name: "", title: "", id: "", preview: false, upc: "", albumCreated: false,
    p_year: getActualYear(), p_line: "", c_year: getActualYear(), c_line: "", dayOfMonth: "", cover: "",
    month: "", year: "", genre: "", genreName: "", subgenre: "", subgenreName: "", languageId: "ES", languageName: "Spanish", disc_number: "", allOtherArtists: [],
    artistFugaId: "", artistId: "", preOrder: false, preOrderDate: "", version: "", format: "", basicFieldsComplete: false,
    preOrderDayOfMonth: "", preOrderMonth: "", preOrderYear: "", oldRelease: false, originalYear: "", originalMonth: "", originalDayOfMonth: "",
  }
}


const AlbumsReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.ADD_ALBUMS:
      const newAlbums = checkNewAlbums(state.albums, action.payload)
      return { ...state, albums: [...state.albums, ...newAlbums] };

    case ReducerTypes.ALBUMS_UPDATE_ADDING_ALBUM:
      return { ...state, addingAlbum: action.payload }

    case ReducerTypes.ALBUMS_CLEAN_ADDING_ALBUM: 
      return { ...state, addingAlbum: initialState.addingAlbum };  
    
    case ReducerTypes.ALBUMS_DELETE_BY_ID: 
      return { ...state, albums: state.albums.filter(album => album.id !== action.payload) };

    case ReducerTypes.ALBUMS_UPDATE_ADDING_ALBUM_IMAGEN_URL_AND_FILE:
      return { ...state, addingAlbum: { ...state.addingAlbum, imagenUrl: action.payload.imagenUrl, cover: action.payload.cover } };

    case ReducerTypes.ALBUMS_UPDATE_OTHER_ARTIST_NAME:
      const newAllOtherArtists = editOtherArtistName(action.payload, state.addingAlbum.allOtherArtists);
      return { ...state, addingAlbum: { ...state.addingAlbum, allOtherArtists: newAllOtherArtists } };

    case ReducerTypes.ALBUMS_UPDATE_OTHER_ARTIST_IDENTIFIER:
      const newAllOtherArtistsSpotify = editOtherArtistIdentifier(action.payload, state.addingAlbum.allOtherArtists);
      return { ...state, addingAlbum: { ...state.addingAlbum, allOtherArtists: newAllOtherArtistsSpotify } };

    case ReducerTypes.ALBUMS_UPDATE_OTHER_ARTIST_PRIMARY:
      const newAllOtherArtistsPrimary = editOtherArtistPrimary(action.payload, state.addingAlbum.allOtherArtists);
      return { ...state, addingAlbum: { ...state.addingAlbum, allOtherArtists: newAllOtherArtistsPrimary } };


    case ReducerTypes.ALBUMS_SIGN_OUT:
      return initialState;

    default:
      return state;
  }
};

export default AlbumsReducer;