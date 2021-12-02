import * as ReducerTypes from 'redux/actions/Types';

export const createBackendError = ({errorMessage, error}) => {
  return {
    type: ReducerTypes.ERROR_FROM_BACKEND,
    payload: { errorMessage, error}
  };
}