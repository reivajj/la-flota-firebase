import { combineArraysWithNoDuplicates, cloneDeepLimited } from '../utils';

export const getAllOtherArtistsFromAlbumAndTrack = (artistFromLaFlota, allOtherArtistsAlbum, allArtistsTrack) => {
  let allOtherArtistsFromAlbum = allOtherArtistsAlbum.filter(a => a.name !== "");
  let allArtistsFromTrack = allArtistsTrack.filter(tA => tA.name !== artistFromLaFlota.name);
  let combinedArtists = combineArraysWithNoDuplicates(allOtherArtistsFromAlbum, allArtistsFromTrack);
  console.log("Combied artists:", combinedArtists)
  return combinedArtists;
}

export const artistsWithUniqueName = allOtherArtists => {
  let allNames = cloneDeepLimited(allOtherArtists);
  allNames = allNames.filter(artist => artist.name !== "").map(artist => artist.name);
  let notRepeatedNames = [...new Set(allNames)];
  const namesAndChecked = notRepeatedNames.map(name => { return { [`${name}`]: false } });
  let finalArtists = [];
  allOtherArtists.forEach(artist => {
    if (artist.name !== "" && !namesAndChecked[`${artist.name}`]) {
      namesAndChecked[`${artist.name}`] = true;
      finalArtists.push(artist);
    }
  })
  return finalArtists;
}

export const getFilteredArtistByUrl = (params, artists) => {
  if (params.view === "artist") return artists.filter(artist => artist.id === params.id);
  return artists;
}

export const getArtistPropsForDataTable = artists => {
  let artistsPropsToTable = [];
  artists.forEach(artist => {
    artistsPropsToTable.push([
      artist.name,
      artist.spotify_uri,
      artist.apple_id
    ]);
  });
  return artistsPropsToTable;
}

export const ifNoPrimaryChangeIt = artists => {
  let artistPrimary = {};
  if (artists.length > 0) {
    artistPrimary = artists.find(artist => artist.primary === true);
    if (!artistPrimary) artists[0].primary = true;
  } 
  return artists;
}

export const getAllArtistsOfTrack = (artists, artistInvited, artistRecentlyCreated) => {
  let artistsArrayToUpload = [];
  let elementFoundedInInvited = ""; let elementFoundedInRecently = "";
  artists.forEach(artist => {
    if (artist.fugaId) artistsArrayToUpload.push({ primary: artist.primary, id: artist.fugaId });
    else {
      if (artist.name !== "") {
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
      }
    };
  });
  return artistsArrayToUpload;
}