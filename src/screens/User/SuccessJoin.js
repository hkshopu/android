import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import TextField from '../../components/FloatingTextField';
import { colors } from '../../theme';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const height = width * 0.4;
const logoWidth = width * 0.4;
const logoHeight = width * 0.32;

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
  width: 50%;
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

export default class SuccessJoin extends Component {
  constructor() {
    super();
  }

  componentWillUnmount() {
    this.props.navigation && this.props.navigation.state.params.onGoBack();
  }

    render() {
      const { navigation } = this.props;

      return (
        <StyledFormContainer>
          <StyledFormPanel>
            <LogoContainer source={require("../../img/sign-up-success.png")} />
            <View style={{width: '80%', alignItems: 'center', marginTop: 20 }}>
              <Text style={styles.titleText}> Sign-up Success </Text>
              <Text style={[styles.baseText, {marginTop: 10}]} > Please check your email inbox to finish the verification step. </Text>
            </View>
            <StyledButton onPress={() => navigation.navigate('Login', {onGoBack: () => navigation.goBack(null) })}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </StyledButton>
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
    textAlign: 'center',
  },
  buttonText: {
    fontFamily: 'Roboto',
    padding: 4,
    color: colors.white,
  },
  titleText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: colors.gray,
    fontWeight: 'bold',
  },
  subText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.gold,
    textDecorationLine: 'underline',
  },
});
