import { v4 as uuidv4 } from 'uuid';

// Lo uso tanto para crear como para editar.
export const createArtistModel = (dataArtist, editing) => {
  let rawDataArtist = {};
  if (dataArtist.name) rawDataArtist.name = dataArtist.name;
  if (!editing && dataArtist.id) rawDataArtist.proprietary_id = dataArtist.id;
  if (dataArtist.biography) rawDataArtist.biography = dataArtist.biography;
  if (dataArtist.spotify_uri) rawDataArtist.spotify_uri = dataArtist.spotify_uri;
  if (dataArtist.apple_id) rawDataArtist.apple_id = dataArtist.apple_id;
  // if (dataArtist.photo) formDataArtist.append("photo", dataArtist.photo);
  return rawDataArtist;
}

export const createAlbumModel = (dataAlbum, allOtherArtists) => {
  console.log("ALL OTHER ARITSTS CREATED", allOtherArtists)
  let formDataAlbum = new FormData();
  let saleAndReleaseDate = `${dataAlbum.year}-${dataAlbum.month}-${dataAlbum.dayOfMonth}`;

  let artistsArray = [{ primary: true, id: dataAlbum.artistFugaId }];
  allOtherArtists.forEach(otherArtist => artistsArray.push({ primary: true, id: otherArtist.fugaId }))
  
  console.log("data album post: ", artistsArray);

  formDataAlbum.append("name", dataAlbum.title);
  formDataAlbum.append("label", dataAlbum.labelFugaId);
  formDataAlbum.append("catalog_number", uuidv4());
  formDataAlbum.append("release_format_type", "ALBUM");
  formDataAlbum.append("c_line_text", dataAlbum.c_line);
  formDataAlbum.append("c_line_year", dataAlbum.c_year);
  formDataAlbum.append("p_line_text", dataAlbum.p_line);
  formDataAlbum.append("p_line_year", dataAlbum.p_year);
  formDataAlbum.append("genre", dataAlbum.genre);
  formDataAlbum.append("artists", JSON.stringify(artistsArray));
  formDataAlbum.append("consumer_release_date", saleAndReleaseDate);
  formDataAlbum.append("original_release_date", saleAndReleaseDate);
  formDataAlbum.append("typeCover", "image_cover_art");
  formDataAlbum.append("cover", dataAlbum.cover);

  return formDataAlbum;
};

export const createTrackModel = dataTrack => {

  // let fixedFugaArtistId = "4413387581";
  let artistsArray = [{ primary: true, id: dataTrack.artistFugaId }];

  let formDataTrack = new FormData();

  formDataTrack.append("name", dataTrack.title);
  formDataTrack.append("genre", dataTrack.genre);
  formDataTrack.append("artists", JSON.stringify(artistsArray));
  formDataTrack.append("track", dataTrack.track);
  formDataTrack.append("sequence", dataTrack.position);
  // formDataTrack.append("language", dataTrack.track_language);
  if (dataTrack.isrc) formDataTrack.append("isrc", dataTrack.isrc);
  if (dataTrack.price) formDataTrack.append("price", 1.29);
  if (dataTrack.lyrics) formDataTrack.lyrics("lyrics", dataTrack.lyrics);
  formDataTrack.append("albumId", dataTrack.albumFugaId);

  return formDataTrack;
}