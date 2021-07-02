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
  trackData.provisionalId = uuidv4();
  trackData.ownerId = userId;
  return {
    type: ReducerTypes.ADD_TRACKS,
    payload: [trackData]
  };
}


const createTrackInAlbumDashGoAndFireStore = async dataTrack => {
  console.log("entro al create track:", dataTrack);
  let formDataTrack = createTrackModel(dataTrack);
  let trackFromThirdWebApi = await BackendCommunication.createTrackDashGo(formDataTrack);
  dataTrack.dashGoId = trackFromThirdWebApi.data.response.id;

  await FirestoreServices.createTrack(dataTrack).catch(error => { console.log("Error en Firestore: ", error) });

  return `Track de nombre: ${dataTrack.title} creado correctamente en posicion: ${dataTrack.position}`;
}

export const uploadAllTracksToAlbum = (tracksData, albumId, albumDashGoId, userId) => {
  return async () => {
    const uploadTracksOneByOne = tracksData.map(async (dataTrack) => {
      dataTrack.albumId = albumId; dataTrack.albumDashGoId = albumDashGoId; dataTrack.ownerId = userId; dataTrack.id = uuidv4();
      return createTrackInAlbumDashGoAndFireStore(dataTrack).catch(error => { console.log("Error en Firestore al crear tracks en album:", error) });
    });

    let [errorCreatingAllTracksToAlbum, successCreatingAllTracksToAlbum] = await to(Promise.all(uploadTracksOneByOne));
    if (errorCreatingAllTracksToAlbum) console.log("Error en el Promise All, crenado todos los tracks en el album: ", errorCreatingAllTracksToAlbum);
    console.log("Success creando los tracks en el album: ", successCreatingAllTracksToAlbum);

    return {
      type: ReducerTypes.ADD_TRACKS,
      payload: tracksData
    };
  }
}
