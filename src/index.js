import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from 'react-redux';
import store from "./redux/configureStore";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>
);
