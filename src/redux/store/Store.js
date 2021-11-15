import { createStore, applyMiddleware, compose } from 'redux';
import RootReducer from 'redux/reducers/RootReducer';
import thunk from "redux-thunk";
import { persistStore } from "redux-persist";
import { createLogger } from 'redux-logger'
// Para darle comportamiento (OPTIONS) especifico al logger, ver documentacion: https://www.npmjs.com/package/redux-logger

const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 10 })) || compose;

const logger = createLogger({
  // ...options
});

export const store = createStore(
  RootReducer,
  composeEnhancers(
    applyMiddleware(thunk, logger)
  )
);

export const persistor = persistStore(store);

