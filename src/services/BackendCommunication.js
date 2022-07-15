import axios from 'axios';
import { copyFormDataToJSON, to } from '../utils';
import { createBackendError } from '../redux/actions/ErrorHandlerActions';
import { loginErrorStore } from 'redux/actions/AuthActions';
import { writeCloudLog } from './LoggingService';
import { logReleaseDeliveryAnalyticEvent } from './GoogleAnalytics';

export const webUrl = "https://dashboard2.laflota.com.ar/filemanagerapp/api/";
export const localUrl = "http://localhost:5000/filemanagerapp/api/";
export const targetUrl = webUrl;

// ======================================LABELS=============================================\\

export const createLabelFuga = async (labelName, dispatch) => {
  let [errorCreatingLabelInThirdWebApi, labelFromThirdWebApi] = await to(
    axios.post(`${targetUrl}labels`, { name: labelName }));

  if (errorCreatingLabelInThirdWebApi) {
    dispatch(createBackendError(errorCreatingLabelInThirdWebApi));
    writeCloudLog("Error creating label in fuga", labelName, errorCreatingLabelInThirdWebApi, "error");
    return "ERROR";
  }

  return labelFromThirdWebApi;
}

export const deleteLabelFuga = async (labelFugaId, dispatch) => {
  let [errorDeletingLabelInThirdWebApi] = await to(
    axios.delete(`${targetUrl}labels/${labelFugaId}`));

  if (errorDeletingLabelInThirdWebApi) {
    const errorCodeIfExist = errorDeletingLabelInThirdWebApi.response.data.properties.msgFromFuga.code;
    if (errorCodeIfExist === "NOT_AUTHORIZED" || errorCodeIfExist === "NOT_FOUND") return "NOT_AUTHORIZED";
    writeCloudLog("Error deleting label in fuga", labelFugaId, errorDeletingLabelInThirdWebApi, "error");
    dispatch(createBackendError(errorDeletingLabelInThirdWebApi));
    return "ERROR";
  }

  return "SUCCESS";
}


// ======================================ARTISTS=============================================\\

export const getArtistByIdFuga = async (fugaId, dispatch) => {
  let [errorGettingArtist, artistInFuga] = await to(axios.get(`${targetUrl}artists/${fugaId}`));
  if (errorGettingArtist) {
    dispatch(createBackendError(errorGettingArtist));
    writeCloudLog("Error getting artist in fuga", fugaId, errorGettingArtist, "error");
    return "ERROR";
  }
  return artistInFuga;
}

export const createArtistFuga = async (rawDataArtist, ownerEmail, dispatch) => {
  let [errorUploadingArtistInThirdWebApi, artistFromThirdWebApi] = await to(
    axios.post(`${targetUrl}artists/withIdentifiers`, rawDataArtist));

  if (errorUploadingArtistInThirdWebApi) {
    dispatch(createBackendError(errorUploadingArtistInThirdWebApi));
    writeCloudLog(`Error creating artist in fuga, ownerEmail: ${ownerEmail}`, rawDataArtist, errorUploadingArtistInThirdWebApi, "error");
    return "ERROR";
  }

  return artistFromThirdWebApi;
}

export const updateArtistFuga = async (rawDataArtist, artistFugaId, ownerEmail, dispatch) => {
  let [errorUpdatingArtistInThirdWebApi] = await to(
    axios.put(`${targetUrl}artists/${artistFugaId}`, rawDataArtist));

  if (errorUpdatingArtistInThirdWebApi) {
    dispatch(createBackendError(errorUpdatingArtistInThirdWebApi));
    writeCloudLog(`Error updating artist in fuga, ownerEmail: ${ownerEmail}`, rawDataArtist, errorUpdatingArtistInThirdWebApi, "error");
    return "ERROR";
  }

  return "SUCCESS";
}

export const getArtistsIdentifierByIdFuga = async (artistFugaId, dispatch) => {
  let [errorGettingArtistIdentfiers, artistsIdentifiers] = await to(axios.get(`${targetUrl}artists/${artistFugaId}/identifier`));
  if (errorGettingArtistIdentfiers) {
    dispatch(createBackendError(errorGettingArtistIdentfiers));
    writeCloudLog("Error getting artist identifiers", errorGettingArtistIdentfiers);
    return "ERROR";
  }
  return artistsIdentifiers.data.response;
}

