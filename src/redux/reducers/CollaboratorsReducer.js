import * as ReducerTypes from 'redux/actions/Types';

const filterCollaboratorsWithSameIdThanNewOne = (oldCollaborators, addedCollaborators) => {
  if (!addedCollaborators) return oldCollaborators;
  return addedCollaborators.filter(artist => !oldCollaborators.map(oldCollaborator => oldCollaborator.id).includes(artist.id))
}

const initialState = [];

const CollaboratorsReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.ADD_COLLABORATORS:
      const newCollaborators = filterCollaboratorsWithSameIdThanNewOne(state, action.payload);
      return [...state, ...newCollaborators]

    case ReducerTypes.COLLABORATORS_SIGN_OUT:
      return initialState;

    default:
      return state;
  }
};

export default CollaboratorsReducer;