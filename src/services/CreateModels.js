export const createAlbumModel = dataAlbum => {
  let formDataAlbum = new FormData();
  let saleAndReleaseDate = `${dataAlbum.year}-${dataAlbum.month}-${dataAlbum.dayOfMonth}`;
  
  formDataAlbum.append("c_line", `${dataAlbum.c_year + " " + dataAlbum.c_line}`);
  formDataAlbum.append("label_name", dataAlbum.label_name);
  formDataAlbum.append("p_line", `${dataAlbum.p_year + " " + dataAlbum.p_line}`);
  formDataAlbum.append("release_date", saleAndReleaseDate);
  formDataAlbum.append("sale_start_date", saleAndReleaseDate);
  formDataAlbum.append("title", dataAlbum.title);
  formDataAlbum.append("cover", dataAlbum.cover);

  return formDataAlbum;
};

export const createTrackModel = dataTrack => {
  let formDataTrack = new FormData();

  formDataTrack.append("album_id", dataTrack.albumDashGoId);
  formDataTrack.append("disc_number", dataTrack.disc_number);
  formDataTrack.append("explicit", dataTrack.explicit);
  formDataTrack.append("position", dataTrack.position);
  formDataTrack.append("title", dataTrack.title);
  formDataTrack.append("track", dataTrack.track);
  if (dataTrack.isrc) formDataTrack.append("isrc", dataTrack.isrc);
  // formDataTrack.append("price", 1.29);
  // formDataTrack.append("track_lenguage", dataTrack.track_lenguage);
  // formDataTrack.lyrics("lyrics", dataTrack.lyrics);

  return formDataTrack;
}