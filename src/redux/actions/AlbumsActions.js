import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { createAlbumModel } from 'services/CreateModels';
import { writeCloudLog } from '../../services/LoggingService';

export const albumsAddStore = albums => {
  return {
    type: ReducerTypes.ADD_ALBUMS,
    payload: albums
  }
}

//Los errores los manejan las funciones a las que llamo.
export const createAlbumRedux = (album, userId, ownerEmail, explicit, cantTracks, artistsInvitedStore) => async dispatch => {

  let formDataAlbum = createAlbumModel(album, explicit, cantTracks, artistsInvitedStore);
  album.ownerId = userId;
  album.ownerEmail = ownerEmail;

  writeCloudLog(`creating album ${album.title} y email: ${ownerEmail}, model to send fuga `, album, { notError: "not error" }, "info");

  let albumFromThirdWebApi = await BackendCommunication.createAlbumFuga(formDataAlbum, ownerEmail, dispatch)
  if (albumFromThirdWebApi === "ERROR") return "ERROR";

  album.fugaId = albumFromThirdWebApi.data.response.albumId; album.state = "PENDING";
  album.whenCreatedTS = new Date().getTime();
  album.lastUpdateTS = album.whenCreatedTS;

  let albumToUploadToFS = { ...album, cover: "" };

  writeCloudLog(`creating album ${albumToUploadToFS.title} y email: ${ownerEmail}, post fuga pre fs`, albumToUploadToFS, { notError: "not error" }, "info");

  await FirestoreServices.createElementFS(albumToUploadToFS, albumToUploadToFS.id, userId, "albums", "totalAlbums", 1, dispatch);

  dispatch({
    type: ReducerTypes.ADD_ALBUMS,
    payload: [albumToUploadToFS]
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


export const albumGetLiveLinkRedux = dataAlbum => async dispatch => {
  let liveLinksResponse = await BackendCommunication.getAlbumLiveLinksById(dataAlbum.fugaId, dispatch);
  if (liveLinksResponse === "ERROR") return "ERROR";
  console.log("LIVE LINK IN ACTIONS: ", liveLinksResponse);
  if (liveLinksResponse.length > 0) {
    dataAlbum.liveLink = liveLinksResponse;
    dispatch({
      type: ReducerTypes.ADD_ALBUMS,
      payload: [dataAlbum]
    });
  }

  return liveLinksResponse;
}

export const createUPCToSuccessAlbumRedux = dataAlbumFuga => async dispatch => {
  if (dataAlbumFuga.upc) return "ALREADY_HAS_UPC";
  let responseUPC = await BackendCommunication.createUPCToSuccessAlbumFuga(dataAlbumFuga.fugaId, dataAlbumFuga.ownerEmail, dispatch);
  if (responseUPC === "ERROR") return "ERROR";

  dataAlbumFuga.upc = responseUPC;

  await FirestoreServices.updateElementFS(dataAlbumFuga, { upc: responseUPC }, dataAlbumFuga.id, "albums", dispatch);

  dispatch({
    type: ReducerTypes.ALBUMS_EDIT_BY_ID,
    payload: dataAlbumFuga
  });
}

export const getAlbumsByFieldRedux = (field, fieldValue) => async dispatch => {
  let albumsByField = await FirestoreServices.getElementsByField('albums', field, fieldValue, dispatch, 20);
  if (albumsByField === "EMPTY") return "EMPTY";
  if (Array.isArray(albumsByField) && albumsByField.length > 0) dispatch(albumsAddStore(albumsByField));
  else return "ERROR";
  return albumsByField;
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
