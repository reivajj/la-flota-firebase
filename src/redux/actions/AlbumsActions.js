import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { createAlbumModel } from 'services/CreateModels';

export const albumsAddStore = albums => {
  return {
    type: ReducerTypes.ADD_ALBUMS,
    payload: albums
  }
}

//Los errores los manejan las funciones a las que llamo.
export const createAlbumRedux = (album, userId, explicit) => async dispatch => {

  let formDataAlbum = createAlbumModel(album, explicit);
  album.ownerId = userId;
  let albumFromThirdWebApi = await BackendCommunication.createAlbumFuga(formDataAlbum, dispatch)
  if (albumFromThirdWebApi === "ERROR") return "ERROR";

  album.fugaId = albumFromThirdWebApi.data.response.albumId;
  if (!album.upc) album.upc = albumFromThirdWebApi.data.response.upc;
  album.whenCreatedTS = new Date().getTime();
  album.lastUpdateTS = album.whenCreatedTS;
  delete album.cover;

  await FirestoreServices.createElementFS(album, album.id, userId, "albums", "totalAlbums", 1, dispatch);

  dispatch({
    type: ReducerTypes.ADD_ALBUMS,
    payload: [album]
  });

  return album;
}

export const deleteAlbumRedux = dataAlbum => async dispatch => {
  let deleteResponse = await BackendCommunication.deleteAlbumFuga(dataAlbum.fugaId, dispatch);
  if (deleteResponse === "ERROR") return "ERROR";

  await FirestoreServices.deleteElementFS(dataAlbum, dataAlbum.id, dataAlbum.ownerId, "albums", "totalAlbums", -1, dispatch);
  await FirestoreServices.deleteAllTracksFromAlbumIdFS(dataAlbum.id, dataAlbum.ownerId, dispatch);

  dispatch({
    type: ReducerTypes.ALBUMS_DELETE_BY_ID,
    payload: dataAlbum.id
  });

  return "SUCCESS";
}

export const albumCleanUpdatingAlbum = () => {
  return {
    type: ReducerTypes.ALBUMS_CLEAN_ADDING_ALBUM,
  }
}

export const updateAddingAlbumRedux = newAddingAlbum => {
  return {
    type: ReducerTypes.ALBUMS_UPDATE_ADDING_ALBUM,
    payload: newAddingAlbum
  }
}

export const updateAddingAlbumImageUrlAndCoverRedux = ({ imagenUrl, cover }) => {
  return {
    type: ReducerTypes.ALBUMS_UPDATE_ADDING_ALBUM_IMAGEN_URL_AND_FILE,
    payload: { imagenUrl, cover }
  }
}

export const updateNameOtherArtistsAlbumRedux = (nameValue, otherArtistIndex) => {
  return {
    type: ReducerTypes.ALBUMS_UPDATE_OTHER_ARTIST_NAME,
    payload: { nameValue, otherArtistIndex }
  }
}

export const updatePrimaryOtherArtistsAlbumRedux = (isPrimary, otherArtistIndex) => {
  return {
    type: ReducerTypes.ALBUMS_UPDATE_OTHER_ARTIST_PRIMARY,
    payload: { isPrimary, otherArtistIndex }
  }
}

export const updateIdentifierOtherArtistsAlbumRedux = (identifierValue, identifierField, otherArtistIndex) => {
  return {
    type: ReducerTypes.ALBUMS_UPDATE_OTHER_ARTIST_IDENTIFIER,
    payload: { identifierValue, identifierField, otherArtistIndex }
  }
}
