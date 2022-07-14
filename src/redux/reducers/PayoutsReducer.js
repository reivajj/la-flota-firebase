import { payoutDefaultValues } from 'factory/payouts.factory';
import * as ReducerTypes from 'redux/actions/Types';

const filterPayoutsWithSameIdThanNewOne = (oldPayouts, addedPayouts) => {
  if (!Array.isArray(addedPayouts) || addedPayouts.length === 0) return oldPayouts;
  return oldPayouts.filter(payout => !addedPayouts.map(addedPayout => addedPayout.id).includes(payout.id));
}

const initialState = {
  addingPayout: payoutDefaultValues,
  payouts: []
};

const PayoutsReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.PAYOUTS_ADD:
      const oldAndUniquesPayouts = filterPayoutsWithSameIdThanNewOne(state.payouts, action.payload);
      return { addingPayout: initialState.addingPayout, payouts: [...action.payload, ...oldAndUniquesPayouts] }

    case ReducerTypes.PAYOUTS_ADD_AND_DELETE_OTHERS:
      return { addingPayout: initialState.addingPayout, payouts: action.payload }

    case ReducerTypes.PAYOUTS_DELETE_BY_ID:
      return { ...state, payouts: state.payouts.filter(payout => payout.id !== action.payload) };

    case ReducerTypes.PAYOUTS_EDIT_BY_ID:
      return { ...state, payouts: [action.payload, ...state.payouts.filter(payout => payout.id !== action.payload.id)] }

    case ReducerTypes.PAYOUTS_SIGN_OUT:
      return initialState;

    default:
      return state;
  }
};

export default PayoutsReducer;