export const updateArtistIdentifierFuga = async (identifierId, rawDataArtist, artistFugaId, ownerEmail, dispatch) => {
  let errorUpdatingArtistInThirdWebApi = ""; let resultIdentifier = "";
  let errorDeletingIdentifier = "";
  if (rawDataArtist.identifierValue === "") {
    [errorDeletingIdentifier] = await to(axios.delete(`${targetUrl}artists/${artistFugaId}/identifier/${identifierId}`));
    if (errorDeletingIdentifier) {
      dispatch(createBackendError(errorDeletingIdentifier));
      writeCloudLog(`Error deleting artist identifier in fuga, ownerEmail: ${ownerEmail}`, { identifierId, rawDataArtist, artistFugaId }, errorDeletingIdentifier, "error");
      return "ERROR";
    }
    [errorUpdatingArtistInThirdWebApi, resultIdentifier] = await to(
      axios.post(`${targetUrl}artists/${artistFugaId}/identifier`, rawDataArtist));
  }

  else[errorUpdatingArtistInThirdWebApi, resultIdentifier] = await to(
    axios.put(`${targetUrl}artists/${artistFugaId}/identifier`, rawDataArtist));

  if (errorUpdatingArtistInThirdWebApi) {
    dispatch(createBackendError(errorUpdatingArtistInThirdWebApi));
    writeCloudLog("Error updating artist in fuga", { identifierId, artistFugaId, rawDataArtist }, errorUpdatingArtistInThirdWebApi, "error");
    return "ERROR";
  }

  return resultIdentifier.data.response.id;
}


export const deleteArtistFuga = async (artistFugaId, dispatch) => {
  let [errorDeletingArtistInFuga] = await to(axios.delete(`${targetUrl}artists/${artistFugaId}`));

  if (errorDeletingArtistInFuga) {
    // const errorCodeIfExist = errorDeletingArtistInFuga.response.data.properties.msgFromFuga.code;
    // if (errorCodeIfExist === "NOT_AUTHORIZED" || errorCodeIfExist === "NOT_FOUND") return "NOT_AUTHORIZED";
    dispatch(createBackendError(errorDeletingArtistInFuga));
    writeCloudLog("Error deleting artist in fuga", artistFugaId, errorDeletingArtistInFuga, "error");
    return "ERROR";
  }
  return "SUCCESS";
}

export const getDgArtistsFuga = async (userEmail, dispatch) => {
  let [errorGettingDgArtists, dgArtists] = await to(axios.get(`${targetUrl}users/searchArtistsByEmail/${userEmail}`));
  if (errorGettingDgArtists) {
    dispatch(createBackendError(errorGettingDgArtists));
    writeCloudLog("Error getting dg artists", userEmail, errorGettingDgArtists, "error");
    return "ERROR";
  }

  if (dgArtists.data.response === "El usuario no tiene Artistas") return "NO_ARTISTS";
  if (dgArtists.data.response === "No existe el Email en La Flota") return "NO_USER";

  return dgArtists.data.response;
}

// ======================================ALBUMS=============================================\\

export const createAlbumFuga = async (formDataAlbum, ownerEmail, dispatch) => {
  let [errorUploadingAlbumInThirdWebApi, albumFromThirdWebApi] = await to(axios.post(`${targetUrl}albums`, formDataAlbum));
  if (errorUploadingAlbumInThirdWebApi) {
    dispatch(createBackendError(errorUploadingAlbumInThirdWebApi));
    writeCloudLog(`Error creating album in fuga, ownerEmail: ${ownerEmail}`,
      copyFormDataToJSON(formDataAlbum), errorUploadingAlbumInThirdWebApi, "error");
    return "ERROR";
  }

  return albumFromThirdWebApi;
}

export const editAlbumFuga = async (rawNewDataAlbum, albumFugaId, ownerEmail, dispatch) => {
  let [errorEditingAlbumInThirdWebApi, albumFromThirdWebApi] = await to(axios.put(`${targetUrl}albums/${albumFugaId}`, rawNewDataAlbum));
  if (errorEditingAlbumInThirdWebApi) {
    dispatch(createBackendError(errorEditingAlbumInThirdWebApi));
    writeCloudLog(`Error editing album in fuga, email from who edit: ${ownerEmail}`,
      rawNewDataAlbum, errorEditingAlbumInThirdWebApi, "error");
    return "ERROR";
  }
  return albumFromThirdWebApi;
}

