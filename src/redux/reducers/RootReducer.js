import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import AuthReducer from "redux/reducers/AuthReducer";
import UserDataReducer from "redux/reducers/UserDataReducer";
import SignUpReducer from "redux/reducers/SignUpReducer";

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['userData', 'signUpInfo'] 
}

// Si quiero agregar mas a la white list, osea, los reducers que quiero persistir en el storage, 
// lo agrego a la whitelist... ['auth', 'otro_reducer']

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  auth: AuthReducer,
  userData: UserDataReducer,
  signUpInfo: SignUpReducer
});

export default persistReducer(persistConfig, rootReducer);
