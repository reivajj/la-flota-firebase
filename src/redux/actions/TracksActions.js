import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';
import { createTrackModel } from 'services/CreateModels';
import { to } from '../../utils';

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


const createTrackInAlbumFugaAndFireStore = async (dataTrack, onUploadProgress, dispatch) => {
  console.log("entro al create track:", dataTrack);
  let formDataTrack = createTrackModel(dataTrack);

  let trackFromThirdWebApi = await BackendCommunication.createTrackFuga(formDataTrack, onUploadProgress, dispatch);
  if (trackFromThirdWebApi === "ERROR") return "ERROR";

  dataTrack.whenCreatedTS = new Date().getTime();
  dataTrack.lastUpdateTS = dataTrack.whenCreatedTS;
  dataTrack.fugaId = trackFromThirdWebApi.data.response.fugaTrackCreatedInfo.id;
  dataTrack.isrc = trackFromThirdWebApi.data.response.fugaTrackCreatedInfo.isrc;
  dataTrack.trackSizeBytes = dataTrack.track.size; dataTrack.trackType = dataTrack.track.type;
  delete dataTrack.track;

  await FirestoreServices.createTrack(dataTrack, dispatch).catch(error => { console.log("Error en Firestore: ", error) });

  return `Track de nombre: ${dataTrack.title} creado correctamente en posicion: ${dataTrack.position}`;
}

export const uploadAllTracksToAlbum = (tracksData, albumId, albumFugaId, userId) => async dispatch => {

  const uploadTracksOneByOne = tracksData.map(async dataTrack => {

    const onUploadProgress = progress => {
      const { loaded, total } = progress
      const percentageProgress = Math.floor((loaded / total) * 100)
      dispatch(setUploadProgress(dataTrack.position, percentageProgress))
    }

    dataTrack.albumId = albumId; dataTrack.albumFugaId = albumFugaId; dataTrack.ownerId = userId; dataTrack.id = uuidv4();
    return createTrackInAlbumFugaAndFireStore(dataTrack, onUploadProgress, dispatch).catch(error => {
      console.log("Error en Firestore o BE al crear tracks en album:", error);
      return "ERROR";
    });
  });

  let [errorCreatingAllTracksToAlbum, successCreatingAllTracksToAlbum] = await to(Promise.all(uploadTracksOneByOne));
  if (errorCreatingAllTracksToAlbum) {
    console.log("ERROR EN EL PROMISE ALL :", errorCreatingAllTracksToAlbum);
    return "ERROR";
  }

  console.log("Success creando los tracks en el album: ", successCreatingAllTracksToAlbum);
  console.log("Los tracks despues de agregar todo: ", tracksData);

  dispatch({
    type: ReducerTypes.EDIT_TRACK_POST_UPLOAD_IN_DB,
    payload: tracksData
  });

  return "SUCCESS";
}
