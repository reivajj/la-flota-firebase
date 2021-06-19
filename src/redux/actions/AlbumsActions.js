import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';


export const createAlbumRedux = (album, userId) => {
  return async dispatch => {
    let formDataAlbum = new FormData();
    formDataAlbum.append("name", album.nombre);

    album.id = uuidv4();

    let albumFromThirdWebApi = await BackendCommunication.createAlbumDashGo(formDataAlbum);
    album.dashGoId = albumFromThirdWebApi.data.response.id;

    await FirestoreServices.createAlbum(album, userId);

    return dispatch({
      type: ReducerTypes.ADD_ALBUMS,
      payload: [ album ]
    });
  }
}
