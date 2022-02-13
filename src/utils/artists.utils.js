import { combineArraysWithNoDuplicates, cloneDeepLimited } from '../utils';

export const getAllOtherArtistsFromAlbumAndTrack = (artistFromLaFlota, allOtherArtistsAlbum, allArtistsTrack) => {
  console.log("ALL artists tracks: ", allArtistsTrack)
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