import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { createArtistModel } from '../../services/CreateModels';
import { to, toWithOutError } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeepLimited } from '../../utils';
import { writeCloudLog } from '../../services/LoggingService';

export const artistsAddStore = artists => {
  return {
    type: ReducerTypes.ADD_ARTISTS,
    payload: artists
  }
}

export const artistsAttachFugaIdToArtistDoc = (artist, userId, ownerEmail) => async dispatch => {
  let userByEmailData = await FirestoreServices.getUserDataByEmailInFS(ownerEmail, dispatch);
  if (!userByEmailData.id) return "ERROR";

  let artistFromFuga = await BackendCommunication.getArtistByIdFuga(artist.fugaId, dispatch);
  if (artistFromFuga === "ERROR") return "ERROR";

  let artistIdentfiersFromFuga = await BackendCommunication.getArtistsIdentifierByIdFuga(artist.fugaId, dispatch);
  if (artistIdentfiersFromFuga === "ERROR") return "ERROR";

  artistIdentfiersFromFuga.forEach(identifierData => {
    if (identifierData.issuingOrganization.id === 746109) {
      artist.spotifyIdentifierIdFuga = identifierData.id;
      artist.spotify_uri = identifierData.identifier;
    }
    if (identifierData.issuingOrganization.id === 1330598) {
      artist.appleIdentifierIdFuga = identifierData.id;
      artist.apple_id = identifierData.identifier;
    }
  });

  artist.whenCreatedTS = new Date().getTime();
  artist.lastUpdateTS = artist.whenCreatedTS;
  artist.ownerId = userByEmailData.id; artist.ownerEmail = userByEmailData.email;
  artist.fugaId = artistFromFuga.data.response.id;
  artist.fugaPropietaryId = artistFromFuga.data.response.proprietary_id || artist.id;

  console.log("ARTIST POST FUGA: ", artist);

  await FirestoreServices.createElementFS(artist, artist.id, artist.ownerId, "artists", "cantTotalArtists", 1, dispatch);

  dispatch({
    type: ReducerTypes.ADD_ARTISTS,
    payload: [artist]
  });

  return "SUCCESS";
}

// TypeOfArtists = ["artists", "artistsInvited"];
export const createArtistRedux = (isAdmin, artist, userId, ownerEmail, typeOfArtist, totalField) => async dispatch => {

  let userByEmailData = "";
  if (isAdmin) {
    userByEmailData = await FirestoreServices.getUserDataByEmailInFS(ownerEmail, dispatch);
    if (!userByEmailData.id) return "ERROR";
  }

  delete artist.imagenRef;
  let formDataArtist = createArtistModel(artist, false);
  console.log("FORM DATA ARTIST: ", formDataArtist);
  writeCloudLog("creating artist model to send fuga", formDataArtist, { notError: "not error" }, "info");

  let artistFromThirdWebApi = await BackendCommunication.createArtistFuga(formDataArtist, dispatch);
  if (artistFromThirdWebApi === "ERROR") return "ERROR";

  artist.whenCreatedTS = new Date().getTime();
  artist.lastUpdateTS = artist.whenCreatedTS;
  artist.ownerId = isAdmin ? userByEmailData.id : userId;
  artist.ownerEmail = ownerEmail;

  console.log("ARTIST: ", artist);
  artist.fugaId = artistFromThirdWebApi.data.response.id;
  artist.fugaPropietaryId = artistFromThirdWebApi.data.response.proprietary_id;
  artist.spotifyIdentifierIdFuga = artistFromThirdWebApi.data.response.spotifyIdentifierIdFuga;
  artist.appleIdentifierIdFuga = artistFromThirdWebApi.data.response.appleIdentifierIdFuga;

  await FirestoreServices.createElementFS(artist, artist.id, isAdmin ? userByEmailData.id : userId, typeOfArtist, totalField, 1, dispatch);

  // Si vengo de artistsInvited no debo agregarlos al Store de Artists.
  if (typeOfArtist !== "artists") return "SUCCESS";

  dispatch({
    type: ReducerTypes.ADD_ARTISTS,
    payload: [artist]
  });

  return "SUCCESS";
}

