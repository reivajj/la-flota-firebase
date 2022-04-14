
// import { editAction, deleteAction } from 'views/Tracks/NewTrackDialog';
import { colorFromFugaState, ourAlbumStateWithEquivalence } from '../variables/varias';
import { dspsFuga, fugaAlbumsState } from '../variables/fuga';
import { deliveredSuccessText, publishedSuccessText, errorDeliveredText, deliveredSuccessTitle, errorDeliveredTitle, publishedSuccessTitle, noTracksWarningText, titleInvalidOldReleaseDate, invalidDateContentText, noCoverWarningText, noDateWarningText, noDateRelease, singleTrackDifferentNamesText } from './textToShow.utils';
import { noTracksWarningTitle } from './textToShow.utils';
import { titleInvalidPreCompraDate } from './textToShow.utils';
import { noCoverTitle } from './textToShow.utils';
import { artistsWithUniqueName } from './artists.utils';
import { spotifyUriIsValid } from './artists.utils';
import { spotifyUriNotValidText } from './textToShow.utils';
import { warningAppleDelivery } from 'utils/textToShow.utils';
import { singleTrackDifferentNamesTitle } from './textToShow.utils';
import { updateAddingAlbumRedux } from 'redux/actions/AlbumsActions';
import { subscriptionsStatusLaFlota } from 'variables/varias';

export const formatEquivalence = { Álbum: "ALBUM", EP: "EP", Single: "SINGLE" };

export const checkboxGroupInfo = dspsFuga.map(dspInfo => {
  return {
    ...dspInfo, checked: false, label: dspInfo.dspName,
    checkBoxHelper: dspInfo.dspName === "Apple Music" ? warningAppleDelivery : "",
  }
});

export const getFilteredAlbumsByUrl = (params, albums) => {
  if (params.view === "allOfArtist") return albums.filter(album => album.artistId === params.id);
  if (params.view === "allOfLabel") return albums.filter(album => album.label_name === params.label_name);
  if (params.view === "allOfUser") return albums.filter(album => album.ownerId === params.id);
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

export const checkFieldsCreateAlbum = (currentAlbumData, myTracks, setOpenInvalidValueDialog, validator, showErrorAndScrollToTop) => {
  let allOtherArtistsFromTracksAndAlbum = artistsWithUniqueName([...currentAlbumData.allOtherArtists, ...myTracks.map(track => track.allOtherArtists).flat()]);
  allOtherArtistsFromTracksAndAlbum = allOtherArtistsFromTracksAndAlbum.map(artist => { return { valid: spotifyUriIsValid(artist.spotify_uri), name: artist.name } });
  let invalidArtistUri = allOtherArtistsFromTracksAndAlbum.find(artistValid => artistValid.valid === false);

  if (invalidArtistUri) {
    setOpenInvalidValueDialog({
      open: true, beginer: "invalid-uri", title: `El Spotify Uri del artista de nombre: ${invalidArtistUri.name}, es inválido.`, text: spotifyUriNotValidText
    });
    showErrorAndScrollToTop();
    return;
  }
  if (!currentAlbumData.c_line || !currentAlbumData.p_line || !currentAlbumData.title || !currentAlbumData.genreName) {
    showErrorAndScrollToTop(); return "NO_VALID"
  };
  if (!currentAlbumData.dayOfMonth || !currentAlbumData.month || !currentAlbumData.year) {
    setOpenInvalidValueDialog({ open: true, beginner: "no-date", title: noDateRelease, text: noDateWarningText });
    return;
  }
  if (myTracks.length === 0) {
    setOpenInvalidValueDialog({ open: true, beginner: "no-tracks", title: noTracksWarningTitle, text: noTracksWarningText });
    return;
  }
  if (currentAlbumData.oldRelease ? !checkOldReleaseDate(currentAlbumData) : false) {
    setOpenInvalidValueDialog({ open: true, beginner: "old-release", title: titleInvalidOldReleaseDate, text: invalidDateContentText });
    return;
  }
  if (currentAlbumData.preOrder ? !checkPreOrderDate(currentAlbumData) : false) {
    setOpenInvalidValueDialog({ open: true, beginner: "pre-order", title: titleInvalidPreCompraDate, text: invalidDateContentText });
    return;
  }
  if (!currentAlbumData.cover.size) {
    setOpenInvalidValueDialog({ open: true, beginner: "no-cover", title: noCoverTitle, text: noCoverWarningText });
    return;
  }
  if (myTracks.length === 1 && currentAlbumData.title !== myTracks[0].title) {
    setOpenInvalidValueDialog({ open: true, beginner: "single-track-name", title: singleTrackDifferentNamesTitle, text: singleTrackDifferentNamesText });
    return;
  }
  if (validator.current.allValid()) return "ALL_VALID";
  else return "NO_VALID";

}

export const adaptAlbumToAppleFormat = (album, tracks, dispatch) => {
  let deliveryToApple = Boolean(album.dsps.find(dspInfo => dspInfo.dspName === "Apple Music"));
  let newTitle = tracks.length === 1 ? tracks[0].title : album.title;
  let newFormat = deliveryToApple ? getOurFormatByCantOfTracks(tracks.length, deliveryToApple) : album.format || getOurFormatByCantOfTracks(tracks.length);
  dispatch(updateAddingAlbumRedux({ ...album, format: newFormat, title: newTitle, appleAdapted: true }));
}

export const getArtistNameAndPrimaryOfAlbum = albumData => {
  if (!albumData) return [];
  if (!albumData.allOtherArtists) return albumData.nombreArtist ? [{ name: albumData.nombreArtist, primary: true }] : [];
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

export const getOurFormatByCantOfTracks = (cantTracks, deliverToApple) => {
  let maxTracksSingle = deliverToApple ? 3 : 1;
  if (cantTracks <= maxTracksSingle) return "Single";
  if (cantTracks > maxTracksSingle && cantTracks <= 6) return "EP";
  if (cantTracks > 6) return "Álbum";
  return "Single";
}

export const sortAlbumsByField = (albums, field) => {
  return albums.sort((aA, aB) => {
    if (aA[field] > aB[field]) return -1;
    else return 1;
  })
}

// DELIVERY
export const getDeliveredTitleDialog = deliveryState => {
  if (deliveryState === 'published') return publishedSuccessTitle;
  if (deliveryState === 'delivered') return deliveredSuccessTitle;
  return errorDeliveredTitle;
}

export const getDeliveredContentTextDialog = deliveryState => {
  if (deliveryState === 'published') return publishedSuccessText;
  if (deliveryState === 'delivered') return deliveredSuccessText;
  return errorDeliveredText;
}

export const userIsActive = userStatus => {
  if (!userStatus) return true;
  let subsNotActives = subscriptionsStatusLaFlota.map(sub => sub.id).filter(sub => sub !== "ACTIVA");
  return !subsNotActives.includes(userStatus);
}