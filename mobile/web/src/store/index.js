import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import createRootReducer from './root.reducer';
import rootSaga from './root.saga';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// eslint-disable-next-line import/prefer-default-export
export const history = createBrowserHistory();

const persistConfig = {
  key: 'sample', // Change with your correct reducer key
  storage,
  // whitelist/blacklist list of reducer Array<string>
  blacklist: ['search']
}

const persistedRootReducer = persistReducer(persistConfig, createRootReducer(history))

export default () => {
  const sagaMiddleware = createSagaMiddleware();
  // eslint-disable-next-line no-undef
  const middlewares = [sagaMiddleware, routerMiddleware(history)];
  const store = createStore(
    persistedRootReducer,
    composeWithDevTools(applyMiddleware(...middlewares)),
  );
  const persistor = persistStore(store)
  sagaMiddleware.run(rootSaga);
  return { store, persistor };
};
