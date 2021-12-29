import { getFunctions, httpsCallable } from "firebase/functions";
import axios from 'axios';
import { to } from '../utils';
import { SIGN_IN_ERR } from "redux/actions/Types";

const webUrl = "https://dashboard2.laflota.com.ar/filemanagerapp/api/";
const localUrl = "http://localhost:5000/filemanagerapp/api/";

const functions = getFunctions();

export const createArtistFuga = async formDataArtist => {
  let [uploadingArtistInThirdWebApi, artistFromThirdWebApi] = await to(
    axios.post(`${localUrl}artists`, formDataArtist, {
      headers: { "Content-Type": "multipart/form-data" }
    }));

  if (uploadingArtistInThirdWebApi) {
    return { message: "Error al subir el artista a Fuga", error: uploadingArtistInThirdWebApi.response.data };
  }
  console.log("La respuesta de Fuga", artistFromThirdWebApi);

  return artistFromThirdWebApi;
}

export const createAlbumFuga = async formDataAlbum => {
  let [uploadingAlbumInThirdWebApi, albumFromThirdWebApi] = await to(axios.post(`${webUrl}albums`, formDataAlbum));
  if (uploadingAlbumInThirdWebApi) throw new Error("Error al subir el album a Fuga", uploadingAlbumInThirdWebApi);
  console.log("La respuesta de crear el album en Fuga: ", albumFromThirdWebApi);

  return albumFromThirdWebApi;
}

export const createTrackFuga = async (formDataTrack, onUploadProgress) => {
  let [errorUploadingTrackInThirdWebApi, trackFromThirdWebApi] = await to(axios.post(`${webUrl}tracks/`, formDataTrack, { onUploadProgress }));
  if (errorUploadingTrackInThirdWebApi) {
    console.log("Error al subir el track a Fuga", errorUploadingTrackInThirdWebApi);
  }
  console.log("La respuesta de crear el track en Fuga: ", trackFromThirdWebApi);

  return trackFromThirdWebApi;
}

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