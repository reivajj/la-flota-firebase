import * as ReducerTypes from 'redux/actions/Types';
import { createUserPayoutInDbAndFS, deletePayoutInDbAndFS, updateUserPayoutInDbAndFS } from 'services/BackendCommunication';
import { getPayIdField } from 'utils/payouts.utils';
import { v4 as uuidv4 } from 'uuid';
// import * as FirestoreServices from 'services/FirestoreServices.js';
// import * as BackendCommunication from 'services/BackendCommunication.js';

export const payoutsAddStore = payouts => {
  return { type: ReducerTypes.PAYOUTS_ADD, payload: payouts }
}

export const payoutsAddAndDeleteOthersStore = payouts => {
  return { type: ReducerTypes.PAYOUTS_ADD_AND_DELETE_OTHERS, payload: payouts }
}


export const payoutDeleteByIdStore = payoutId => {
  return { type: ReducerTypes.PAYOUTS_DELETE_BY_ID, payload: payoutId }
}

export const payoutEditByIdStore = newPayout => {
  return { type: ReducerTypes.PAYOUTS_EDIT_BY_ID, payload: newPayout }
}

export const payoutCreateRequestRedux = newPayout => async dispatch => {

  delete newPayout.stats;
  newPayout.id = uuidv4(); newPayout.status = "REQUESTED";
  newPayout.transferTotalUsd = parseFloat(newPayout.transferTotalUsd);
  newPayout.alreadyPaidUsd = parseFloat(newPayout.alreadyPaidUsd);
  newPayout.historicTotalUsd = parseFloat(newPayout.historicTotalUsd);
  newPayout.requestDate = new Date().toISOString().split('T')[0];
  console.log("NEW PAYOUT: ", newPayout);
  let resultCreatePayout = await createUserPayoutInDbAndFS(newPayout, dispatch);
  if (resultCreatePayout === "ERROR") return "ERROR";

  dispatch(payoutsAddStore([newPayout]));
  return "success";
}

export const payoutCompleteRequestRedux = (updatedPayout, payId) => async dispatch => {
  let sendNotification = true;
  updatedPayout.status = "COMPLETED";
  updatedPayout.alreadyPaidUsd = parseFloat(updatedPayout.alreadyPaidUsd) + parseFloat(updatedPayout.transferTotalUsd);
  updatedPayout.transferDate = new Date().toISOString().split('T')[0];
  updatedPayout.transferMonth = updatedPayout.transferDate.slice(0, 7) + '-01';

  if (!updatedPayout.cupon) {
    let payIdField = getPayIdField(updatedPayout);
    updatedPayout[payIdField] = payId;
  }

  let resultCreatePayout = await updateUserPayoutInDbAndFS(updatedPayout, sendNotification, dispatch);
  if (resultCreatePayout === "ERROR") return "ERROR";

  dispatch(payoutEditByIdStore(updatedPayout));
  return "success";
}

export const payoutEditRedux = updatedPayout => async dispatch => {
  let sendNotification = false;
  let resultCreatePayout = await updateUserPayoutInDbAndFS(updatedPayout, sendNotification, dispatch);
  if (resultCreatePayout === "ERROR") return "ERROR";

  dispatch(payoutEditByIdStore(updatedPayout));
  return "success";
}

export const payoutDeleteRedux = payoutId => async dispatch => {
  let resultDeletePayout = await deletePayoutInDbAndFS(payoutId);
  if (resultDeletePayout === "ERROR") return "ERROR";

  dispatch(payoutDeleteByIdStore(payoutId));
  return "success";
}

export const payoutsSignOut = () => {
  return { type: ReducerTypes.PAYOUTS_SIGN_OUT }
}