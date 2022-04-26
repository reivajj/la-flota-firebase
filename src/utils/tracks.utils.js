
import { textFloatingPointAudio, textLowQualityAudio } from './textToShow.utils';
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
  if (!isrcCode) return true;
  if (isrcCode.length !== 15) return false;
  let isrcParts = isrcCode.split('-');
  if (isrcParts.length !== 4) return false;

  return isrcCode.match(/^[A-Z]{2}-?\w{3}-?\d{2}-?\d{5}$/);
}

export const checkIfAnyTrackIsExplicit = tracks => {
  return tracks.some(track => track.explicit);
}

export const isValidSpotifyUri = spotifyUri => {
  if (!spotifyUri) return true;
  return spotifyUri.match(/^(spotify:artist:)([a-zA-Z0-9]+)$/);
}


export const readFileDataAsBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export const readAndCheckAudioFile = async (file, wav, setOpenLowQualityAudioDialog) => {
  let fileReaded = await readFileDataAsBase64(file);
  wav.fromBuffer(Buffer.from(fileReaded));
  console.log("LOADED WAV FILE: ", wav);

  if (Number(wav.bitDepth) < 16) {
    setOpenLowQualityAudioDialog({ open: true, title: "El archivo de Audio no es soportado (menor a 16 bits) .", text: textLowQualityAudio });
    return "ERROR";
  }
  if (wav.fmt.sampleRate < 44100) {
    setOpenLowQualityAudioDialog({ open: true, title: "El archivo de Audio no es soportado (Sample Rate menor a 44.1 khz).", text: textLowQualityAudio })
    return "ERROR";
  }
  if (wav.bitDepth === "32f" || wav.bitDepth === "64") {
    setOpenLowQualityAudioDialog({ open: true, title: "Archivos Floating point WAV no son soportados.", text: textFloatingPointAudio });
    return "ERROR";
  }
  return "SUCCESS";
}