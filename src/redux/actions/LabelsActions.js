import * as ReducerTypes from 'redux/actions/Types';
import * as FirestoreServices from 'services/FirestoreServices.js';
import { v4 as uuidv4 } from 'uuid';
import * as BackendCommunication from 'services/BackendCommunication.js';

export const labelsAddStore = labels => {
  return {
    type: ReducerTypes.ADD_LABELS,
    payload: labels
  }
}

export const createLabelRedux = (label, userId) => async dispatch => {

  let labelFromThirdWebApi = await BackendCommunication.createLabelFuga(label.name, dispatch);
  if (labelFromThirdWebApi === "ERROR") return "ERROR";

  label.id = uuidv4();
  label.fugaId = labelFromThirdWebApi.data.response.id;
  label.ownerId = userId;
  label.whenCreatedTS = new Date().getTime();
  label.lastUpdateTS = label.whenCreatedTS;

  await FirestoreServices.createElementFS(label, label.id, userId, "labels", "totalLabels", 1, dispatch);

  dispatch({
    type: ReducerTypes.ADD_LABELS,
    payload: [label]
  });

  return label;
}

export const deleteLabelRedux = (labelFugaId, labelId, userId) => async dispatch => {
  let deleteResponse = await BackendCommunication.deleteLabelFuga(labelFugaId, dispatch);
  if (deleteResponse === "ERROR") return "ERROR";

  await FirestoreServices.deleteElementFS(labelId, userId, "labels", "totalLabels", -1, dispatch);

  dispatch({
    type: ReducerTypes.LABEL_DELETE_WITH_ID,
    payload: labelId
  });

  return "SUCCESS";
}