
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