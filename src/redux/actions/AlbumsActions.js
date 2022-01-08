import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { createAlbumModel } from 'services/CreateModels';

//Los errores los manejan las funciones a las que llamo.
export const createAlbumRedux = (album, userId) => async dispatch => {

  let formDataAlbum = createAlbumModel(album);
  album.ownerId = userId;
  let albumFromThirdWebApi = await BackendCommunication.createAlbumFuga(formDataAlbum, dispatch)
  if (albumFromThirdWebApi === "ERROR") return "ERROR";

  album.fugaId = albumFromThirdWebApi.data.response.albumId;
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

export const updateAddingAlbumRedux = newAddingAlbum => {
  return {
    type: ReducerTypes.ALBUMS_UPDATE_ADDING_ALBUM,
    payload: newAddingAlbum
  }
}