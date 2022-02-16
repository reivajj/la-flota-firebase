
// import { editAction, deleteAction } from 'views/Tracks/NewTrackDialog';
import { colorFromFugaState, ourAlbumStateWithEquivalence } from '../variables/varias';

export const getFilteredAlbumsByUrl = (params, albums) => {
  if (params.view === "allOfArtist") return albums.filter(album => album.artistId === params.id);
  if (params.view === "allOfLabel") return albums.filter(album => album.label_name === params.label_name);
  return albums;
}

export const getTitleLanzamientos = (params, labels, artists) => {
  if (!Object.keys(params).length) return "Lanzamientos";
  let elemShowingAlbums = [...artists, ...labels].find(elem => elem.id === params.id || elem.name === params.label_name);
  return ` Lanzamientos de ${elemShowingAlbums ? elemShowingAlbums.name : ""}` ;
}

export const getAlbumById = (albums, albumId) => {
  return albums.find(a => a.id === albumId);
}

// export const sortArtistsByPrimaryFirst = artistsWithPrimary => {
//   return artistsWithPrimary.sort((arA, arB) => {
//     if (arA.primary) return -1;
//     if (!arA.primary && arB.primary) return 1;
//     return 1;
//   })
// }

// export const getAlbumDisplayArtistsName = (mainArtistName, allOtherArtists) => {

//   let otherArtistOrderedByPrimary = sortArtistsByPrimaryFirst(allOtherArtists);

//   console.log("TEST: ", otherArtistOrderedByPrimary);
//   let othersNames = allOtherArtists.map(otherArtist => `${otherArtist.primary ? "and " : "featuring "}${otherArtist.name}`);
//   console.log("other names: ", othersNames);
//   return `${mainArtistName} ${othersNames[0]}`
// }

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

export const getTracksDataTableFromFugaAssets = (fugaTracksAssets, handleEditTrack, handleDeleteTrack) => {
  let tracksDataTable = [];
  fugaTracksAssets.forEach(fugaTrackAsset => {
    tracksDataTable.push([
      `${fugaTrackAsset.sequence}`,
      `${fugaTrackAsset.name}`,
      `${fugaTrackAsset.isrc}`,
      `${fugaTrackAsset.display_artist}`,
      // editAction(fugaTrackAsset, handleEditTrack),
      // deleteAction(fugaTrackAsset, handleDeleteTrack),
    ])
  });
  return tracksDataTable;
}

export const getArtistNameAndPrimaryOfAlbum = albumData => {
  // let allOtherArtists = [];
  // albumData.allOtherArtists.forEach(otherArtist => allOtherArtists.push({ name: otherArtist.name, primary: otherArtist.primary }))
  return [{ name: albumData.nombreArtist, primary: true },
  ...albumData.allOtherArtists.map(otherArtist => { return { name: otherArtist.name, primary: otherArtist.primary } })];
}

export const getOurStateFromFugaState = fugaState => {
  return ourAlbumStateWithEquivalence[fugaState];
}

export const getStateColor = fugaState => {
  return colorFromFugaState[fugaState];
}

export const validateUPC = upcCode => {
  if (upcCode === "") return true;
  if (Number(upcCode) && upcCode.length === 13) return true;
  else return false;
}