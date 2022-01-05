import { getFunctions, httpsCallable } from "firebase/functions";
import axios from 'axios';
import { to } from '../utils';
import { SIGN_IN_ERR } from "redux/actions/Types";
import { createBackendError } from '../redux/actions/ErrorHandlerActions';

const webUrl = "https://dashboard2.laflota.com.ar/filemanagerapp/api/";
const localUrl = "http://localhost:5000/filemanagerapp/api/";

const functions = getFunctions();

// ======================================LABELS=============================================\\

export const createLabelFuga = async (labelName, dispatch) => {
  let [errorCreatingLabelInThirdWebApi, labelFromThirdWebApi] = await to(
    axios.post(`${localUrl}labels`, { name: labelName }));

  if (errorCreatingLabelInThirdWebApi) {
    dispatch(createBackendError(errorCreatingLabelInThirdWebApi.response.data.errorMsgToFrontEnd, errorCreatingLabelInThirdWebApi.response.data));
    return "ERROR";
  }
  console.log("La respuesta de Fuga", labelFromThirdWebApi);

  return labelFromThirdWebApi;
}

export const deleteLabelFuga = async (labelFugaId, dispatch) => {
  let [errorDeletingLabelInThirdWebApi] = await to(
    axios.delete(`${localUrl}labels/${labelFugaId}`));

  if (errorDeletingLabelInThirdWebApi) {
    dispatch(createBackendError(errorDeletingLabelInThirdWebApi.response.data.errorMsgToFrontEnd, errorDeletingLabelInThirdWebApi.response.data));
    return "ERROR";
  }

  return "SUCCESS";
}


// ======================================ARTISTS=============================================\\

export const createArtistFuga = async (formDataArtist, dispatch) => {
  let [errorUploadingArtistInThirdWebApi, artistFromThirdWebApi] = await to(
    axios.post(`${localUrl}artists`, formDataArtist));

  if (errorUploadingArtistInThirdWebApi) {
    dispatch(createBackendError("Error al crear el artista.", errorUploadingArtistInThirdWebApi.response.data));
    return "ERROR";
  }

  return artistFromThirdWebApi;
}

export const updateArtistFuga = async (formDataArtist, artistFugaId, dispatch) => {
  let [errorUpdatingArtistInThirdWebApi] = await to(
    axios.put(`${localUrl}artists/${artistFugaId}`, formDataArtist));

  if (errorUpdatingArtistInThirdWebApi) {
    dispatch(createBackendError("Error al editar el artista.", errorUpdatingArtistInThirdWebApi.response.data));
    return "ERROR";
  }

  return "SUCCESS";
}

// ======================================ALBUMS=============================================\\

export const createAlbumFuga = async formDataAlbum => {
  let [uploadingAlbumInThirdWebApi, albumFromThirdWebApi] = await to(axios.post(`${webUrl}albums`, formDataAlbum));
  if (uploadingAlbumInThirdWebApi) throw new Error("Error al subir el album a Fuga", uploadingAlbumInThirdWebApi);
  console.log("La respuesta de crear el album en Fuga: ", albumFromThirdWebApi);

  return albumFromThirdWebApi;
}

// ======================================TRACKS=============================================\\

export const createTrackFuga = async (formDataTrack, onUploadProgress) => {
  let [errorUploadingTrackInThirdWebApi, trackFromThirdWebApi] = await to(axios.post(`${webUrl}tracks/`, formDataTrack, { onUploadProgress }));
  if (errorUploadingTrackInThirdWebApi) {
    console.log("Error al subir el track a Fuga", errorUploadingTrackInThirdWebApi);
  }
  console.log("La respuesta de crear el track en Fuga: ", trackFromThirdWebApi);

  return trackFromThirdWebApi;
}

// ======================================USERS=============================================\\

export const userExistInWpDB = async (email, dispatch) => {
  let [errorCheckingUser, checkingUserResponse] = await to(axios.get(`${localUrl}users/searchByEmail/${email}`));
  if (errorCheckingUser) dispatch({ type: SIGN_IN_ERR, payload: errorCheckingUser });

  if (checkingUserResponse.data.response.exist === false) return false;
  if (checkingUserResponse.data.response.exist === true) return checkingUserResponse.data.response.user;
}

export const checkEmailAndPasswordInWpDB = async (email, password, dispatch) => {
  let userInWp = await userExistInWpDB(email);
  if (userInWp) {
    const checkPasswordInWpDB = httpsCallable(functions, 'users-checkPasswordInWpDB');
    const passwordHashInDB = userInWp.userPass;
    const [errorCheckingPassword, passwordOk] = await to(checkPasswordInWpDB({ passwordHashInDB, password }));
    if (errorCheckingPassword) {
      dispatch({ type: SIGN_IN_ERR, payload: errorCheckingPassword });
      return;
    }
    return { existEmail: true, passwordCheck: passwordOk.data };
  }
  return { existEmail: false };
}