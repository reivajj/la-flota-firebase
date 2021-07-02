import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';
import { createAlbumModel } from 'services/CreateModels';

//Los errores los manejan las funciones a las que llamo.
export const createAlbumRedux = (album, userId) => {
  return async dispatch => {
    let formDataAlbum = createAlbumModel(album);

    album.id = uuidv4();
    album.ownerId = userId;

    let albumFromThirdWebApi = await BackendCommunication.createAlbumDashGo(formDataAlbum)
      .catch(error => { throw new Error("Error al subir a DG: ", error) });
    album.dashGoId = albumFromThirdWebApi.data.response.id;
    delete album.cover;

    await FirestoreServices.createAlbum(album, userId);

    dispatch({
      type: ReducerTypes.ADD_ALBUMS,
      payload: [album]
    });

    return album;
  }
}
