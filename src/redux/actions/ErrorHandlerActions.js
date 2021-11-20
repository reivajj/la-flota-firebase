import * as ReducerTypes from 'redux/actions/Types';

export const createBackendError = ({errorMessage, error}) => {
  return {
    type: ReducerTypes.ADD_LABELS,
    payload: { errorMessage, error}
  };
}