import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { useSelector } from "react-redux";

import { store, persistor } from "redux/store/Store";
import { PersistGate } from 'redux-persist/es/integration/react';


import "assets/css/material-dashboard-react.css?v=1.9.0";
import Rutas from "Rutas";

// const isLoaded = (auth) => {
  // console.log("Auth: ", auth);
  // return Boolean(auth.email);
// }

function AuthIsLoaded({ children }) {
  const auth = useSelector(state => state.auth);
  if (false)
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
//
if (module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <Provider store={store}>
    <AuthIsLoaded>
      <PersistGate persistor={persistor}>
        <Rutas />
      </PersistGate>
    </AuthIsLoaded>
  </Provider>,

  document.getElementById("root")
);