export const uploadCoverFuga = async (albumFugaId, fugaFormDataCover, ownerEmail, dispatch) => {
  let [errorUploadingAlbumInThirdWebApi, albumFromThirdWebApi] = await to(axios.post(`${targetUrl}albums/uploadCover`, fugaFormDataCover));
  if (errorUploadingAlbumInThirdWebApi) {
    dispatch(createBackendError(errorUploadingAlbumInThirdWebApi));
    writeCloudLog(`Error uploading cover album with id: ${albumFugaId} in fuga, ownerEmail: ${ownerEmail}`,
      { data: "UPLOADING COVER" }, errorUploadingAlbumInThirdWebApi, "error");
    return "ERROR";
  }
  return albumFromThirdWebApi;
}

export const getAlbumLiveLinksById = async (albumId, dispatch) => {
  let [errorGettingLiveLinks, liveLinksResponse] = await to(axios.get(`${targetUrl}albums/${albumId}/live_links`));
  if (errorGettingLiveLinks) {
    dispatch(createBackendError(errorGettingLiveLinks));
    writeCloudLog("Error getting live links in fuga", albumId, errorGettingLiveLinks, "error");
    return "ERROR";
  }
  return liveLinksResponse.data.response.live_link;
}

export const deleteAlbumFuga = async (albumFugaId, dispatch) => {
  let [errorDeletingAlbumInFuga] = await to(axios.delete(`${targetUrl}albums/${albumFugaId}?delete_assets=true`));

  if (errorDeletingAlbumInFuga) {
    const errorCodeIfExist = errorDeletingAlbumInFuga.response.data.data.code;
    let statusText = errorDeletingAlbumInFuga.response.statusText;
    if (errorCodeIfExist === "NOT_AUTHORIZED" || statusText === "Not Found") return "NOT_FOUND";
    dispatch(createBackendError(errorDeletingAlbumInFuga));
    writeCloudLog("Error deleting album in fuga", albumFugaId, errorDeletingAlbumInFuga, "error");

    return "ERROR";
  }
  return "SUCCESS";
}

export const attachTrackToAlbumFuga = async (trackData, dispatch) => {
  const [errorAttachingTrack] = await to(axios.put(`${targetUrl}albums/${trackData.albumFugaId}/tracks/${trackData.fugaId}`));
  if (errorAttachingTrack) {
    dispatch(createBackendError(errorAttachingTrack));
    writeCloudLog(`Error attaching tracks to album in fuga, ownerEmail: ${trackData.ownerEmail}`
      , { trackData, albumId: trackData.albumFugaId }, errorAttachingTrack, "error");
    return "ERROR";
  }
  return "SUCCESS";
}

export const createUPCToSuccessAlbumFuga = async (albumFugaId, ownerEmail, dispatch) => {
  const [errorCreatingUPC, responseUPC] = await to(axios.post(`${targetUrl}albums/${albumFugaId}/barcode`));
  if (errorCreatingUPC) {
    dispatch(createBackendError(errorCreatingUPC));
    writeCloudLog(`Error creating UPC to album in fuga, ownerEmail: ${ownerEmail}`, albumFugaId, errorCreatingUPC, "error");
    return "ERROR";
  }
  return responseUPC.data.response;
}

export const publishAlbumFuga = async (albumData, dispatch) => {
  const [errorPublishingAlbum, responsePublishing] = await to(axios.post(`${targetUrl}albums/${albumData.fugaId}/publish`));
  console.log("ALBUM DATA IN PUBLISH FUGA: ", albumData);
  if (errorPublishingAlbum) {
    dispatch(createBackendError(errorPublishingAlbum));
    writeCloudLog(`Error publishing album with name: ${albumData.title} and UPC: ${albumData.upc}
    , in fuga, ownerEmail: ${albumData.ownerEmail}`, albumData, errorPublishingAlbum, "error");
    return "ERROR";
  }
  return responsePublishing.data.response;
}

