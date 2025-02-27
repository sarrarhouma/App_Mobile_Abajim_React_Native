import React from "react";
import { Provider } from "react-redux";
import store from "./src/reducers/store";  // ✅ Import store from store.js
import AppNavigator from "./src/navigation/AppNavigator";
import SettingsNavigator from "./src/navigation/SettingsNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
