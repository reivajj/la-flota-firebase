import * as ReducerTypes from 'redux/actions/Types';

export const createBackendError = (errorMessage, error) => {
  return {
    type: ReducerTypes.ERROR_FROM_BACKEND,
    payload: { errorMessage, error, isFrom: "backend" }
  };
}

export const createFireStoreError = (errorMessage, error) => {
  return {
    type: ReducerTypes.ERROR_FROM_FIRESTORE,
    payload: { errorMessage, error, isFrom: "firestore" }
  };
}

export const cleanError = () => {
  return {
    type: ReducerTypes.ERROR_CLEAN_LAST
  }
};