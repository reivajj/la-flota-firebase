import * as ReducerTypes from 'redux/actions/Types';
import { checkboxGroupInfo } from 'utils/albums.utils';
import { getActualYear } from 'utils/timeRelated.utils';

const filterArtistsWithSameIdThanNewOne = (oldAlbums, addedAlbums) => {
  if (!addedAlbums) return oldAlbums;
  return oldAlbums.filter(oldAlbum => !addedAlbums.map(addedAlbum => addedAlbum.id).includes(oldAlbum.id))
}
const editOtherArtistName = ({ nameValue, otherArtistIndex }, allOtherArtistOld) => {
  allOtherArtistOld[otherArtistIndex].name = nameValue;
  return allOtherArtistOld;
}

const editOtherArtistIdentifier = ({ identifierValue, identifierField, otherArtistIndex }, allOtherArtistOld) => {
  allOtherArtistOld[otherArtistIndex][`${identifierField}`] = identifierValue;
  return allOtherArtistOld;
}

const editOtherArtistPrimary = ({ isPrimary, otherArtistIndex }, allOtherArtistOld) => {
  allOtherArtistOld[otherArtistIndex].primary = isPrimary;
  return allOtherArtistOld;
}

const initialState = {
  albums: [],
  addingAlbum: {
    dsps: checkboxGroupInfo, nombreArtist: "", imagenUrl: "", label_name: "", title: "", id: "", preview: false, upc: "", albumCreated: false,
    p_year: getActualYear(), p_line: "", c_year: getActualYear(), c_line: "", dayOfMonth: "", cover: "",
    month: "", year: "", genre: "", genreName: "", subgenre: "", subgenreName: "", languageId: "ES", languageName: "Spanish", disc_number: "", allOtherArtists: [],
    artistFugaId: "", artistId: "", preOrder: false, preOrderDate: "", version: "", format: "", basicFieldsComplete: false,
    preOrderDayOfMonth: "", preOrderMonth: "", preOrderYear: "", oldRelease: false, originalYear: "", originalMonth: "", originalDayOfMonth: "", appleAdapted: false
  }
}


const AlbumsReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.ADD_ALBUMS:
      const oldUniqueAlbums = filterArtistsWithSameIdThanNewOne(state.albums, action.payload)
      return { ...state, albums: [...oldUniqueAlbums, ...action.payload] };

    case ReducerTypes.ALBUMS_EDIT_BY_ID:
      return { ...state, albums: [...state.albums.filter(album => album.id !== action.payload.id), action.payload] }

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