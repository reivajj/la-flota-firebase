import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';

export const usersAddStore = users => {
  return {
    type: ReducerTypes.USERS_ADD,
    payload: users
  }
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