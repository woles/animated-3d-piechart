import React from 'react';
import { Provider } from 'react-redux';
import App from './App';

export default class Root extends React.Component {

  static propTypes = {
    store: React.PropTypes.shape().isRequired
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <App/>
      </Provider>
    );
  }
};
