import { combineArraysWithNoDuplicates } from '../utils';

export const getAllOtherArtistsFromAlbumAndTrack = (artistFromLaFlota, allOtherArtistsAlbum, allArtistsTrack) => {
  let allOtherArtistsFromAlbum = allOtherArtistsAlbum.filter(a => a.name !== "");
  let allArtistsFromTrack = allArtistsTrack.filter(tA => tA.name !== artistFromLaFlota.name);
  let combinedArtists = combineArraysWithNoDuplicates(allOtherArtistsFromAlbum, allArtistsFromTrack);
  return combinedArtists;
}