export const artistsCreateFromDGArtistsRedux = (ownerId, ownerEmail) => async dispatch => {

  let dgArtists = await BackendCommunication.getDgArtistsFuga(ownerEmail, dispatch);
  if (dgArtists === "NO_ARTISTS") return "NO_ARTISTS";
  if (dgArtists === "NO_USER") return "NO_USER";
  if (dgArtists.length === 0) return "NO_ARTISTS";


  const createDGArtistOneByOne = dgArtists.map(async dataDgArtist => {
    let cloneDataDgArtists = cloneDeepLimited(dataDgArtist);
    dataDgArtist.ownerId = ownerId;
    dataDgArtist.dashGoId = cloneDataDgArtists.id;
    dataDgArtist.id = uuidv4();
    dataDgArtist.biography = cloneDataDgArtists.bio || "";
    delete dataDgArtist.bio;

    let artistCreatedResult = await toWithOutError(dispatch(createArtistRedux(false, dataDgArtist, ownerId, ownerEmail, "artists", "totalArtists")));
    if (artistCreatedResult === "ERROR") return "ERROR";
    return "SUCCESS";
  });

  let [errorCreatingAllArtists] = await to(Promise.all(createDGArtistOneByOne));
  if (errorCreatingAllArtists) return "ERROR";
}

const cleanNotEditedFields = (allFields, fieldsEdited) => {
  Object.keys(allFields).forEach(prop => {
    if (!fieldsEdited[prop]) delete allFields[prop];
  })
  return allFields;
}

export const updateArtistRedux = (oldArtistData, newArtistsFields, artistFugaId, photoFile, userId, fieldsEdited) => async dispatch => {
  let onlyEditedFields = cleanNotEditedFields(newArtistsFields, fieldsEdited);
  let rawDataArtist = createArtistModel(onlyEditedFields, true);

  writeCloudLog("updating artist model to send fuga", rawDataArtist, { notError: "not error" }, "info");

  if (rawDataArtist.name || rawDataArtist.biography) {
    let artistFromThirdWebApi = await BackendCommunication.updateArtistFuga(rawDataArtist, artistFugaId, dispatch);
    if (artistFromThirdWebApi === "ERROR") return "ERROR";
  }

  if (rawDataArtist.spotify_uri !== undefined) {
    let spotifyIdentifierResponse = await BackendCommunication.updateArtistIdentifierFuga(oldArtistData.spotifyIdentifierIdFuga,
      { identifierField: "spotify_uri", identifierValue: rawDataArtist.spotify_uri }, artistFugaId, dispatch);
    if (spotifyIdentifierResponse === "ERROR") return "ERROR";
    onlyEditedFields.spotifyIdentifierIdFuga = spotifyIdentifierResponse;
  }

  if (rawDataArtist.apple_id !== undefined) {
    let appleIdentifierResponse = await BackendCommunication.updateArtistIdentifierFuga(oldArtistData.appleIdentifierIdFuga,
      { identifierField: "apple_id", identifierValue: rawDataArtist.apple_id }, artistFugaId, dispatch);
    if (appleIdentifierResponse === "ERROR") return "ERROR";
    onlyEditedFields.appleIdentifierIdFuga = appleIdentifierResponse;
  }

  onlyEditedFields.id = oldArtistData.id;
  onlyEditedFields.lastUpdateTS = new Date().getTime();
  await FirestoreServices.updateElementFS(oldArtistData, onlyEditedFields, onlyEditedFields.id, "artists", dispatch);

  dispatch({
    type: ReducerTypes.EDIT_ARTIST_WITH_ID,
    payload: onlyEditedFields
  });

  return "SUCCESS";
}

export const deleteArtistRedux = (dataArtist, artistId, artistFugaId, userId) => async dispatch => {
  // let deleteResponse = await BackendCommunication.deleteArtistFuga(artistFugaId, dispatch);
  // if (deleteResponse === "ERROR") return "ERROR";

  await FirestoreServices.deleteElementFS(dataArtist, artistId, userId, "artists", "totalArtists", -1, dispatch);

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

export const updateAddingArtistRedux = newAddingArtist => {
  return {
    type: ReducerTypes.ADDING_ARTIST_UPDATE,
    payload: newAddingArtist
  }
}