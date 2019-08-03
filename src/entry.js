import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import store from './store';
import AppDependencyLoader from "./utils/AppDependencyLoader";
import Main from './navigation';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistStore(store)}>
          <AppDependencyLoader>
            <Main />
          </AppDependencyLoader>
        </PersistGate>
      </Provider>
    );
  }
}
