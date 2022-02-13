import * as ReducerTypes from 'redux/actions/Types';
const initialState = { error: false }

const ErrorHandlerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReducerTypes.ERROR_FROM_BACKEND:
      return action.payload;
    
      case ReducerTypes.ERROR_FROM_FIRESTORE:
      return action.payload;
    
    case ReducerTypes.ERROR_BASIC_MSG:
      return action.payload;

    case ReducerTypes.ERROR_CLEAN_LAST:
      return { ...state, error: false }  
    default:
      return state;
  }
};

export default ErrorHandlerReducer;