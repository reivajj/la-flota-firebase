import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';
import { createAlbumModel } from 'services/CreateModels';

export const createAlbumRedux = (album, userId) => {
  return async dispatch => {
    let formDataAlbum = createAlbumModel(album);

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
