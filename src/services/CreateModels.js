export const createAlbumModel = dataAlbum => {
  let formDataAlbum = new FormData();

  formDataAlbum.append("c_line", dataAlbum.c_line);
  formDataAlbum.append("label_name", dataAlbum.label_name);
  formDataAlbum.append("p_line", dataAlbum.p_line);
  formDataAlbum.append("release_date", dataAlbum.release_date);
  formDataAlbum.append("sale_start_date", dataAlbum.sale_start_date);
  formDataAlbum.append("title", dataAlbum.title);
  formDataAlbum.append("cover", dataAlbum.cover);

  return formDataAlbum;
};