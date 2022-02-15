
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