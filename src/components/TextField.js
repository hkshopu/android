import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, Text } from 'react-native';
import styled from 'styled-components/native';

const _renderStatus = ({ type, message }) => (
  <Text style={{color: _getBorderColor(type)}}>
    { message }
  </Text>
);

const _getBorderColor = (status) => {
  switch (status) {
    case 'warning':
      return 'orange';
    case 'error':
      return 'red';
    default:
      return '#cccccc';
  }
};

const StyledTextInputContainer = styled.View`
  width: 100%;
`;

const StyledTextInput = styled.TextInput`
  border-color: ${props => _getBorderColor(props.status)};
  ${Platform.OS === 'ios' && 'border-width: 1px; border-style: solid;'}
  ${Platform.OS === 'ios' && 'background-color: #ffffff;'}
  padding: 10px;
`;

class TextField extends Component {
  constructor() {
    super();

    this._onChangeHandler = this._onChangeHandler.bind(this);
  }

  _onChangeHandler(e) {
    const { onChangeHandler } = this.props;
    if (!onChangeHandler) return false;
    this.props.onChangeHandler(e);
  }

  render() {
    const {
      placeholder,
      status,
      secureTextEntry,
      value,
    } = this.props;

    return (
      <StyledTextInputContainer>
        <StyledTextInput
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          status={status ? status.type : ''}
          onChangeText={this._onChangeHandler}
          value={value}
        />
        { status && _renderStatus(status) }
      </StyledTextInputContainer>
    );
  }
}

TextField.propTypes = {
  /** Handle text change */
  onChangeHandler: PropTypes.func.isRequired,
  /** Text field placeholder */
  placeholder: PropTypes.string,
  /** Check if text field is required to be secured */
  secureTextEntry: PropTypes.bool,
  /** Text field status */
  status: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string
  }),
  /** Text field value */
  value: PropTypes.any,
};

TextField.defaultProps = {
  secureTextEntry: false,
  placeholder: 'Enter text here',
  status: {
    type: '',
    message: '',
  },
};

export default TextField;
