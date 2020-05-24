import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react'

import { AppContainer } from './containers/appContainer';
import { AuthContextProvider } from './containers/auth/AuthContextProvider';
import setupStore, { history } from './store/index';
import setUpApi from './service/api';
import setupCentrifugo from './service/centrifugo';
import './utils/i18n';

const { store, persistor } = setupStore();
setupCentrifugo(store)
setUpApi();


const App = () => (
  <AuthContextProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedRouter history={history}>
          <AppContainer />
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  </AuthContextProvider>
);
export { store }
export default App;
