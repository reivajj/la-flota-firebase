import axios from 'axios';

function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

export const createArtistDashGo = async formDataArtist => {
  let [uploadingArtistInThirdWebApi, artistFromThirdWebApi] = await to(
    axios.post("http://localhost:5000/filemanagerapp/api/artists/", formDataArtist, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }));
  if (uploadingArtistInThirdWebApi) console.log("Error al subir el artista a DashGo", uploadingArtistInThirdWebApi);
  console.log("La respuesta de DashGo", artistFromThirdWebApi);

  return artistFromThirdWebApi;
}
