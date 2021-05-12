import React from "react";
import ReactDOM from "react-dom";

import firebase from 'firebaseConfig/firebase';
import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";
import { useSelector } from "react-redux";
import { isLoaded } from "react-redux-firebase";

import { store, persistor } from "redux/store/Store";
import { PersistGate } from 'redux-persist/es/integration/react';


import "assets/css/material-dashboard-react.css?v=1.9.0";
import Rutas from "Rutas";

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
};


const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

function AuthIsLoaded({ children }) {
  const auth = useSelector(state => state.firebase.auth);
  if (!isLoaded(auth))
    return (
      <div className="text-center">
        <div
          className="spinner-grow text-primary"
          style={{ width: "7rem", height: "7rem" }}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  return children;
}

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <AuthIsLoaded>
        <PersistGate persistor={persistor}>
          <Rutas />
        </PersistGate>
      </AuthIsLoaded>
    </ReactReduxFirebaseProvider>
  </Provider>,

  document.getElementById("root")
);
