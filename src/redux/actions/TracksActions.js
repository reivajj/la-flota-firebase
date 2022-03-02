import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { v4 as uuidv4 } from 'uuid';
import { createTrackModel } from 'services/CreateModels';
import { copyFormDataToJSON, toWithOutError } from 'utils';
import { getAmountOfIsrcCodesToUseFS } from '../../services/FirestoreServices';
import { writeCloudLog } from '../../services/LoggingService';

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
  writeCloudLog(`creating track pre model, with album fugaId: ${dataTrack.albumFugaId} and ownerEmail: ${dataTrack.ownerEmail}`, dataTrack, { notError: "not error" }, "info");

  let formDataTrack = createTrackModel(dataTrack, artistInvited, artistRecentlyCreated);

  writeCloudLog(`creating track to send to fuga with album fugaId: ${dataTrack.albumFugaId} and ownerEmail: ${dataTrack.ownerEmail}`
    , copyFormDataToJSON(formDataTrack), { notError: "not error" }, "info");

  let trackFromThirdWebApi = await BackendCommunication.createTrackFuga(formDataTrack, onUploadProgress, dataTrack.albumFugaId, dispatch);
  if (trackFromThirdWebApi === "ERROR") return "ERROR";

  dataTrack.whenCreatedTS = new Date().getTime();
  dataTrack.lastUpdateTS = dataTrack.whenCreatedTS;
  dataTrack.fugaId = trackFromThirdWebApi.data.response.fugaTrackCreatedInfo.id;
  dataTrack.isrc = trackFromThirdWebApi.data.response.fugaTrackCreatedInfo.isrc;
  dataTrack.trackSizeBytes = dataTrack.track.size; dataTrack.trackType = dataTrack.track.type;
  delete dataTrack.track;

  writeCloudLog(`creating track post fuga pre fs, with album fugaId: ${dataTrack.albumFugaId} and ownerEmail: ${dataTrack.ownerEmail}`
    , dataTrack, { notError: "not error" }, "info");

  await FirestoreServices.createElementFS(dataTrack, dataTrack.id, userId, "tracks", "totalTracks", 1, dispatch);

  return dataTrack;
}

export const uploadAllTracksToAlbumRedux = (tracksData, albumId, albumFugaId, userId, ownerEmail, artistInvited, artistRecentlyCreated) => async dispatch => {
  if (tracksData.length === 0) return "ERROR";

  writeCloudLog(`creating all tracks pre model with album fugaId: ${albumFugaId} and ownerEmail: ${ownerEmail}`
    , tracksData, { notError: "not error" }, "info");

  let amountOfIsrcsCodesMissing = 0;
  tracksData.forEach(track => { if (track.isrc === "") amountOfIsrcsCodesMissing++; });
  let isrcsCodes = await toWithOutError(getAmountOfIsrcCodesToUseFS(amountOfIsrcsCodesMissing, dispatch));

  tracksData.map((track, index) => {
    if (track.isrc === "") track.isrc = isrcsCodes[index];
    return track;
  });

  let sortedTracks = tracksData.sort((tA, tB) => {
    if (tA.position < tB.position) return -1;
    else return 1;
  });

  for (const dataTrack of sortedTracks) {
    const results = [];
    const onUploadProgress = progress => {
      const { loaded, total } = progress
      const percentageProgress = Math.floor((loaded / total) * 100)
      dispatch(setUploadProgress(dataTrack.position, percentageProgress))
    }

    dataTrack.albumId = albumId; dataTrack.albumFugaId = albumFugaId; dataTrack.ownerId = userId; dataTrack.ownerEmail = ownerEmail;
    let result = await toWithOutError(dispatch(createTrackInAlbumRedux(dataTrack, userId, onUploadProgress, artistInvited, artistRecentlyCreated)))
    if (result === "ERROR") return "ERROR";

    let attachTrackToAlbumResponse = await BackendCommunication.attachTrackToAlbumFuga(dataTrack, dispatch);
    if (attachTrackToAlbumResponse === "ERROR") return "ERROR";

    console.log("Cree track: ", dataTrack, "CON RESULT: ", result);
    console.log("ATTACH TRAK OK: ", attachTrackToAlbumResponse);
    results.push(result);
  }

  // let attachingTracksToAlbumResponse = await BackendCommunication.attachingTracksToAlbumFuga(tracksData, dispatch);
  // if (attachingTracksToAlbumResponse === "ERROR") return "ERROR";

  dispatch({
    type: ReducerTypes.EDIT_TRACK_POST_UPLOAD_IN_DB,
    payload: sortedTracks
  });

  return tracksData;
}

