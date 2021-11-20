import { ERROR_FROM_BACKEND } from "redux/actions/Types";

const initialState = { error: false }

const ErrorHandlerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ERROR_FROM_BACKEND:
      return { error: true, errorMessage: action.payload.errorMessage };    
    default:
      return state; 
  }
};

export default ErrorHandlerReducer;