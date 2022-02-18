import { v4 as uuidv4 } from 'uuid';

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

const formatEquivalence = { Álbum: "ALBUM", EP: "EP", Single: "SINGLE" };

export const createAlbumModel = (dataAlbum, explicit) => {
  let formDataAlbum = new FormData();
  let saleAndReleaseDate = `${dataAlbum.year}-${dataAlbum.month}-${dataAlbum.dayOfMonth}`;
  let originalReleaseDate = dataAlbum.oldRelease ? `${dataAlbum.originalYear}-${dataAlbum.originalMonth}-${dataAlbum.originalDayOfMonth}` : saleAndReleaseDate;
  let preOrderDate = `${dataAlbum.preOrderYear}-${dataAlbum.preOrderMonth}-${dataAlbum.preOrderDayOfMonth}`;

  let artistsArray = [{ primary: true, id: dataAlbum.artistFugaId }];
  dataAlbum.allOtherArtists.forEach(otherArtist => artistsArray.push({ primary: otherArtist.primary, id: otherArtist.fugaId }));

  formDataAlbum.append("name", dataAlbum.title);
  formDataAlbum.append("label", dataAlbum.labelFugaId);
  formDataAlbum.append("language", dataAlbum.languageId);
  formDataAlbum.append("catalog_number", uuidv4());
  formDataAlbum.append("release_format_type", formatEquivalence[dataAlbum.format]);
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

  formDataAlbum.append("typeCover", "image_cover_art");
  formDataAlbum.append("cover", dataAlbum.cover);

  return formDataAlbum;
};

export const createTrackModel = (dataTrack, artistInvited, artistRecentlyCreated) => {

  let artistsArray = [...dataTrack.artists, ...dataTrack.allOtherArtists];
  let artistsArrayToUpload = [];
  let elementFoundedInInvited = ""; let elementFoundedInRecently = "";
  artistsArray.forEach(artist => {
    if (artist.fugaId) artistsArrayToUpload.push({ primary: artist.primary, id: artist.fugaId });
    else {
      elementFoundedInInvited = artistInvited.find(artistInvited => artistInvited.name === artist.name);
      elementFoundedInRecently = artistRecentlyCreated.find(artistRecently => artistRecently.name === artist.name);
      if (elementFoundedInInvited) {
        console.log("Element founded in vited: ", elementFoundedInInvited);
        artist.fugaId = elementFoundedInInvited.fugaId;
      }
      if (elementFoundedInRecently) {
        console.log("Element founded in recently: ", elementFoundedInRecently);
        artist.fugaId = elementFoundedInRecently.fugaId;
      }
      
      artistsArrayToUpload.push({ primary: artist.primary, id: artist.fugaId })
    };
  });

  let formDataTrack = new FormData();

  formDataTrack.append("name", dataTrack.title);
  formDataTrack.append("genre", dataTrack.genre);
  formDataTrack.append("artists", JSON.stringify(artistsArrayToUpload));
  formDataTrack.append("track", dataTrack.track);
  formDataTrack.append("sequence", dataTrack.position);
  formDataTrack.append("language", dataTrack.track_language_id);
  formDataTrack.append("audio_locale", dataTrack.audio_locale_id);
  formDataTrack.append("parental_advisory", dataTrack.explicit);
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