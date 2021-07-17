import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';
import { createTrackModel } from 'services/CreateModels';

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

export const createTrackLocalRedux = (trackData, userId) => {
  trackData.ownerId = userId;
  return {
    type: ReducerTypes.ADD_UPLOADING_TRACKS,
    payload: [trackData]
  };
}

const setUploadProgress = (position, percentageProgress) => {
  return {
    type: ReducerTypes.SET_TRACK_UPLOAD_PROGRESS,
    payload: { position, percentageProgress }
  }
}


const createTrackInAlbumDashGoAndFireStore = async (dataTrack, onUploadProgress) => {
  console.log("entro al create track:", dataTrack);
  let formDataTrack = createTrackModel(dataTrack);
  let trackFromThirdWebApi = await BackendCommunication.createTrackDashGo(formDataTrack, onUploadProgress);
  dataTrack.dashGoId = trackFromThirdWebApi.data.response.id;
  dataTrack.isrc = dataTrack.isrc || trackFromThirdWebApi.data.response.isrc;
  dataTrack.trackSizeBytes = dataTrack.track.size; dataTrack.trackType = dataTrack.track.type;
  delete dataTrack.track;

  await FirestoreServices.createTrack(dataTrack).catch(error => { console.log("Error en Firestore: ", error) });

  return `Track de nombre: ${dataTrack.title} creado correctamente en posicion: ${dataTrack.position}`;
}

export const uploadAllTracksToAlbum = (tracksData, albumId, albumDashGoId, userId) => {
  return async (dispatch) => {
    const uploadTracksOneByOne = tracksData.map(async dataTrack => {

      const onUploadProgress = progress => {
        const { loaded, total } = progress
        const percentageProgress = Math.floor((loaded / total) * 100)
        dispatch(setUploadProgress(dataTrack.position, percentageProgress))
      }

      dataTrack.albumId = albumId; dataTrack.albumDashGoId = albumDashGoId; dataTrack.ownerId = userId; dataTrack.id = uuidv4();
      return createTrackInAlbumDashGoAndFireStore(dataTrack, onUploadProgress).catch(error => { console.log("Error en Firestore al crear tracks en album:", error) });
    });

    let [errorCreatingAllTracksToAlbum, successCreatingAllTracksToAlbum] = await to(Promise.all(uploadTracksOneByOne));
    if (errorCreatingAllTracksToAlbum) console.log("Error en el Promise All, crenado todos los tracks en el album: ", errorCreatingAllTracksToAlbum);
    console.log("Success creando los tracks en el album: ", successCreatingAllTracksToAlbum);

    console.log("Los tracks despues de agregar todo: ", tracksData);
    return dispatch({
      type: ReducerTypes.EDIT_TRACK_POST_UPLOAD_IN_DB,
      payload: tracksData
    });
  }
}

