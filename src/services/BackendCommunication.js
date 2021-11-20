import axios from 'axios';
import { createBackendError } from '../redux/actions/ErrorHandlerActions';

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

const webUrl = "https://dashboard2.laflota.com.ar/filemanagerapp/api/";
const localUrl = "http://localhost:5000/filemanagerapp/api/";

export const createArtistFuga = async formDataArtist => {
  let [uploadingArtistInThirdWebApi, artistFromThirdWebApi] = await to(
    axios.post(`${webUrl}artists`, formDataArtist, {
      headers: { "Content-Type": "multipart/form-data" }
    }));
  if (uploadingArtistInThirdWebApi) console.log("Error al subir el artista a Fuga", uploadingArtistInThirdWebApi);
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
    createBackendError({ errorMessage: "Error al subir el track a Fuga", error: errorUploadingTrackInThirdWebApi });
  }
  console.log("La respuesta de crear el track en Fuga: ", trackFromThirdWebApi);

  return trackFromThirdWebApi;
}

