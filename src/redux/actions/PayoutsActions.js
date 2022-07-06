import * as ReducerTypes from 'redux/actions/Types';
// import * as FirestoreServices from 'services/FirestoreServices.js';
// import { v4 as uuidv4 } from 'uuid';
// import * as BackendCommunication from 'services/BackendCommunication.js';

export const payoutsAddStore = payouts => {
  return { type: ReducerTypes.PAYOUTS_ADD, payload: payouts }
}

export const payoutDeleteByIdStore = activityId => {
  return { type: ReducerTypes.PAYOUTS_DELETE_BY_ID, payload: activityId }
}

export const payoutEditByIdStore = activityId => {
  return { type: ReducerTypes.PAYOUTS_EDIT_BY_ID, payload: activityId }
}

export const payoutsSignOut = () => {
  return { type: ReducerTypes.PAYOUTS_SIGN_OUT }
}