export const deliverAlbumFuga = async (albumData, onlyToApple, dispatch) => {
  let dspsIds = [];
  // Solo hago el delivery a Apple
  if (onlyToApple) dspsIds = [{ dsp: 1330598 }];
  // No hago el delivery automatico a Apple Music.
  else albumData.dsps.forEach(dspInfo => dspInfo.dspName !== "Apple Music" && dspsIds.push({ dsp: dspInfo.dspId }));

  console.log("DSPS IN DELIVER FUGA: ", dspsIds);
  const [errorAddingDspsAlbum] = await to(axios.put(`${targetUrl}albums/${albumData.fugaId}/delivery_instructions/edit`, dspsIds));
  if (errorAddingDspsAlbum) {
    dispatch(createBackendError(errorAddingDspsAlbum));
    writeCloudLog(`Error adding DSPs of album with name: ${albumData.title} and UPC: ${albumData.upc}
    , in fuga, ownerEmail: ${albumData.ownerEmail}`, albumData, errorAddingDspsAlbum, "error");
    return "ERROR";
  }

  const [errorMakingDelivery] = await to(axios.post(`${targetUrl}albums/${albumData.fugaId}/delivery_instructions/deliver`, dspsIds));
  if (errorAddingDspsAlbum) {
    dispatch(createBackendError(errorMakingDelivery));
    writeCloudLog(`Error making delivery of album with name: ${albumData.title} and UPC: ${albumData.upc}
    , in fuga, ownerEmail: ${albumData.ownerEmail}`, albumData, errorMakingDelivery, "error");
    return "ERROR";
  }

  logReleaseDeliveryAnalyticEvent(albumData);
  return "SUCCESS";
}

export const redeliverAllAlbumFuga = async (albumData, dispatch) => {
  const [errorAddingDspsAlbum, result] = await to(axios.post(`${targetUrl}albums/${albumData.fugaId}/delivery_instructions/redeliver_all`));
  if (errorAddingDspsAlbum) {
    dispatch(createBackendError(errorAddingDspsAlbum));
    writeCloudLog(`Error REDELIVERING to all DSPs, album with name: ${albumData.title} and UPC: ${albumData.upc}
    , in fuga, ownerEmail: ${albumData.ownerEmail}`, albumData, errorAddingDspsAlbum, "error");
    return "ERROR";
  }
  console.log("RESULT REDELIVER: ", result);
}

// export const rearrengePositionsFuga = async (tracksData, dispatch) => {
//   let traksIdsAndPositions = [];
//   let albumId = tracksData.length > 0 ? tracksData[0].albumFugaId : "";
//   tracksData.forEach(trackData => traksIdsAndPositions.push({ trackId: trackData.fugaId, newPosition: trackData.position }));

//   let [errorRearrengingPositions, result] = await to(axios.put(`${targetUrl}albums/${albumId}/rearrenge`,
//     { rearrengeInstructions: traksIdsAndPositions }));
//   if (errorRearrengingPositions) {
//     dispatch(createBackendError(errorRearrengingPositions));
//     writeCloudLog("Error rearrenging album positions in fuga", { tracksData, albumId }, errorRearrengingPositions, "error");
//     return "ERROR";
//   }
//   return result;
// }

// ======================================TRACKS=============================================\\

// ESTA LLEGANDO EL FORMDATA TRACK VACIO.
export const createTrackFuga = async (formDataTrack, ownerEmail, onUploadProgress, albumFugaId, dispatch) => {
  let [errorUploadingTrackInThirdWebApi, trackFromThirdWebApi] = await to(axios.post(`${targetUrl}tracks/`, formDataTrack, { onUploadProgress }));
  if (errorUploadingTrackInThirdWebApi) {
    dispatch(createBackendError(errorUploadingTrackInThirdWebApi));
    writeCloudLog(`Error creating track in fuga with album fugaId ${albumFugaId}, ownerEmail: ${ownerEmail}`, copyFormDataToJSON(formDataTrack), errorUploadingTrackInThirdWebApi, "error");
    return "ERROR";
  }

  return trackFromThirdWebApi;
}

