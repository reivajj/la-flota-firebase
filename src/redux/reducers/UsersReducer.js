import * as ReducerTypes from 'redux/actions/Types';

const filterUsersWithSameIdThanNewOne = (oldUsers, addedUsers) => {
  if (!addedUsers) return oldUsers;
  return addedUsers.filter(user => !oldUsers.map(oldUser => oldUser.id).includes(user.id))
}

const editAndAddUser = (oldUsers, editedFieldsFromUser) => {
  return oldUsers.map(oldUser => {
    if (oldUser.id === editedFieldsFromUser.id) return { ...oldUser, ...editedFieldsFromUser };
    else return oldUser;
  })
}

const initialState = [];

const UsersReducer = (state = initialState, action) => {
  switch (action.type) {

    case ReducerTypes.USERS_ADD:
      const newUsers = filterUsersWithSameIdThanNewOne(state, action.payload);
      return [...state, ...newUsers]

    case ReducerTypes.USERS_EDIT_BY_ID:
      return editAndAddUser(state, action.payload);

    case ReducerTypes.USERS_DELETE_BY_ID:
      return state.filter(user => user.id !== action.payload);

    case ReducerTypes.USERS_SIGN_OUT:
      return initialState;

    default:
      return state;
  }
};

export default UsersReducer;