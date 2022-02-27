import axios from 'axios';
import { to } from '../utils';
import { createBackendError } from '../redux/actions/ErrorHandlerActions';
import { loginErrorStore } from 'redux/actions/AuthActions';
import { writeCloudLog } from './LoggingService';

const webUrl = "https://dashboard2.laflota.com.ar/filemanagerapp/api/";
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

export const createArtistFuga = async (formDataArtist, dispatch) => {
  let [errorUploadingArtistInThirdWebApi, artistFromThirdWebApi] = await to(
    axios.post(`${targetUrl}artists/withIdentifiers`, formDataArtist));

  if (errorUploadingArtistInThirdWebApi) {
    dispatch(createBackendError(errorUploadingArtistInThirdWebApi));
    writeCloudLog("Error creating artist in fuga", formDataArtist, errorUploadingArtistInThirdWebApi, "error");
    return "ERROR";
  }

  return artistFromThirdWebApi;
}

export const updateArtistFuga = async (formDataArtist, artistFugaId, dispatch) => {
  let [errorUpdatingArtistInThirdWebApi] = await to(
    axios.put(`${targetUrl}artists/${artistFugaId}`, formDataArtist));

  if (errorUpdatingArtistInThirdWebApi) {
    dispatch(createBackendError(errorUpdatingArtistInThirdWebApi));
    writeCloudLog("Error updating artist in fuga", formDataArtist, errorUpdatingArtistInThirdWebApi, "error");
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

export const updateArtistIdentifierFuga = async (identifierId, formDataArtist, artistFugaId, dispatch) => {
  let errorUpdatingArtistInThirdWebApi = ""; let resultIdentifier = "";
  let errorDeletingIdentifier = "";
  if (formDataArtist.identifierValue === "") {
    [errorDeletingIdentifier] = await to(axios.delete(`${targetUrl}artists/${artistFugaId}/identifier/${identifierId}`));
    if (errorDeletingIdentifier) {
      dispatch(createBackendError(errorDeletingIdentifier));
      writeCloudLog("Error deleting artist identifier in fuga", { identifierId, formDataArtist, artistFugaId }, errorDeletingIdentifier, "error");
      return "ERROR";
    }
    [errorUpdatingArtistInThirdWebApi, resultIdentifier] = await to(
      axios.post(`${targetUrl}artists/${artistFugaId}/identifier`, formDataArtist));
  }

  else[errorUpdatingArtistInThirdWebApi, resultIdentifier] = await to(
    axios.put(`${targetUrl}artists/${artistFugaId}/identifier`, formDataArtist));

  if (errorUpdatingArtistInThirdWebApi) {
    dispatch(createBackendError(errorUpdatingArtistInThirdWebApi));
    writeCloudLog("Error updating artist in fuga", { identifierId, artistFugaId, formDataArtist }, errorUpdatingArtistInThirdWebApi, "error");
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

export const createAlbumFuga = async (formDataAlbum, dispatch) => {
  let [errorUploadingAlbumInThirdWebApi, albumFromThirdWebApi] = await to(axios.post(`${targetUrl}albums`, formDataAlbum));
  if (errorUploadingAlbumInThirdWebApi) {
    dispatch(createBackendError(errorUploadingAlbumInThirdWebApi));
    writeCloudLog("Error creating album in fuga", formDataAlbum, errorUploadingAlbumInThirdWebApi, "error");
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
    if (errorCodeIfExist === "NOT_AUTHORIZED" || errorCodeIfExist === "NOT_FOUND") return "NOT_AUTHORIZED";
    dispatch(createBackendError(errorDeletingAlbumInFuga));
    writeCloudLog("Error deleting album in fuga", albumFugaId, errorDeletingAlbumInFuga, "error");

    return "ERROR";
  }
  return "SUCCESS";
}

export const attachingTracksToAlbumFuga = async (tracksData, albumId, dispatch) => {

  for (const trackData of tracksData) {
    const [errorAttachingTrack, result] = await to(axios.put(`${targetUrl}albums/${albumId}/tracks/${trackData.fugaId}`));
    if (errorAttachingTrack) {
      dispatch(createBackendError(errorAttachingTrack));
      writeCloudLog("Error attaching tracks to album in fuga", { trackData, albumId }, errorAttachingTrack, "error");
      return "ERROR";
    }
    console.log("RESULT:", result);
  }
  return "SUCCESS";
}

export const rearrengePositionsFuga = async (tracksData, albumId, dispatch) => {
  let traksIdsAndPositions = [];
  tracksData.forEach(trackData => traksIdsAndPositions.push({ trackId: trackData.fugaId, newPosition: trackData.position }));

  let [errorRearrengingPositions, result] = await to(axios.put(`${targetUrl}albums/${albumId}/rearrenge`,
    { rearrengeInstructions: traksIdsAndPositions }));
  if (errorRearrengingPositions) {
    dispatch(createBackendError(errorRearrengingPositions));
    writeCloudLog("Error rearrenging album positions in fuga", { tracksData, albumId }, errorRearrengingPositions, "error");
    return "ERROR";
  }
  return result;
}

// ======================================TRACKS=============================================\\

// ESTA LLEGANDO EL FORMDATA TRACK VACIO.
export const createTrackFuga = async (formDataTrack, onUploadProgress, albumFugaId, dispatch) => {
  let [errorUploadingTrackInThirdWebApi, trackFromThirdWebApi] = await to(axios.post(`${targetUrl}tracks/`, formDataTrack, { onUploadProgress }));
  if (errorUploadingTrackInThirdWebApi) {
    dispatch(createBackendError(errorUploadingTrackInThirdWebApi));
    writeCloudLog(`Error creating track in fuga with album fugaId ${albumFugaId}`, formDataTrack, errorUploadingTrackInThirdWebApi, "error");
    return "ERROR";
  }

  return trackFromThirdWebApi;
}

export const createPersonsFuga = async (formDataPeople, dispatch) => {
  let [errorUploadingPersonsInThirdWebApi, personsFromThirdWebApi] = await to(axios.post(`${targetUrl}people/addAll`, formDataPeople));
  if (errorUploadingPersonsInThirdWebApi) {
    dispatch(createBackendError(errorUploadingPersonsInThirdWebApi));
    writeCloudLog("Error creating person in fuga", formDataPeople, errorUploadingPersonsInThirdWebApi, "error");

    return "ERROR";
  }
  let personsWithId = personsFromThirdWebApi.data.response;
  return personsWithId;
}

export const createCollaboratorFuga = async (collaborator, dispatch) => {
  let rawDataCollaborator = { person: collaborator.person, role: collaborator.role };
  let [errorAttachingCollaboratorInThirdWebApi, collaboratorFromThirdWebApi] = await to(axios.post(`${targetUrl}tracks/${collaborator.trackFugaId}/contributors`, rawDataCollaborator));
  if (errorAttachingCollaboratorInThirdWebApi) {
    dispatch(createBackendError(errorAttachingCollaboratorInThirdWebApi));
    writeCloudLog("Error creating collaborator in fuga", collaborator, errorAttachingCollaboratorInThirdWebApi, "error");
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