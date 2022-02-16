import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";

import { ReactReduxFirebaseProvider } from "react-redux-firebase";

import { store, persistor } from "redux/store/Store";
import { PersistGate } from 'redux-persist/es/integration/react';

import "assets/css/material-dashboard-react.css?v=1.9.0";
import Rutas from "Rutas";
import firebase from './firebaseConfig/firebase.js';

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: false,
};


const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};


if (module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <PersistGate persistor={persistor}>
        <Rutas />
      </PersistGate>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);
