import * as ReducerTypes from 'redux/actions/Types';
// import * as FirestoreServices from 'services/FirestoreServices.js';
// import { v4 as uuidv4 } from 'uuid';
// import * as BackendCommunication from 'services/BackendCommunication.js';

export const activitiesAddStore = activities => {
  return {
    type: ReducerTypes.ACTIVITIES_ADD,
    payload: activities
  }
}

export const activitiesDeleteByIdStore = activityId => {
  return {
    type: ReducerTypes.ACTIVITIES_DELETE_BY_ID,
    payload: activityId
  }
}

export const activitiesSignOut = () => {
  return {
    type: ReducerTypes.ACTIVITIES_SIGN_OUT
  }
}