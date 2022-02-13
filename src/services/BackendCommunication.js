import { getFunctions, httpsCallable } from "firebase/functions";
import axios from 'axios';
import { to } from '../utils';
import { createBackendError } from '../redux/actions/ErrorHandlerActions';
import { loginErrorStore } from 'redux/actions/AuthActions';

const webUrl = "https://dashboard2.laflota.com.ar/filemanagerapp/api/";
const localUrl = "http://localhost:5000/filemanagerapp/api/";
const targetUrl = localUrl;
const functions = getFunctions();

// ======================================LABELS=============================================\\

export const createLabelFuga = async (labelName, dispatch) => {
  let [errorCreatingLabelInThirdWebApi, labelFromThirdWebApi] = await to(
    axios.post(`${targetUrl}labels`, { name: labelName }));

  if (errorCreatingLabelInThirdWebApi) {
    dispatch(createBackendError(errorCreatingLabelInThirdWebApi));
    return "ERROR";
  }
  console.log("La respuesta de Fuga", labelFromThirdWebApi);

  return labelFromThirdWebApi;
}

export const deleteLabelFuga = async (labelFugaId, dispatch) => {
  let [errorDeletingLabelInThirdWebApi] = await to(
    axios.delete(`${targetUrl}labels/${labelFugaId}`));

  if (errorDeletingLabelInThirdWebApi) {
    dispatch(createBackendError(errorDeletingLabelInThirdWebApi));
    return "ERROR";
  }

  return "SUCCESS";
}


// ======================================ARTISTS=============================================\\

export const createArtistFuga = async (formDataArtist, dispatch) => {
  let [errorUploadingArtistInThirdWebApi, artistFromThirdWebApi] = await to(
    axios.post(`${targetUrl}artists/withIdentifiers`, formDataArtist));

  if (errorUploadingArtistInThirdWebApi) {
    dispatch(createBackendError(errorUploadingArtistInThirdWebApi));
    return "ERROR";
  }

  return artistFromThirdWebApi;
}

export const updateArtistFuga = async (formDataArtist, artistFugaId, dispatch) => {
  let [errorUpdatingArtistInThirdWebApi] = await to(
    axios.put(`${targetUrl}artists/${artistFugaId}`, formDataArtist));

  if (errorUpdatingArtistInThirdWebApi) {
    dispatch(createBackendError(errorUpdatingArtistInThirdWebApi));
    return "ERROR";
  }

  return "SUCCESS";
}

export const updateArtistIdentifierFuga = async (formDataArtist, artistFugaId, dispatch) => {
  let [errorUpdatingArtistInThirdWebApi, resultIdentifier] = await to(
    axios.put(`${targetUrl}artists/${artistFugaId}/identifier`, formDataArtist));

  if (errorUpdatingArtistInThirdWebApi) {
    dispatch(createBackendError(errorUpdatingArtistInThirdWebApi));
    return "ERROR";
  }

  return resultIdentifier.data.response.id;
}


export const deleteArtistFuga = async (artistFugaId, dispatch) => {
  let [errorDeletingArtistInThirdWebApi] = await to(
    axios.delete(`${targetUrl}artists/${artistFugaId}`));

  if (errorDeletingArtistInThirdWebApi) {
    dispatch(createBackendError(errorDeletingArtistInThirdWebApi));
    return "ERROR";
  }
  return "SUCCESS";
}

// ======================================ALBUMS=============================================\\

export const createAlbumFuga = async (formDataAlbum, dispatch) => {
  let [errorUploadingAlbumInThirdWebApi, albumFromThirdWebApi] = await to(axios.post(`${targetUrl}albums`, formDataAlbum));
  if (errorUploadingAlbumInThirdWebApi) {
    dispatch(createBackendError(errorUploadingAlbumInThirdWebApi));
    return "ERROR";
  }
  return albumFromThirdWebApi;
}

// ======================================TRACKS=============================================\\

export const createTrackFuga = async (formDataTrack, onUploadProgress, dispatch) => {
  let [errorUploadingTrackInThirdWebApi, trackFromThirdWebApi] = await to(axios.post(`${targetUrl}tracks/`, formDataTrack, { onUploadProgress }));
  if (errorUploadingTrackInThirdWebApi) {
    dispatch(createBackendError(errorUploadingTrackInThirdWebApi));
    return "ERROR";
  }
  console.log("La respuesta de crear el track en Fuga: ", trackFromThirdWebApi);

  return trackFromThirdWebApi;
}

export const createPersonsFuga = async (formDataPeople, dispatch) => {
  let [errorUploadingPersonsInThirdWebApi, personsFromThirdWebApi] = await to(axios.post(`${targetUrl}people/addAll`, formDataPeople));
  if (errorUploadingPersonsInThirdWebApi) {
    dispatch(createBackendError(errorUploadingPersonsInThirdWebApi));
    return "ERROR";
  }
  console.log("La respuesta de crear el track en Fuga: ", personsFromThirdWebApi);
  let personsWithId = personsFromThirdWebApi.data.response;
  return personsWithId;
}

export const createCollaboratorFuga = async (collaborator, dispatch) => {
  let rawDataCollaborator = { person: collaborator.person, role: collaborator.role };
  let [errorAttachingCollaboratorInThirdWebApi, collaboratorFromThirdWebApi] = await to(axios.post(`${targetUrl}tracks/${collaborator.trackFugaId}/contributors`, rawDataCollaborator));
  if (errorAttachingCollaboratorInThirdWebApi) {
    dispatch(createBackendError(errorAttachingCollaboratorInThirdWebApi));
    return "ERROR";
  }
  console.log("La respuesta de crear el track en Fuga: ", collaboratorFromThirdWebApi);
  let personsWithId = collaboratorFromThirdWebApi.data.response.id;
  return personsWithId;
}

// ======================================USERS=============================================\\

export const userExistInWpDB = async (email, dispatch) => {
  let [errorCheckingUser, checkingUserResponse] = await to(axios.get(`${targetUrl}users/searchByEmail/${email}`));
  if (errorCheckingUser) {
    dispatch(loginErrorStore({ error: errorCheckingUser, errorMsg: "No se pudo comprobar la existencia del Email. Intente nuevamente." }));
    return "ERROR";
  }

  if (checkingUserResponse.data.response.exist === false) return false;
  if (checkingUserResponse.data.response.exist === true) return checkingUserResponse.data.response.user;
}

export const checkEmailAndPasswordInWpDB = async (email, password, dispatch) => {
  let userInWp = await userExistInWpDB(email);
  console.log("USER IN WP: ", userInWp);
  if (userInWp === "ERROR") return "ERROR";

  if (userInWp) {
    const checkPasswordInWpDB = httpsCallable(functions, 'users-checkPasswordInWpDB');
    const passwordHashInDB = userInWp.userPass;
    const [errorCheckingPassword, passwordOk] = await to(checkPasswordInWpDB({ passwordHashInDB, password }));
    if (errorCheckingPassword) {
      dispatch(loginErrorStore({ error: errorCheckingPassword, errorMsg: "El email existe, pero la contraseña es incorrecta." }));
      return "ERROR";
    }
    return { existEmail: true, passwordCheck: passwordOk.data, userInWp };
  }
  return { existEmail: false };
}