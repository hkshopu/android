import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import TextField from '../../components/FloatingTextField';
import { colors } from '../../theme';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const height = width * 0.4;
const logoWidth = width * 0.5;
const logoHeight = width * 0.42;

const ImageContainer = styled.Image`
	  width: ${width};
	  height: ${height};
	`;

const LogoContainer = styled.Image`
      width: ${logoWidth};
      height: ${logoHeight};
	`;

const StyledFormContainer = styled.View`
  flex: 1;
  padding-horizontal: 10;
  background-color: ${colors.white};
`;

const StyledUpperPanel = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledFormPanel = styled.View`
  flex: 1;
  margin-top: 10;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled.TouchableOpacity`
  margin-top: 50;
  width: 75%;
  padding: 10px;
  align-items: center;
  background-color: ${colors.turquoise};
  border-radius: 5px;
`;

const StyledButton2 = styled.TouchableOpacity`
  margin-top: 20;
  width: 75%;
  padding: 10px;
  align-items: center;
  background-color: ${colors.gold};
  border-radius: 5px;
`;

const Action = styled.TouchableOpacity`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export default class UserWelcome extends Component {
  constructor() {
    super();
  }

  render() {
    const { navigation } = this.props;

    return (
      <StyledFormContainer>
        <TouchableOpacity style={{ marginTop: 40, marginLeft: 15, }} onPress={() => navigation.goBack(null)}>
          <Ionicons name="md-arrow-back" size={25} color={colors.gray} />
        </TouchableOpacity>

        <StyledFormPanel>
          <LogoContainer source={require("../../img/logo.png")} />

          <StyledButton onPress={() => navigation.navigate('Login', {onGoBack: () => navigation.goBack(null) })}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </StyledButton>

          <StyledButton2 onPress={() => navigation.navigate('Join', {onGoBack: () => navigation.goBack(null) })}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </StyledButton2>
        </StyledFormPanel>
        <View>
          <ImageContainer source={require("../../img/image_back_1.jpg")} />
        </View>
      </StyledFormContainer>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.gray,
  },
  buttonText: {
    fontFamily: 'Roboto',
    padding: 4,
    color: colors.white,
  },
  titleText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.turquoise,
    textDecorationLine: 'underline',
  },
  subText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.gold,
    textDecorationLine: 'underline',
  },
});
