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
// ya29.GlxcBbsPtOhAxgkppERTGU1A1Y6b4Q20MZKFJhTuSOf7v4IgSY4YX5iV9zfVXw0y-pomVrCFTNZ93UeUrCzpyHc4_x7enJOaMEuSmFSNFq2-1C4v9sJ8tU8M9yqplw
