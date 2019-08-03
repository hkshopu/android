import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MaterialIcons from '../../node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf';
import FontAwesome from '../../node_modules/@expo/vector-icons/fonts/FontAwesome.ttf';
import { Font, Button } from 'expo';

class FontLoader extends PureComponent {
  async componentDidMount() {
    try {
      await Font.loadAsync({
        'Material Icons': MaterialIcons,
		'FontAwesome': FontAwesome
      });

      this.props.updateLoadedDependencies('font', true);
      
    } catch(e) {
      console.error('Could not load fonts', e);
    }
  }

  render() {
    return null;
  }
}

FontLoader.propTypes = {
  updateLoadedDependencies: PropTypes.func.isRequired
};

export default FontLoader;
