import * as ReducerTypes from 'redux/actions/Types';

const handleError = error => {
  if (!error.response) return { msg: error.message, error };
  if (!error.response.data) return { msg: "Error inesperado", error };
  return { msg: error.response.data.errorMsgToFrontEnd, error: error.response.data }
}

export const createBackendError = errorFromBackend => {
  let { msg, error } = handleError(errorFromBackend);
  return {
    type: ReducerTypes.ERROR_FROM_BACKEND,
    payload: { errorMessage: msg, error, isFrom: "backend" }
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