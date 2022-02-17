import { combineReducers } from "redux";

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import AuthReducer from "redux/reducers/AuthReducer";
import UserDataReducer from "redux/reducers/UserDataReducer";
import SignUpReducer from "redux/reducers/SignUpReducer";
import ArtistsReducer from "redux/reducers/ArtistsReducer";
import LabelsReducer from "redux/reducers/LabelsReducer";
import AlbumsReducer from "redux/reducers/AlbumsReducer";
import TracksReducer from "redux/reducers/TracksReducer";
import ErrorHandlerReducer from "redux/reducers/ErrorHandlerReducer";
import ArtistsInvitedReducer from "redux/reducers/ArtistsInvitedReducer";
import CollaboratorsReducer from "redux/reducers/CollaboratorsReducer";
import ActivitiesReducer from "redux/reducers/AcitivitiesReducer";

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['userData', 'signUpInfo', 'artists', 'labels', 'albums', 'artistsInvited', 'collaborators', 'activities', 'auth']
}

// Si quiero agregar mas a la white list, osea, los reducers que quiero persistir en el storage, 
// lo agrego a la whitelist... ['auth', 'otro_reducer']

const rootReducer = combineReducers({
  auth: AuthReducer,
  userData: UserDataReducer,
  signUpInfo: SignUpReducer,
  artists: ArtistsReducer,
  labels: LabelsReducer,
  albums: AlbumsReducer,
  tracks: TracksReducer,
  artistsInvited: ArtistsInvitedReducer,
  collaborators: CollaboratorsReducer,
  activities: ActivitiesReducer,
  errorHandler: ErrorHandlerReducer
});

export default persistReducer(persistConfig, rootReducer);
