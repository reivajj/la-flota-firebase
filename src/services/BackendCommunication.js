import axios from 'axios';

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

const webUrl = "https://dashboard2.laflota.com.ar/filemanagerapp/api/";
const localUrl = "http://localhost:5000/filemanagerapp/api/";

export const createArtistDashGo = async formDataArtist => {
  let [uploadingArtistInThirdWebApi, artistFromThirdWebApi] = await to(
    axios.post(`${webUrl}artists`, formDataArtist, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }));
  if (uploadingArtistInThirdWebApi) console.log("Error al subir el artista a DashGo", uploadingArtistInThirdWebApi);
  console.log("La respuesta de DashGo", artistFromThirdWebApi);

  return artistFromThirdWebApi;
}

export const createAlbumDashGo = async formDataAlbum => {
  let [uploadingAlbumInThirdWebApi, albumFromThirdWebApi] = await to(
    axios.post(`${webUrl}albums/upload`, formDataAlbum)
  )
  if (uploadingAlbumInThirdWebApi) throw new Error("Error al subir el album a DashGo", uploadingAlbumInThirdWebApi);
  console.log("La respuesta de crear el album en dashGo: ", albumFromThirdWebApi);

  return albumFromThirdWebApi;
}

export const createTrackDashGo = async formDataTrack => {
  let [uploadingTrackInThirdWebApi, trackFromThirdWebApi] = await to(
    axios.post(`${webUrl}tracks/`, formDataTrack)
  )
  if (uploadingTrackInThirdWebApi) console.log("Error al subir el track a DashGo", uploadingTrackInThirdWebApi);
  console.log("La respuesta de crear el track en dashGo: ", trackFromThirdWebApi);

  return trackFromThirdWebApi;
}

