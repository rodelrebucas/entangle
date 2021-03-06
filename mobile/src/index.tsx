import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Main from "./screens";
import setupStore, { store, persistor } from "./store/index";
import setUpApi from "./service/api";
import "./utils/i18n";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ThemeProvider from "./context/ThemeContextProvider";

setupStore();
enableScreens();
setUpApi();

const App = () => (
  <ThemeProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <Main />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  </ThemeProvider>
);

export default App;
