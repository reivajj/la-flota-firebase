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

export const createAlbumModel = dataAlbum => {
  console.log("Album", dataAlbum)
  let formDataAlbum = new FormData();
  let saleAndReleaseDate = `${dataAlbum.year}-${dataAlbum.month}-${dataAlbum.dayOfMonth}`;
  let preOrderDate = `${dataAlbum.preOrderYear}-${dataAlbum.preOrderMonth}-${dataAlbum.preOrderDayOfMonth}`;

  let artistsArray = [{ primary: true, id: dataAlbum.artistFugaId }];
  dataAlbum.allOtherArtists.forEach(otherArtist => artistsArray.push({ primary: otherArtist.primary, id: otherArtist.fugaId }));

  console.log("data album artists: ", artistsArray);

  formDataAlbum.append("name", dataAlbum.title);
  formDataAlbum.append("label", dataAlbum.labelFugaId);
  formDataAlbum.append("language", dataAlbum.languageId);
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
  if (dataAlbum.preOrderYear > 0) formDataAlbum.append("preorder_date", preOrderDate);
  formDataAlbum.append("typeCover", "image_cover_art");
  formDataAlbum.append("cover", dataAlbum.cover);
  if (dataAlbum.upc) formDataAlbum.append("upc", dataAlbum.upc);
  if (dataAlbum.version) formDataAlbum.append("version", dataAlbum.version);
  if (dataAlbum.format) formDataAlbum.append("format", dataAlbum.format);

  return formDataAlbum;
};

export const createTrackModel = dataTrack => {

  let artistsArray = [];
  dataTrack.artists.forEach(artist => artistsArray.push({ primary: artist.primary, id: artist.fugaId }));

  let preOrderDate = "";
  let formDataTrack = new FormData();

  formDataTrack.append("name", dataTrack.title);
  formDataTrack.append("genre", dataTrack.genre);
  formDataTrack.append("artists", JSON.stringify(artistsArray));
  formDataTrack.append("track", dataTrack.track);
  formDataTrack.append("sequence", dataTrack.position);
  formDataTrack.append("language", dataTrack.track_language_id);
  if (dataTrack.isrc) formDataTrack.append("isrc", dataTrack.isrc);
  if (dataTrack.price) formDataTrack.append("price", 1.29);
  if (dataTrack.lyrics) formDataTrack.lyrics("lyrics", dataTrack.lyrics);
  if (preOrderDate) {
    formDataTrack.append("preorder_date", preOrderDate);
    formDataTrack.append("allow_preorder", true);
    formDataTrack.append("available_separately", true);
  }
  if (preOrderDate && dataTrack.preview) formDataTrack.append("allow_preorder_preview", dataTrack.preview);
  formDataTrack.append("albumId", dataTrack.albumFugaId);

  return formDataTrack;
}

export const createPersonsModel = personsArray => {
  let formDataPersons = new FormData();
  formDataPersons.append("names", JSON.stringify(personsArray));
  return formDataPersons;
}