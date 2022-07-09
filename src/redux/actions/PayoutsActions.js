import * as ReducerTypes from 'redux/actions/Types';
// import * as FirestoreServices from 'services/FirestoreServices.js';
// import { v4 as uuidv4 } from 'uuid';
// import * as BackendCommunication from 'services/BackendCommunication.js';

export const payoutsAddStore = payouts => {
  return { type: ReducerTypes.PAYOUTS_ADD, payload: payouts }
}

export const payoutDeleteByIdStore = payoutId => {
  return { type: ReducerTypes.PAYOUTS_DELETE_BY_ID, payload: payoutId }
}

export const payoutEditByIdStore = newPayout => {
  return { type: ReducerTypes.PAYOUTS_EDIT_BY_ID, payload: newPayout }
}

export const payoutsSignOut = () => {
  return { type: ReducerTypes.PAYOUTS_SIGN_OUT }
}