import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import TextField from '../components/FloatingTextField';
import { colors } from '../theme';

const JoinContainer = styled.View`
  flex: 1;
`;

const JoinContainerHeader = styled.Text`
  font-size: 15;
  background-color: ${colors.gray};
  padding: 10px;
`;

const JoinFormInputContainer = styled.View`
  align-items: flex-start;
  padding: 0 10px;
`;

const JoinFormSubmitButton = styled.TouchableOpacity`
  border: 1px solid #cccccc;
  padding: 10px 20px;
  width: 95%;
  align-items: center;
  background-color: #cccccc;
  margin: 20px 10px 0;
`;

class JoinForm extends Component {
  render() {
    const {
      nickname,
      email,
      onSubmitHandler,
    } = this.props;

    return (
      <JoinContainer>
      </JoinContainer>
    );
  }
}

JoinForm.propTypes = {
  /** on form submit handler */
  onSubmitHandler: PropTypes.func,
  /** user nickname */
  nickname: PropTypes.string,
  /** user email */
  email: PropTypes.string
};

export default JoinForm;
