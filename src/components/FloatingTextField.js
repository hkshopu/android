import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StatusBar, Animated, Platform } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const FloatingLabelInputContainer = styled.View`
  width: 90%;
  position: relative;
`;

const TextInput = styled.TextInput`
  ${Platform.OS === 'ios' && 'border-bottom-width: 1;'}
  ${Platform.OS === 'ios' && 'border-bottom-color: #555555;'}
  ${Platform.OS === 'ios' ? 'height: 26px' : 'height: 40px;'}
  ${props => props.toggableSecureTextEntry && 'padding-right: 35px;'}
  font-size: 16px;
  color: ${colors.gray};
`;

const ClickableIcon = styled(Ionicons)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 25px;
  color: ${colors.gray};
`;

class FloatingLabelInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
    };

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this._animatedIsFocused = new Animated.Value(props.value === '' ? 0 : 1);
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 200,
    }).start();
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  render() {
    const { label, ...props } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 5,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.gray, colors.turquoise],
      }),
    };
    return (
      <View style={{ paddingTop: 18 }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
          style={{ paddingLeft: 10, borderBottomColor: this.state.isFocused? colors.turquoise : colors.gray, borderBottomWidth: 1, }}
        />
      </View>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      secureTextEntry: props.secureTextEntry
    };
  }

  handleTextChange = (newText) => {
    const { onChangeHandler } = this.props;

    this.setState({ 
      value: newText 
    }, () => {
      if (typeof onChangeHandler === 'function') {
        onChangeHandler(this.state);
      }
    });
  };

  handleSecureTextToggle = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry
    });
  };

  handleBlur = () => {
    const { onBlur } = this.props;

    if (typeof onBlur === 'function') {
      onBlur(this.state);
    }
  }

  render() {
    const { secureTextEntry } = this.state;
    const { 
      label,
      placeholder,
      toggableSecureTextEntry,
    } = this.props;

    return (
      <FloatingLabelInputContainer>
        <StatusBar hidden />
        <FloatingLabelInput
          label={label}
          secureTextEntry={secureTextEntry}
          toggableSecureTextEntry={toggableSecureTextEntry}
          placeholder={placeholder}
          value={this.state.value}
          onChangeText={this.handleTextChange}
          onBlur={this.handleBlur}
        />
        {
          toggableSecureTextEntry &&
            <ClickableIcon onPress={this.handleSecureTextToggle} name={secureTextEntry ? 'md-eye-off' : 'md-eye' }/>
        }
      </FloatingLabelInputContainer>
    );
  }
}

App.propTypes = {
  /** displays label for the text input */
  label: PropTypes.string,
  /** handles text change */
  onChangeHandler: PropTypes.func,
  /** makes text field secure by masking characters */
  secureTextEntry: PropTypes.bool,
  /** toggles secureTextEntry by displaying a toggable icon */
  toggableSecureTextEntry: PropTypes.bool,
  onBlur: PropTypes.func,
}

App.defaultProps = {
  label: 'Text input',
  secureTextEntry: false,
  toggableSecureTextEntry: false,
}

export default App;
