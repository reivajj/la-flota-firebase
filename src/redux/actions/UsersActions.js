import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import * as BackendCommunication from 'services/BackendCommunication.js';

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
  let userSearched = await FirestoreServices.getUserDataByEmailInFS(email);
  if (userSearched.email === email) dispatch(usersAddStore([userSearched]));
  return userSearched;
}

export const editUserRedux = (newUserData, passwordChanged) => async dispatch => {

  let userUpdated = await passwordChanged
    ? BackendCommunication.editUserDataAndCredentialsFS(newUserData, dispatch)
    : FirestoreServices.editUserDataWithOutCredentials(newUserData, dispatch);
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