export const createTrackAssetFuga = async (formDataTrack, ownerEmail, albumFugaId, dispatch) => {
  let [errorUploadingTrackInThirdWebApi, trackFromThirdWebApi] = await to(axios.post(`${targetUrl}tracks/new`, formDataTrack));
  if (errorUploadingTrackInThirdWebApi) {
    dispatch(createBackendError(errorUploadingTrackInThirdWebApi));
    writeCloudLog(`Error creating track asset in fuga with album fugaId ${albumFugaId}, ownerEmail: ${ownerEmail}`, copyFormDataToJSON(formDataTrack), errorUploadingTrackInThirdWebApi, "error");
    return "ERROR";
  }
  return trackFromThirdWebApi;
}

export const uploadTrackFileFuga = async (formDataTrackFile, ownerEmail, onUploadProgress, albumFugaId, retry, dispatch) => {
  let [errorUploadingTrackInThirdWebApi, trackFromThirdWebApi] = await to(axios.post(`${targetUrl}tracks/audio_file`, formDataTrackFile, { onUploadProgress }));
  if (errorUploadingTrackInThirdWebApi) {
    dispatch(createBackendError(errorUploadingTrackInThirdWebApi));
    await writeCloudLog(`Error uploading track file (RETRY : ${retry}) in fuga with album fugaId ${albumFugaId}, ownerEmail: ${ownerEmail}`, copyFormDataToJSON(formDataTrackFile), errorUploadingTrackInThirdWebApi, "error");
    return "ERROR";
  }
  return trackFromThirdWebApi;
}

export const createPersonsFuga = async rawDataPeople => {
  let [errorUploadingPersonsInThirdWebApi, personsFromThirdWebApi] = await to(axios.post(`${targetUrl}people/addAll`, rawDataPeople));
  if (errorUploadingPersonsInThirdWebApi) {
    writeCloudLog("Error creating person in fuga", copyFormDataToJSON(rawDataPeople), errorUploadingPersonsInThirdWebApi, "error");
    return "ERROR";
  }
  let personsWithId = personsFromThirdWebApi.data.response;
  return personsWithId;
}

export const createCollaboratorFuga = async (collaborator, ownerEmail) => {
  if (!collaborator.person || collaborator.role.length === 0) {
    writeCloudLog(`Error creating collaborator in fuga, with email: ${ownerEmail}`, collaborator, "COLLABORATORS: EMPTY PERSON OR ROLES", "error");
    return "ERROR";
  }

  let rawDataCollaborator = { person: collaborator.person, role: collaborator.role };
  let [errorAttachingCollaboratorInThirdWebApi, collaboratorFromThirdWebApi] = await to(axios.post(`${targetUrl}tracks/${collaborator.trackFugaId}/contributors`, rawDataCollaborator));
  if (errorAttachingCollaboratorInThirdWebApi) {
    writeCloudLog(`Error creating collaborator in fuga, with email: ${ownerEmail}`, collaborator, errorAttachingCollaboratorInThirdWebApi, "error");
    return "ERROR";
  }
  let personsWithId = collaboratorFromThirdWebApi.data.response.id;
  return personsWithId;
}

// ======================================USERS=============================================\\

export const userExistInWpDB = async (email, dispatch) => {
  let [errorCheckingUser, checkingUserResponse] = await to(axios.get(`${targetUrl}users/searchByEmail/${email}`));
  if (errorCheckingUser) {
    dispatch(loginErrorStore({ error: errorCheckingUser, errorMsg: "No se pudo comprobar la existencia del Email. Intente nuevamente." }));
    writeCloudLog("Error checking user existance in WP", email, errorCheckingUser, "error");
    return "ERROR";
  }

  if (checkingUserResponse.data.response.exist === false) return false;
  if (checkingUserResponse.data.response.exist === true) return checkingUserResponse.data.response.user;
}

export const checkEmailAndPasswordInWpDB = async (email, password, dispatch) => {
  let userInWp = await userExistInWpDB(email);
  if (userInWp === "ERROR") return "ERROR";

  if (userInWp) {
    // const checkPasswordInWpDB = httpsCallable(functions, 'users-checkPasswordInWpDB');
    // const passwordHashInDB = userInWp.userPass;
    const [errorCheckingPassword, passwordOk] = await to(axios.post(`${targetUrl}users/login`, { email, password }));
    if (errorCheckingPassword) {
      dispatch(loginErrorStore({ error: errorCheckingPassword, errorMsg: "El email existe, pero la contraseña es incorrecta." }));
      writeCloudLog("Error login with password and email", { email, password }, errorCheckingPassword, "error");
      return "ERROR";
    }
    return { existEmail: true, passwordCheck: passwordOk.data.response, userInWp };
  }
  return { existEmail: false };
}

