import React from 'react';
import ReactDOM from 'react-dom/client';
import { store,persistor } from './store/store';
import App from './App';
import './index.css';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* PersistGate delays rendering until Redux state is rehydrated */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
