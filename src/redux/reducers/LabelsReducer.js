import * as ReducerTypes from 'redux/actions/Types';

const initialState = {
  labels: []
}

const LabelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReducerTypes.ADD_LABELS:
      return { ...state, labels: [...state.labels, ...action.payload] };
    case ReducerTypes.LABELS_SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export default LabelsReducer;