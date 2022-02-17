import * as ReducerTypes from 'redux/actions/Types';

const checkNewActivities = (oldActivities, activities) => {
  return activities.filter(activity => !oldActivities.map(oldActivity => oldActivity.id).includes(activity.id))
}

const initialState = [];

const ActivitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ReducerTypes.ACTIVITIES_ADD:
      const newActivities = checkNewActivities(state, action.payload);
      return [...state, ...newActivities]

    case ReducerTypes.ACTIVITIES_DELETE_BY_ID:
      return state.filter(a => a.id !== action.payload);

    case ReducerTypes.ACTIVITIES_SIGN_OUT:
      return initialState;
    default:
      return state;
  }
};

export default ActivitiesReducer;