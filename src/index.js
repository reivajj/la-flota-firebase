import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { useSelector } from "react-redux";

import { store, persistor } from "redux/store/Store";
import { PersistGate } from 'redux-persist/es/integration/react';

import "assets/css/material-dashboard-react.css?v=1.9.0";
import Rutas from "Rutas";

if (module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Rutas />
      </PersistGate>
  </Provider>,
  document.getElementById("root")
);
