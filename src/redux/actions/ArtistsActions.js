import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { createArtistModel } from '../../services/CreateModels';

export const createArtistRedux = (artist, photoFile, userId) => async dispatch => {

  let formDataArtist = createArtistModel(artist, false);
  let artistFromThirdWebApi = await BackendCommunication.createArtistFuga(formDataArtist, dispatch);
  if (artistFromThirdWebApi === "ERROR") return "ERROR";

  artist.whenCreatedTS = new Date().getTime();
  artist.lastUpdateTS = artist.whenCreatedTS;
  artist.ownerId = userId;
  artist.fugaId = artistFromThirdWebApi.data.response.id;
  artist.fugaPropietaryId = artistFromThirdWebApi.data.response.proprietary_id;

  await FirestoreServices.createElementFS(artist, artist.id, userId, "artists", "totalArtists", 1, dispatch);

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
  console.log("ALL FIELDS:", allFields);
  return allFields;
}

export const updateArtistRedux = (newArtistsFields, artistFugaId, photoFile, userId) => async dispatch => {
  let onlyEditedFields = cleanNotEditedFields(newArtistsFields);
  let rawDataArtist = createArtistModel(onlyEditedFields, true);
  
  let artistFromThirdWebApi = await BackendCommunication.updateArtistFuga(rawDataArtist, artistFugaId, dispatch);
  if (artistFromThirdWebApi === "ERROR") return "ERROR";

  onlyEditedFields.lastUpdateTS = new Date().getTime();
  await FirestoreServices.updateElementFS(onlyEditedFields, onlyEditedFields.id, "artists", dispatch);

  dispatch({
    type: ReducerTypes.EDIT_ARTIST_WITH_ID,
    payload: onlyEditedFields
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

export const saveAddingArtistImagenUrl = artistTempImagenUrl => {
  return {
    type: ReducerTypes.ADDING_ARTIST_IMAGEN_URL,
    payload: artistTempImagenUrl
  }
}

export const saveAddingArtistId = artistTempId => {
  return {
    type: ReducerTypes.ADDING_ARTIST_ID,
    payload: artistTempId
  }
}
