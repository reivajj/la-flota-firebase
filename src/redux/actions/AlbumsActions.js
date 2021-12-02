import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';
import { createAlbumModel } from 'services/CreateModels';

//Los errores los manejan las funciones a las que llamo.
export const createAlbumRedux = (album, userId) => async dispatch => {

  let formDataAlbum = createAlbumModel(album);

  album.id = uuidv4();
  album.ownerId = userId;

  let albumFromThirdWebApi = await BackendCommunication.createAlbumFuga(formDataAlbum)
  if (!albumFromThirdWebApi.data.response.result.success) console.error("Error al subir a fuga: ", albumFromThirdWebApi);

  console.log("El album en Actions: ", albumFromThirdWebApi);
  album.fugaId = albumFromThirdWebApi.data.response.albumId;
  delete album.cover;

  await FirestoreServices.createElementFS(album, userId, "albums", "totalAlbums", 1, dispatch);
  
  dispatch({
    type: ReducerTypes.ADD_ALBUMS,
    payload: [album]
  });

  return album;
}

