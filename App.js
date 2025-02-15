// import React from 'react';
// // import { Provider } from "react-redux";
// // import {store} from "./src/redux/store"; 
// import AppNavigator from './src/navigation/AppNavigator';


// const App = () => {
//   return <AppNavigator />;
// };

// export default App;


import React from "react";
import { Provider } from "react-redux";
import store from "./src/reducers/store";  // ✅ Import store from store.js
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
