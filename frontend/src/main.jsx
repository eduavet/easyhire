import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { Route, Switch, BrowserRouter } from 'react-router-dom';
import App from './react/components/App.jsx';
import './assets/styles/stylus/index.styl';

import store from './redux/store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);
