
export const recalculatePositions = uploadingTracks => {
  return uploadingTracks.map((track, index) => {
    track.position = index + 1;
    return track;
  });
}

export const reorderTracksByPosition = tracks => {
  return tracks.sort((tA, tB) => {
    if (tA.position < tB.position) return -1;
    else return 1;
  })
}

export const getTracksFieldsFromFugaTrack = track => {
  return {
    explicit: track.parental_advisory, position: track.sequence, title: track.name, track: track.audio,
    genre: track.genre.id, genreName: track.genre.name || "", subgenre: track.subgenre || "",
    isrc: track.isrc, progress: 0, artists: track.artists, allOtherArtists: [], collaborators: [],
  }
}

export const isValidFormatISRC = isrcCode => {
  console.log("ISRC CODE : ", isrcCode);
  if (!isrcCode) return true;
  if (isrcCode.length !== 15) return false;
  let isrcParts = isrcCode.split('-');
  if (isrcParts.length !== 4) return false;

  return isrcCode.match(/^[A-Z]{2}-?\w{3}-?\d{2}-?\d{5}$/);
}