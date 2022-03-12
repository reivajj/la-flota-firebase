import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';
import { toWithOutError } from 'utils';
import { albumsAddStore } from 'redux/actions/AlbumsActions';
import { artistsAddStore } from './ArtistsActions';

export const usersAddStore = users => {
  return { type: ReducerTypes.USERS_ADD, payload: users }
}

export const usersSignOut = () => {
  return { type: ReducerTypes.USERS_SIGN_OUT }
}

export const userEditById = ({ id, data }) => {
  return { type: ReducerTypes.USERS_EDIT_BY_ID, payload: { id, data } }
}

export const createUserRedux = userData => async dispatch => {
  dispatch(usersAddStore([userData]))
}

export const getSearchedUserRedux = email => async dispatch => {
  let userSearched = await FirestoreServices.getUserDataByEmailInFS(email, dispatch);
  if (userSearched?.email === email) dispatch(usersAddStore([userSearched]));
  else return "ERROR";
  return userSearched;
}

export const getUsersByFieldRedux = (field, fieldValue, limit) => async dispatch => {
  let usersSearched = await FirestoreServices.getElementsByField("users", field, fieldValue, dispatch, limit);
  if (usersSearched !== "ERROR" && usersSearched.length > 0) dispatch(usersAddStore(usersSearched));
  else return "ERROR";
  return usersSearched;
}

export const usersGetAlbumsOfUserByIdRedux = userId => async dispatch => {
  let albumsSearched = await FirestoreServices.getElements(userId, "albums", dispatch, 100);
  if (albumsSearched === "ERROR") return albumsSearched;
  if (albumsSearched.length === 0) return "EMPTY_SEARCH";

  dispatch(albumsAddStore(albumsSearched));
  return "SUCCESS";
}

export const usersGetArtistsOfUserByIdRedux = userId => async dispatch => {
  let artistsSearched = await FirestoreServices.getElements(userId, "artists", dispatch, 100);
  if (artistsSearched === "ERROR") return artistsSearched;
  if (artistsSearched.length === 0) return "EMPTY_SEARCH";

  dispatch(artistsAddStore(artistsSearched));
  return "SUCCESS";
}

export const editUserRedux = (newUserData, passwordChanged) => async dispatch => {

  let userUpdated = await toWithOutError(passwordChanged
    ? BackendCommunication.editUserDataAndCredentialsFS(newUserData, dispatch)
    : FirestoreServices.editUserDataWithOutCredentials(newUserData, dispatch));
  if (userUpdated === "ERROR") return "ERROR";

  dispatch(usersAddStore([newUserData]));
  return "SUCCESS";
}


export const usersGetOneByIdRedux = userId => async (dispatch, getState) => {
  let userExistInStore = getState().users.find(user => user.id === userId);
  if (userExistInStore && userExistInStore.id) return userExistInStore;

  let userDoc = await FirestoreServices.getUserDocFS(userId, dispatch);
  dispatch(usersAddStore([userDoc.data()]));
  return userDoc.data();
}

export const usersDeleteByIdStore = userId => {
  return {
    type: ReducerTypes.LABEL_DELETE_WITH_ID,
    payload: userId
  };
}