import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import { v4 as uuidv4 } from 'uuid';

export const createLabelRedux = (label, userId) => {
  return async dispatch => {
    label.id = uuidv4();
    label.ownerId = userId;
    await FirestoreServices.createLabel(label, userId);

    return dispatch({
      type: ReducerTypes.ADD_LABELS,
      payload: [ label ]
    });
  }
}