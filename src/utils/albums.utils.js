
// import { editAction, deleteAction } from 'views/Tracks/NewTrackDialog';
import { colorFromFugaState, ourAlbumStateWithEquivalence } from '../variables/varias';
import { fugaAlbumsState } from '../variables/fuga';

export const getFilteredAlbumsByUrl = (params, albums) => {
  if (params.view === "allOfArtist") return albums.filter(album => album.artistId === params.id);
  if (params.view === "allOfLabel") return albums.filter(album => album.label_name === params.label_name);
  return albums;
}

export const getTitleLanzamientos = (params, labels, artists) => {
  if (!Object.keys(params).length) return "Lanzamientos";
  let elemShowingAlbums = [...artists, ...labels].find(elem => elem.id === params.id || elem.name === params.label_name);
  return ` Lanzamientos de ${elemShowingAlbums ? elemShowingAlbums.name : ""}`;
}

export const getAlbumById = (albums, albumId) => {
  let albumFounded = albums.find(a => a.id === albumId);
  if (!albumFounded) return {};
  else return albumFounded;
}

const firstDateIsLower = (aDayOfMonth, aMonth, aYear, otherDayOfMonth, otherMonth, otherYear) => {
  if (aYear < otherYear) return true;
  if (aYear > otherYear) return false;
  if (aYear === otherYear) {
    if (aMonth < otherMonth) return true;
    if (aMonth > otherMonth) return false;
    if (aMonth === otherMonth) return aDayOfMonth < otherDayOfMonth;
  }
}

export const checkPreOrderDate = albumData => {
  let { dayOfMonth, month, year, preOrder, preOrderDayOfMonth, preOrderMonth, preOrderYear } = albumData;
  if (preOrder) return firstDateIsLower(preOrderDayOfMonth, preOrderMonth, preOrderYear, dayOfMonth, month, year);
  return true;
}

export const checkOldReleaseDate = albumData => {
  let { dayOfMonth, month, year, oldRelease, originalYear, originalMonth, originalDayOfMonth } = albumData;
  if (oldRelease) return firstDateIsLower(originalDayOfMonth, originalMonth, originalYear, dayOfMonth, month, year);
  return true;
}

export const getArtistNameAndPrimaryOfAlbum = albumData => {
  if (!albumData) return [];
  if (!albumData.allOtherArtists) return albumData.nombreArtist ? [{ name: albumData.nombreArtist, primary: true }] : [];
  // let allOtherArtists = [];
  // albumData.allOtherArtists.forEach(otherArtist => allOtherArtists.push({ name: otherArtist.name, primary: otherArtist.primary }))
  return [{ name: albumData.nombreArtist, primary: true },
  ...albumData.allOtherArtists.map(otherArtist => { return { name: otherArtist.name, primary: otherArtist.primary } })];
}

export const getOurStateFromFugaState = fugaState => {
  return ourAlbumStateWithEquivalence[fugaState];
}

export const getStateColor = fugaState => {
  if (!fugaAlbumsState.includes(fugaState)) return "rgb(231, 190, 66)";
  return colorFromFugaState[fugaState];
}

export const validateUPC = upcCode => {
  if (upcCode === "") return true;
  if (Number(upcCode) && upcCode.length === 13) return true;
  else return false;
}

export const getFormatByCantOfTracks = cantTracks => {
  if (cantTracks === 1) return "SINGLE";
  if (cantTracks > 1 && cantTracks < 6) return "EP";
  if (cantTracks >= 6) return "ALBUM";
  return "NO_TRACKS";
}

export const sortAlbumsByField = (albums, field) => {
  return albums.sort((aA, aB) => {
    if (aA[field] > aB[field]) return -1;
    else return 1;
  })
}