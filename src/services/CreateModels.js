import { formatEquivalence, getFormatByCantOfTracks } from 'utils/albums.utils';
import { v4 as uuidv4 } from 'uuid';
import { getAllArtistsOfTrack, ifNoPrimaryChangeIt } from '../utils/artists.utils';

// Lo uso tanto para crear como para editar.
export const createArtistModel = (dataArtist, editing) => {
  let rawDataArtist = {};
  if (dataArtist.name) rawDataArtist.name = dataArtist.name;
  if (!editing && dataArtist.id) rawDataArtist.proprietary_id = dataArtist.id;
  if (dataArtist.biography) rawDataArtist.biography = dataArtist.biography;
  if (dataArtist.spotify_uri !== undefined) rawDataArtist.spotify_uri = dataArtist.spotify_uri || "";
  if (dataArtist.apple_id !== undefined) rawDataArtist.apple_id = dataArtist.apple_id || "";
  // if (dataArtist.photo) formDataArtist.append("photo", dataArtist.photo);
  return rawDataArtist;
}

export const createAlbumModel = (dataAlbum, explicit, myTracks, artistsInvitedStore, deliverToApple) => {
  let formDataAlbum = new FormData();
  let saleAndReleaseDate = `${dataAlbum.year}-${dataAlbum.month}-${dataAlbum.dayOfMonth}`;
  let originalReleaseDate = dataAlbum.oldRelease ? `${dataAlbum.originalYear}-${dataAlbum.originalMonth}-${dataAlbum.originalDayOfMonth}` : saleAndReleaseDate;
  let preOrderDate = `${dataAlbum.preOrderYear}-${dataAlbum.preOrderMonth}-${dataAlbum.preOrderDayOfMonth}`;

  let artistsArray = [{ primary: true, id: dataAlbum.artistFugaId }];
  dataAlbum.allOtherArtists.forEach(otherArtist => {
    if (otherArtist.fugaId) artistsArray.push({ primary: otherArtist.primary || false, id: otherArtist.fugaId });
    else {
      let artistFromStore = artistsInvitedStore.find(artistInvited => artistInvited.name === otherArtist.name);
      if (artistFromStore && artistFromStore.fugaId) artistsArray.push({ primary: otherArtist.primary || false, id: artistFromStore.fugaId });
    }
  });


  formDataAlbum.append("name", dataAlbum.title);
  formDataAlbum.append("label", dataAlbum.labelFugaId);
  formDataAlbum.append("language", dataAlbum.languageId);
  formDataAlbum.append("catalog_number", uuidv4());
  formDataAlbum.append("release_format_type", formatEquivalence[dataAlbum.format] || getFormatByCantOfTracks(myTracks.length, deliverToApple));
  formDataAlbum.append("c_line_text", dataAlbum.c_line);
  formDataAlbum.append("c_line_year", dataAlbum.c_year);
  formDataAlbum.append("p_line_text", dataAlbum.p_line);
  formDataAlbum.append("p_line_year", dataAlbum.p_year);
  formDataAlbum.append("genre", dataAlbum.genre);
  formDataAlbum.append("artists", JSON.stringify(artistsArray));
  formDataAlbum.append("consumer_release_date", saleAndReleaseDate);
  formDataAlbum.append("original_release_date", originalReleaseDate);
  formDataAlbum.append("parental_advisory", Boolean(explicit));
  if (dataAlbum.preOrderYear > 0) formDataAlbum.append("preorder_date", preOrderDate);
  if (dataAlbum.upc) formDataAlbum.append("upc", dataAlbum.upc);
  if (dataAlbum.subgenre) formDataAlbum.append("subgenre", dataAlbum.subgenre);
  if (dataAlbum.version) formDataAlbum.append("release_version", dataAlbum.version);

  formDataAlbum.append("extra_1", `Cantidad de Tracks total: ${myTracks.length}`);
  formDataAlbum.append("extra_2", "ALGO DE LAS DSP");
  formDataAlbum.append("extra_3", dataAlbum.id);
  formDataAlbum.append("typeCover", "image_cover_art");
  formDataAlbum.append("cover", dataAlbum.cover);

  return formDataAlbum;
};

export const createTrackModel = (dataTrack, artistInvited, artistRecentlyCreated) => {

  let artistsArrayToUpload = getAllArtistsOfTrack([...dataTrack.artists, ...dataTrack.allOtherArtists], artistInvited, artistRecentlyCreated);
  artistsArrayToUpload = ifNoPrimaryChangeIt(artistsArrayToUpload);

  let formDataTrack = new FormData();

  formDataTrack.append("name", dataTrack.title);
  formDataTrack.append("genre", dataTrack.genre);
  formDataTrack.append("artists", JSON.stringify(artistsArrayToUpload));
  formDataTrack.append("track", dataTrack.track);
  formDataTrack.append("sequence", dataTrack.position);
  formDataTrack.append("language", dataTrack.track_language_id || "ES");
  formDataTrack.append("audio_locale", dataTrack.audio_locale_id || "ES");
  formDataTrack.append("parental_advisory", dataTrack.explicit || false);
  if (dataTrack.isrc) formDataTrack.append("isrc", dataTrack.isrc);
  if (dataTrack.subgenre) formDataTrack.append("subgenre", dataTrack.subgenre);
  if (dataTrack.lyrics) formDataTrack.lyrics("lyrics", dataTrack.lyrics);
  if (dataTrack.preOrder) {
    formDataTrack.append("allow_preorder", true);
    formDataTrack.append("available_separately", true);
    formDataTrack.append("allow_preorder_preview", dataTrack.preview);
    formDataTrack.append("preorder_only", true);
  }
  formDataTrack.append("albumId", dataTrack.albumFugaId);

  return formDataTrack;
}

export const createPersonsModel = personsArray => {
  let formDataPersons = new FormData();
  formDataPersons.append("names", JSON.stringify(personsArray));
  return formDataPersons;
}