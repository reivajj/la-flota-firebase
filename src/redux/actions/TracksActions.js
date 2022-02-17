import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';
import { createTrackModel } from 'services/CreateModels';
import { toWithOutError } from 'utils';
import { getAmountOfIsrcCodesToUseFS } from '../../services/FirestoreServices';

export const createTrackLocalRedux = (trackData, userId) => {
  trackData.ownerId = userId;
  trackData.id = trackData.id || uuidv4();
  return {
    type: ReducerTypes.ADD_UPLOADING_TRACKS,
    payload: trackData
  };
}

export const tracksCleanUploadingTracks = () => {
  return {
    type: ReducerTypes.TRACKS_UPLOADING_CLEAN
  }
}

export const deleteTrackInTracksUploading = trackId => {
  return {
    type: ReducerTypes.TRACK_UPLOADING_DELETE,
    payload: trackId
  }
}

const setUploadProgress = (position, percentageProgress) => {
  return {
    type: ReducerTypes.SET_TRACK_UPLOAD_PROGRESS,
    payload: { position, percentageProgress }
  }
}

const createTrackInAlbumRedux = (dataTrack, userId, onUploadProgress, artistInvited, artistRecentlyCreated) => async dispatch => {
  let formDataTrack = createTrackModel(dataTrack, artistInvited, artistRecentlyCreated);

  let trackFromThirdWebApi = await BackendCommunication.createTrackFuga(formDataTrack, onUploadProgress, dispatch);
  if (trackFromThirdWebApi === "ERROR") return "ERROR";

  dataTrack.whenCreatedTS = new Date().getTime();
  dataTrack.lastUpdateTS = dataTrack.whenCreatedTS;
  dataTrack.fugaId = trackFromThirdWebApi.data.response.fugaTrackCreatedInfo.id;
  dataTrack.isrc = trackFromThirdWebApi.data.response.fugaTrackCreatedInfo.isrc;
  dataTrack.trackSizeBytes = dataTrack.track.size; dataTrack.trackType = dataTrack.track.type;
  delete dataTrack.track;

  await FirestoreServices.createElementFS(dataTrack, dataTrack.id, userId, "tracks", "totalTracks", 1, dispatch);

  return dataTrack;
}

export const uploadAllTracksToAlbumRedux = (tracksData, albumId, albumFugaId, userId, artistInvited, artistRecentlyCreated) => async dispatch => {

  let amountOfIsrcsCodesMissing = 0;
  tracksData.forEach(track => { if (track.isrc === "") amountOfIsrcsCodesMissing++; });
  let isrcsCodes = await toWithOutError(getAmountOfIsrcCodesToUseFS(amountOfIsrcsCodesMissing, dispatch));

  tracksData.map((track, index) => {
    if (track.isrc === "") track.isrc = isrcsCodes[index];
    return track;
  });

  const uploadTracksOneByOne = tracksData.map(async dataTrack => {

    const onUploadProgress = progress => {
      const { loaded, total } = progress
      const percentageProgress = Math.floor((loaded / total) * 100)
      dispatch(setUploadProgress(dataTrack.position, percentageProgress))
    }

    dataTrack.albumId = albumId; dataTrack.albumFugaId = albumFugaId; dataTrack.ownerId = userId;
    let result = await toWithOutError(dispatch(createTrackInAlbumRedux(dataTrack, userId, onUploadProgress, artistInvited, artistRecentlyCreated)))
    if (result === "ERROR") return "ERROR";

    return result;
  });

  let responseCreatingAllTracksToAlbum = await toWithOutError(Promise.all(uploadTracksOneByOne));
  if (responseCreatingAllTracksToAlbum === "ERROR" || responseCreatingAllTracksToAlbum.includes("ERROR")) return "ERROR";

  let attachingTracksToAlbumResponse = await BackendCommunication.attachingTracksToAlbumFuga(tracksData, tracksData[0].albumFugaId, dispatch);
  if (attachingTracksToAlbumResponse === "ERROR") return "ERROR";

  let rearrengePositionsResponse = await BackendCommunication.rearrengePositionsFuga(tracksData, tracksData[0].albumFugaId, dispatch);
  if (rearrengePositionsResponse === "ERROR") return "ERROR";

  dispatch({
    type: ReducerTypes.EDIT_TRACK_POST_UPLOAD_IN_DB,
    payload: tracksData
  });

  return tracksData;
}

