import React from 'react';
import ReactDOM from 'react-dom';

import configureStore from './store/config';
import Root from './containers/Root';

const target = document.getElementById('root');

const store = configureStore();

ReactDOM.render(
  <Root store={store}/>,
  target
);
