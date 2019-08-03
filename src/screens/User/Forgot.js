import React, { Component } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import TextField from '../../components/FloatingTextField';
import { colors } from '../../theme';

const ForgotFormContainer = styled.View`
  flex: 1;
  padding-horizontal: 10;
  background-color: ${colors.white};
`;

const ForgotContainerHeader = styled.Text`
  font-size: 20;
  padding-vertical: 10;
`;

const ForgotFormInputContainer = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const ForgotFormSubmitButton = styled.TouchableOpacity`
  border: 1px solid #cccccc;
  padding: 10px 20px;
  width: 100%;
  align-items: center;
  background-color: #cccccc;
  margin-top: 20px;
`;

export default class Join extends Component {
  static navigationOptions = {
    title: 'Forgot Password'
  };

  render() {
    return (
      <ForgotFormContainer>
        <ForgotContainerHeader>Reset Password</ForgotContainerHeader>
        <ForgotFormInputContainer>
          <TextField
            label="Email"
          />
          <ForgotFormSubmitButton>
            <Text>Submit</Text>
          </ForgotFormSubmitButton>
        </ForgotFormInputContainer>
      </ForgotFormContainer>
    );
  }
}
