import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { createAlbumModel } from 'services/CreateModels';
import { writeCloudLog } from '../../services/LoggingService';
import { formatEquivalence, getFormatByCantOfTracks, getOurFormatByCantOfTracks } from 'utils/albums.utils';

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
  album.format = album.format || getOurFormatByCantOfTracks(cantTracks);

  writeCloudLog(`creating album ${album.title} y email: ${ownerEmail}, model to send fuga `, album, { notError: "not error" }, "info");

  let albumFromThirdWebApi = await BackendCommunication.createAlbumFuga(formDataAlbum, ownerEmail, dispatch)
  if (albumFromThirdWebApi === "ERROR") return "ERROR";

  album.fugaId = albumFromThirdWebApi.data.response.albumId; album.state = "PENDING";
  album.whenCreatedTS = new Date().getTime();
  album.lastUpdateTS = album.whenCreatedTS;

  let albumToUploadToFS = { ...album, cover: { name: album.cover.name, size: album.cover.size } };

  writeCloudLog(`creating album ${albumToUploadToFS.title} y email: ${ownerEmail}, post fuga pre fs`, albumToUploadToFS, { notError: "not error" }, "info");

  await FirestoreServices.createElementFS(albumToUploadToFS, albumToUploadToFS.id, userId, "albums", "totalAlbums", 1, dispatch);

  dispatch({
    type: ReducerTypes.ADD_ALBUMS,
    payload: [album]
  });

  return album;
}

export const deleteAlbumRedux = albumData => async dispatch => {
  let deleteResponse = await BackendCommunication.deleteAlbumFuga(albumData.fugaId, dispatch);
  if (deleteResponse === "ERROR") return "ERROR";

  await FirestoreServices.deleteElementFS(albumData, albumData.id, albumData.ownerId, "albums", "totalAlbums", -1, dispatch);
  await FirestoreServices.deleteAllTracksFromAlbumIdFS(albumData.id, albumData.ownerId, dispatch);

  dispatch({
    type: ReducerTypes.ALBUMS_DELETE_BY_ID,
    payload: albumData.id
  });

  return "SUCCESS";
}


export const albumGetLiveLinkRedux = albumData => async dispatch => {
  let liveLinksResponse = await BackendCommunication.getAlbumLiveLinksById(albumData.fugaId, dispatch);
  if (liveLinksResponse === "ERROR") return "ERROR";
  if (liveLinksResponse.length > 0) {
    albumData.liveLink = liveLinksResponse;
    dispatch({
      type: ReducerTypes.ADD_ALBUMS,
      payload: [albumData]
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

  writeCloudLog(`created UPC to album ${dataAlbumFuga.title} y email: ${dataAlbumFuga.ownerEmail}`, { upc: dataAlbumFuga.upc }, { notError: "not error" }, "info");

  dispatch({
    type: ReducerTypes.ALBUMS_EDIT_BY_ID,
    payload: dataAlbumFuga
  });
}

export const getAlbumsByFieldRedux = (field, fieldValue) => async dispatch => {
  let albumsByField = await FirestoreServices.getElementsByField('albums', field, fieldValue, dispatch, 100);
  if (albumsByField === "EMPTY") return "EMPTY";
  if (Array.isArray(albumsByField) && albumsByField.length > 0) dispatch(albumsAddStore(albumsByField));
  else return "ERROR";
  return albumsByField;
}

// Asumo que el album cumple los requisitos para realizar el delivery.
export const albumsPublishAndDeliveryRedux = (albumData, dspsToDelivery) => async dispatch => {
  albumData.dsps = dspsToDelivery;
  let responsePublish = await BackendCommunication.publishAlbumFuga(albumData, dispatch);
  if (responsePublish === "ERROR") return "ERROR";
  albumData.state = "PUBLISHED";

  writeCloudLog(`Album ${albumData.title} PUBLISHED with email: ${albumData.ownerEmail}`, { state: albumData.state }, { notError: "not error" }, "info");

  let responseDelivery = await BackendCommunication.deliverAlbumFuga(albumData, dispatch);
  if (responseDelivery === "ERROR") return "ERROR";
  albumData.state = "DELIVERED";

  let resultUpdate = await FirestoreServices.updateElementFS(albumData, { state: albumData.state }, albumData.id, "albums", dispatch);

  writeCloudLog(`Album ${albumData.title} DELIVERED with email: ${albumData.ownerEmail}`, { state: albumData.state }, { notError: "not error" }, "info");

  dispatch({
    type: ReducerTypes.ALBUMS_EDIT_BY_ID,
    payload: albumData
  });

  return "DELIVERED";
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
