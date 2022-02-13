import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { createArtistModel } from '../../services/CreateModels';

export const artistsAddStore = artists => {
  return {
    type: ReducerTypes.ADD_ARTISTS,
    payload: artists
  }
}

// TypeOfArtists = ["artists", "artistsInvited"];
export const createArtistRedux = (artist, userId, typeOfArtist, totalField) => async dispatch => {

  delete artist.imagenRef;
  let formDataArtist = createArtistModel(artist, false);
  let artistFromThirdWebApi = await BackendCommunication.createArtistFuga(formDataArtist, dispatch);
  if (artistFromThirdWebApi === "ERROR") return "ERROR";

  artist.whenCreatedTS = new Date().getTime();
  artist.lastUpdateTS = artist.whenCreatedTS;
  artist.ownerId = userId;
  artist.fugaId = artistFromThirdWebApi.data.response.id;
  artist.fugaPropietaryId = artistFromThirdWebApi.data.response.proprietary_id;
  artist.spotifyIdentifierIdFuga = artistFromThirdWebApi.data.response.spotifyIdentifierIdFuga;
  artist.appleIdentifierIdFuga = artistFromThirdWebApi.data.response.appleIdentifierIdFuga;

  await FirestoreServices.createElementFS(artist, artist.id, userId, typeOfArtist, totalField, 1, dispatch);

  if (typeOfArtist !== "artists") return "SUCCESS";

  dispatch({
    type: ReducerTypes.ADD_ARTISTS,
    payload: [artist]
  });

  return "SUCCESS";
}

const cleanNotEditedFields = allFields => {
  Object.keys(allFields).forEach(prop => {
    if (allFields[prop] === "") delete allFields[prop];
  })
  return allFields;
}

export const updateArtistRedux = (newArtistsFields, artistFugaId, photoFile, userId) => async dispatch => {
  let onlyEditedFields = cleanNotEditedFields(newArtistsFields);
  let rawDataArtist = createArtistModel(onlyEditedFields, true);

  if (rawDataArtist.name || rawDataArtist.biography) {
    let artistFromThirdWebApi = await BackendCommunication.updateArtistFuga(rawDataArtist, artistFugaId, dispatch);
    if (artistFromThirdWebApi === "ERROR") return "ERROR";
  }

  if (rawDataArtist.spotify_uri) {
    let spotifyIdentifierResponse = await BackendCommunication.updateArtistIdentifierFuga(
      { identifierField: "spotify_uri", identifierValue: rawDataArtist.spotify_uri }, artistFugaId, dispatch);
    if (spotifyIdentifierResponse === "ERROR") return "ERROR";
    console.log("spotifyReponse: ", spotifyIdentifierResponse);
    onlyEditedFields.spotifyIdentifierIdFuga = spotifyIdentifierResponse;
  }

  if (rawDataArtist.apple_id) {
    let appleIdentifierResponse = await BackendCommunication.updateArtistIdentifierFuga(
      { identifierField: "apple_id", identifierValue: rawDataArtist.apple_id }, artistFugaId, dispatch);
    if (appleIdentifierResponse === "ERROR") return "ERROR";
    onlyEditedFields.appleIdentifierIdFuga = appleIdentifierResponse;
  }

  onlyEditedFields.lastUpdateTS = new Date().getTime();
  await FirestoreServices.updateElementFS(onlyEditedFields, onlyEditedFields.id, "artists", dispatch);

  dispatch({
    type: ReducerTypes.EDIT_ARTIST_WITH_ID,
    payload: onlyEditedFields
  });

  return "SUCCESS";
}

export const deleteArtistRedux = (artistId, artistFugaId, userId) => async dispatch => {
  let deleteResponse = await BackendCommunication.deleteArtistFuga(artistFugaId, dispatch);
  if (deleteResponse === "ERROR") return "ERROR";

  await FirestoreServices.deleteElementFS(artistId, userId, "artists", "totalArtists", -1, dispatch);

  dispatch({
    type: ReducerTypes.ARTIST_DELETE_WITH_ID,
    payload: artistId
  });

  return "SUCCESS";
}

export const saveAddingArtistName = artistTempName => {
  return {
    type: ReducerTypes.ADDING_ARTIST_NAME,
    payload: artistTempName
  }
}

export const saveAddingArtistBiography = artistTempBio => {
  return {
    type: ReducerTypes.ADDING_ARTIST_BIO,
    payload: artistTempBio
  }
}

export const saveAddingArtistImagenUrlAndReference = (imagenUrl, imagenRef) => {
  return {
    type: ReducerTypes.ADDING_ARTIST_IMAGEN_URL,
    payload: { imagenUrl, imagenRef }
  }
}

export const saveAddingArtistId = artistTempId => {
  return {
    type: ReducerTypes.ADDING_ARTIST_ID,
    payload: artistTempId
  }
}

export const saveAddingArtistSpotifyUri = artistTempSpotifyUri => {
  return {
    type: ReducerTypes.ADDING_ARTIST_SPOTIFY_URI,
    payload: artistTempSpotifyUri
  }
}

export const saveAddingArtistAppleId = artistTempAppleId => {
  return {
    type: ReducerTypes.ADDING_ARTIST_APPLE_ID,
    payload: artistTempAppleId
  }
}