export const editUserDataAndCredentialsFS = async (newUserData, dispatch) => {
  let [errorChangingUserDataAndCreds] = await to(axios.put(`${targetUrl}firebase/changePasswordByEmail/${newUserData.email}`,
    { password: newUserData.password }));
  if (errorChangingUserDataAndCreds) {
    dispatch(createBackendError(errorChangingUserDataAndCreds));
    writeCloudLog(`Error cambiando las credenciales del Usuario ${newUserData.email}`, newUserData, errorChangingUserDataAndCreds, "error");
    return "ERROR";
  }
  return "SUCCESS";
}

//======================================================VARIAS========================================================================\\

export const createSubgenreFuga = async (subgenreName, dispatch) => {
  const [errorCreatingSubgenre, resultWIthFugaId] = await to(axios.post(`${targetUrl}miscellaneous/subgenres`, { name: subgenreName }));
  if (errorCreatingSubgenre) {
    dispatch(createBackendError(errorCreatingSubgenre));
    writeCloudLog("Error creating subgenre in fuga", subgenreName, errorCreatingSubgenre, "error");
    return "ERROR";
  }
  return resultWIthFugaId.data.response;
}

//=====================================================ROYALTIES=======================================================================\\

export const getRoyaltiesForTableView = async (fieldName, fieldValue, companyName, limit, offset, dispatch) => {
  const [errorGettingRoyalties, royaltiesResponse] = await to(axios.post(`${targetUrl}royalties/search`,
    { fieldName, fieldValue, companyName, limit, offset }));
  if (errorGettingRoyalties) {
    dispatch(createBackendError(errorGettingRoyalties));
    writeCloudLog("Error getting royalties from DB", { fieldName, fieldValue, companyName, limit, offset }, errorGettingRoyalties, "error");
    return "ERROR";
  }

  let result = royaltiesResponse.data.response;
  return { count: result.total, rows: result.royalties };
}

export const queryRoyaltiesWithOp = async (fieldName, fieldValue, companyName, op, fieldOp, groupBy, dispatch) => {
  const [errorGettingRoyalties, royaltiesResponse] = await to(axios.post(`${targetUrl}royalties/query-with-op`,
    { fieldName, fieldValue, companyName, op, fieldOp, groupBy }));
  if (errorGettingRoyalties) {
    dispatch(createBackendError(errorGettingRoyalties));
    writeCloudLog("Error getting royalties from DB", { fieldName, fieldValue, companyName, op, fieldOp, groupBy }
      , errorGettingRoyalties, "error");
    return "ERROR";
  }
  return royaltiesResponse.data.response;
}

export const getAccountingGroupedByForTableView = async (groupByProp, fieldName, fieldValue, dispatch) => {
  const [errorGettingAccounting, accountingResponse] = await to(axios.post(`${targetUrl}royalties/accounting-groupBy/${groupByProp}`, { fieldName, fieldValue }));
  if (errorGettingAccounting) {
    dispatch(createBackendError(errorGettingAccounting));
    writeCloudLog("Error getting royalties from DB", { groupByProp }, errorGettingAccounting, "error");
    return "ERROR";
  }
  return accountingResponse.data.response;
}

//=======================================================PAYOUTS=========================================================\\

export const getPayoutsForTableView = async (field, value, limit, offset, dispatch) => {
  let orderClause = "lastUpdateTS.DESC";
  let whereClause = JSON.stringify(value ? { [field]: value } : {});
  let timestamp = new Date().getTime();
  let queryParams = `?limit=${limit}&offset=${offset}&order=${orderClause}&where=${whereClause}&timestamp=${timestamp}`;

  const [errorGettingPayouts, payoutsResponse] = await to(axios.get(`${targetUrl}payouts/${queryParams}`));
  if (errorGettingPayouts) {
    dispatch(createBackendError(errorGettingPayouts));
    writeCloudLog("Error getting payouts from DB", { field, value, limit, offset }, errorGettingPayouts, "error");
    return "ERROR";
  }
  return { count: payoutsResponse.data.response.total, payouts: payoutsResponse.data.response.payouts };
}

