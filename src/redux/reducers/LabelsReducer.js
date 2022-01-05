import * as ReducerTypes from 'redux/actions/Types';

const checkNewLabels = (oldLabels, labels) => {
  return labels.filter(label => !oldLabels.map(oldLabel => oldLabel.id).includes(label.id))
}

const initialState = {
  labels: []
}

const LabelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReducerTypes.ADD_LABELS:
      const newLabels = checkNewLabels(state.labels, action.payload);
      return { ...state, labels: [...state.labels, ...newLabels] };
    case ReducerTypes.LABEL_DELETE_WITH_ID:
      return { ...state, labels: state.labels.filter(l => l.id !== action.payload) };
    case ReducerTypes.LABELS_SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export default LabelsReducer;