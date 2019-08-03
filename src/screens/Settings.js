import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../theme';
import Spinner from '../components/Spinner';
import Axios from 'axios';
import { apis } from '../constants/apis';

import { connect } from 'react-redux';
import { logoutUser } from '../reducers/auth';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const height = width * 0.45;

const SettingsContainer = styled.View`
flex: 1;
  background-color: ${colors.white};
`;

const Section = styled.TouchableOpacity`
  background-color: ${colors.white};
  padding: 10px;
    border-bottom-width: 1px;
    border-style: solid;
    border-bottom-color: ${colors.gold};
  flex-direction: row;
`;

const SectionTitle = styled.View`
background-color: ${colors.gray};
padding: 10px;
`;

const SectionSubTitle = styled.Text`
  flex: 1;
  text-align: right;
`;

const SectionLeft = styled.Text`
  text-align: left;
  width: 25px;
`;

const ImageContainer = styled.Image`
  width: ${width};
  height: ${height};
  position: absolute;
  bottom: 0px;
  z-index: 0;
`;


class Settings extends Component {
  static navigationOptions = {
    title: 'Settings',
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
    }

    this._logout = this._logout.bind(this);
    this._redirect = this._redirect.bind(this);
    this._showAlert = this._showAlert.bind(this);
  }

  async _logout() {
    this.setState({ isLoading: true });
    Axios.get(apis.urls.user.logout, {
      headers: {
        token: this.props.screenProps.user.token,
      }
    })
      .then((response) => {
        // this.setState({
        //   isLoading: false,
        // }, () => {
        this.props.onLogout();
        this._redirect();
        // });
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        this.setState({
          isLoading: false,
        });
        Alert.alert(
          'Something Went Wrong',
          error.response.data.message,
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        );
      });
  }

  _redirect() {
    this.props.navigation.dispatch(
      {
        type: 'Navigation/NAVIGATE',
        routeName: 'Main',
        action: {
          type: 'Navigation/NAVIGATE',
          routeName: 'ProductList',
        },
        params: {
          callback: true,
        }
      }
    );

  }

  _showAlert() {
    Alert.alert('', 'Are you sure you want to log out?', [
      { text: 'Cancel', onPress: () => { } },
      { text: 'Logout', onPress: () => { this._logout() } }
    ])
  }

  render() {
    const { screenProps } = this.props;

    return (
      <SettingsContainer>
        <ImageContainer source={require("../img/image_back_1.jpg")} />

        {
          screenProps.user.token ?
            <View>
              <SectionTitle>
                <Text style={styles.titleText}>Account Settings</Text>
              </SectionTitle>
              <Section>
                <SectionLeft>
                  <FontAwesome name="lock" size={20} color={colors.turquoise} />
                </SectionLeft>
                <Text style={styles.baseText}> Change Password </Text>
              </Section>
              <Section>
                <SectionLeft>
                  <FontAwesome name="credit-card" size={20} color={colors.turquoise} />
                </SectionLeft>
                <Text style={styles.baseText}> Payment Settings </Text>
              </Section>
              <Section>
                <SectionLeft>
                  <FontAwesome name="globe" size={20} color={colors.turquoise} />
                </SectionLeft>
                <Text style={styles.baseText}> Language </Text>
              </Section>

              <SectionTitle>
                <Text></Text>
              </SectionTitle>
              <Section onPress={() => this._showAlert()}>
                <SectionLeft>
                  <FontAwesome name="power-off" size={20} color={colors.turquoise} />
                </SectionLeft>
                <Text style={styles.baseText}> Logout </Text>
              </Section>
              <Section>
                <SectionLeft>
                  <FontAwesome name="user-times" size={20} color={colors.turquoise} />
                </SectionLeft>
                <Text style={styles.baseText}> Disable Account </Text>
              </Section>
            </View>
            :
            <View>
              <SectionTitle>
                <Text></Text>
              </SectionTitle>
              <Section>
                <SectionLeft>
                  <FontAwesome name="globe" size={20} color={colors.turquoise} />
                </SectionLeft>
                <Text style={styles.baseText}> Language </Text>
              </Section>
            </View>
        }
        <Spinner isVisible={this.state.isLoading} />
      </SettingsContainer>
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
    color: colors.white,
  },
});

const mapStateToProps = state => {
  return {
    user: state.status,
    cart: state.status,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogout: (user) => {
      dispatch(logoutUser(user))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);