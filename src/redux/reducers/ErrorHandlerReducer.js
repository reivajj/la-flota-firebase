import { ERROR_FROM_BACKEND, ERROR_FROM_FIRESTORE } from "redux/actions/Types";
import { ERROR_CLEAN_LAST } from '../actions/Types';

const initialState = { error: false }

const ErrorHandlerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ERROR_FROM_BACKEND:
      return action.payload;
    case ERROR_FROM_FIRESTORE:
      return action.payload;
    case ERROR_CLEAN_LAST:
      return { ...state, error: false }  
    default:
      return state;
  }
};

export default ErrorHandlerReducer;