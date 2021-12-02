import { v4 as uuidv4 } from 'uuid';

export const createArtistModel = dataArtist => {
  let formDataArtist = new FormData();
  formDataArtist.append("name", dataArtist.nombre);
  formDataArtist.append("proprietary_id", uuidv4());
  return formDataArtist;
}

export const createAlbumModel = dataAlbum => {
  let formDataAlbum = new FormData();
  let saleAndReleaseDate = `${dataAlbum.year}-${dataAlbum.month}-${dataAlbum.dayOfMonth}`;

  let fixedFugaLabel = "4490264762";
  let fixedFugaArtistId = "4413387581";
  let artistsArray = [{ primary: true, id: fixedFugaArtistId }];

  formDataAlbum.append("name", dataAlbum.title);
  formDataAlbum.append("label", fixedFugaLabel);
  formDataAlbum.append("catalog_number", "CAT-1");
  formDataAlbum.append("release_format_type", "ALBUM");
  formDataAlbum.append("c_line_text", dataAlbum.c_line);
  formDataAlbum.append("c_line_year", dataAlbum.c_year);
  formDataAlbum.append("p_line_text", dataAlbum.p_line);
  formDataAlbum.append("p_line_year", dataAlbum.p_year);
  formDataAlbum.append("genre", "ELECTRONIC");
  formDataAlbum.append("artists", JSON.stringify(artistsArray));
  formDataAlbum.append("consumer_release_date", saleAndReleaseDate);
  formDataAlbum.append("original_release_date", saleAndReleaseDate);
  formDataAlbum.append("typeCover", "image_cover_art");
  formDataAlbum.append("cover", dataAlbum.cover);

  return formDataAlbum;
};

export const createTrackModel = dataTrack => {

  let fixedFugaArtistId = "4413387581";
  let artistsArray = [{ primary: true, id: fixedFugaArtistId }];

  let formDataTrack = new FormData();

  formDataTrack.append("name", dataTrack.title);
  formDataTrack.append("genre", "ELECTRONIC");
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