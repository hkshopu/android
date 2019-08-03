import React, { Component } from 'react';
import { AppLoading } from 'expo';
import FontLoader from './FontLoader';

export default class AppDependencyLoader extends Component {
  constructor() {
    super();

    this.state = {
      fontLoaded: false,
    };

    this.updateLoadedDependencies = this.updateLoadedDependencies.bind(this);
  }

  updateLoadedDependencies(key, value) {
    this.setState({
      [`${key}Loaded`]: value
    });
  }

  getLoader() {
    return (
      <React.Fragment>
        <FontLoader
          updateLoadedDependencies={this.updateLoadedDependencies}
        />
        <AppLoading/>
      </React.Fragment>
    )
  }

  render() {
    const { fontLoaded } = this.state;

    if (!fontLoaded) {
      return this.getLoader();
    }

    return this.props.children;
  }
}