export const getPayoutsAccountingForTableView = async (field, value, groupBy, orderByProp, dispatch) => {
  let orderClause = `${orderByProp.field}.${orderByProp.order}`;
  let whereClause = JSON.stringify(value ? { [field]: value } : {});
  let ops = JSON.stringify([{ op: "sum", field: "transferTotalUsd", name: "totalPayed" },
  { op: "count", field: "ownerEmail", name: "cantPayouts" },
  { op: "max", field: "requestDate", name: "lastPayAskedDay" }]);
  let attNoOps = JSON.stringify([{ name: groupBy }]);
  let timestamp = new Date().getTime();

  let queryParams = `?order=${orderClause}&where=${whereClause}&groupBy=${groupBy}&ops=${ops}&attributes=${attNoOps}&timestamp=${timestamp}`;

  const [errorGettingPayouts, payoutsResponse] = await to(axios.get(`${targetUrl}payouts/accounting/${queryParams}`));
  if (errorGettingPayouts) {
    dispatch(createBackendError(errorGettingPayouts));
    writeCloudLog("Error getting payouts from DB", { field, value, groupBy }, errorGettingPayouts, "error");
    return "ERROR";
  }
  return payoutsResponse.data.response;
}

export const getLastPayoutForUser = async (userEmail, dispatch) => {
  let timestamp = new Date().getTime();
  let [errorGettingLastPayout, lastPayout] = await to(axios.get(`${targetUrl}payouts/totalPayed/${userEmail}?timestamp=${timestamp}`));
  if (errorGettingLastPayout) {
    dispatch(createBackendError(errorGettingLastPayout));
    writeCloudLog(`Error getting last payout for ${userEmail} from DB`, userEmail, errorGettingLastPayout, "error");
    return "ERROR";
  }
  if (!lastPayout.data.response) return { payed: 0, lastRequest: "no tienes solicitudes." };

  return { payed: lastPayout.data.response.historicTotalUsd, lastRequest: lastPayout.data.response.requestDate };
}

export const createUserPayoutInDbAndFS = async (newPayout, dispatch) => {
  let [errorCreatingPayout, newPayoutResponse] = await to(axios.post(`${targetUrl}payouts/`,
    { payoutRecord: newPayout, sendNotification: true }));
  if (errorCreatingPayout) {
    dispatch(createBackendError(errorCreatingPayout));
    writeCloudLog(`Error creating payout for ${newPayout.ownerEmail} from DB`, newPayout, errorCreatingPayout, "error");
    return "ERROR";
  }
  console.log(newPayoutResponse);
  if (!newPayoutResponse.data.response) return "ERROR";
  return newPayoutResponse.data.response;
}

export const updateUserPayoutInDbAndFS = async (updatedPayout, sendNotification, dispatch) => {
  let [errorCreatingPayout, newPayoutResponse] = await to(axios.put(`${targetUrl}payouts/`,
    { payoutRecord: updatedPayout, sendNotification }));
  if (errorCreatingPayout) {
    dispatch(createBackendError(errorCreatingPayout));
    writeCloudLog(`Error updating payout for ${updatedPayout.ownerEmail} from DB`, updatedPayout, errorCreatingPayout, "error");
    return "ERROR";
  }
  if (!newPayoutResponse.data.response) return "ERROR";
  return newPayoutResponse.data.response;
}

export const deletePayoutInDbAndFS = async (payoutId, dispatch) => {
  let [errorDeletingPayout, deleteResponse] = await to(axios.delete(`${targetUrl}payouts/${payoutId}`,))
  if (errorDeletingPayout) {
    dispatch(createBackendError(errorDeletingPayout));
    writeCloudLog(`Error deleting payout for ${payoutId} from DB`, payoutId, errorDeletingPayout, "error");
    return "ERROR";
  }
  if (!deleteResponse.data.response) return "ERROR";
  return deleteResponse.data.response;
}