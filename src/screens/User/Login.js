import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import styled from 'styled-components/native';
import TextField from '../../components/FloatingTextField';
import { colors } from '../../theme';
import Axios from 'axios';
import { apis } from '../../constants/apis';
import Spinner from '../../components/Spinner';

import { connect } from 'react-redux';
import { loginUser, addToCart, searchHistoryAdd } from '../../reducers/auth';

const StyledFormContainer = styled.View`
  flex: 1;
  padding-horizontal: 10;
  background-color: ${colors.white};
`;

const StyledFormPanel = styled.View`
  flex: 1;
  margin-top: 25%;
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled.TouchableOpacity`
  margin-top: 30;
  width: 50%;
  padding: 10px;
  align-items: center;
  background-color: ${colors.turquoise};
  border-radius: 5px;
`;

const StyledButton2 = styled.TouchableOpacity`
margin-top: 5;
width: 50%;
padding: 10px;
align-items: center;
background-color: ${colors.gold};
border-radius: 5px;
`;

const StyledBottomPanel = styled.View`
  flex: 1;
  align-items: center;
  margin-top: 5px;
`;

const StyledBottomPanelForgot = styled.TouchableOpacity`
  margin-top: 25px;
`;

const StyledBottomPanelSignup = styled.TouchableOpacity`
  margin-top: 10px;
`;

const Action = styled.TouchableOpacity`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

class Login extends Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      status: {},
      numberOfCartItem: 0,
      search: 'Sample Search',
      isLoading: false,
      state: false,
      isRequiredEmail: false,
      isRequiredPassword: false,
    }

    this._handleTextChange = this._handleTextChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._redirect = this._redirect.bind(this);
  }

  componentWillUnmount() {
    this.props.navigation && this.props.navigation.state.params.onGoBack();
  }

  _handleTextChange(type, value) {
    this.setState({
      [type]: value,
    });
  }

  _handleSubmit() {
    if (this.state.email.value && this.state.password.value) {
      this.setState({ 
        isLoading: true,
        isRequiredEmail: false,
        isRequiredPassword: false,
       });

      Axios.post(apis.urls.user.login, {
        login: this.state.email.value,
        password: this.state.password.value,
      }, {
          headers: {
            token: apis.headerLogin,
          }
        })
        .then((response) => {
          this.setState({
            isLoading: false,
            status: response.data,
          }, () => {
            this.props.onLogin(this.state.status);
            this.props.onAddToCart(this.state.status.user.cart_items);

            this._redirect(response.data)
          });
        })
        .catch((error) => {
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
    } else {
      this.setState({
        // isRequiredEmail: ((this.state.email.value == undefined || this.state.email.value == '') ? true : false),
        // isRequiredPassword: ((this.state.password.value == undefined || this.state.password.value == '') ? true : false),
        isRequiredEmail: (!this.state.email.value ? true : false),
        isRequiredPassword: (!this.state.password.value ? true : false),
      });
    }
  }

  _redirect() {
    this.props.navigation.dispatch(
      {
        type: 'Navigation/NAVIGATE',
        routeName: 'Main',
        action: {
          type: 'Navigation/NAVIGATE',
          routeName: 'ProductList',
          params: {
            reload: true,
          }
        },
      }
    );
  }

  //  _storeData = async (credentials, cb) => {
  //    try {
  //      await AsyncStorage.multiSet([
  //      [apis.keys.token, credentials.token]
  //      ,[apis.keys.user, credentials.user_id.toString()]
  //      ], cb(true));
  //    } catch (error) {
  //      // Error saving data
  //      console.log(error);
  //    }
  //  }

  render() {
    const { navigation } = this.props;

    return (
      <StyledFormContainer>
        <Spinner isVisible={this.state.isLoading} />

        <StyledFormPanel>
          <TextField
            label="Email/Phone/Username"
            onChangeHandler={value => this._handleTextChange('email', value)}
          />
          {
            this.state.isRequiredEmail && <Text style={styles.errorText}>You can't leave this empty</Text>
          }

          <TextField
            secureTextEntry
            toggableSecureTextEntry={true}
            label="Password"
            onChangeHandler={value => this._handleTextChange('password', value)}
          />
          {
            this.state.isRequiredPassword && <Text style={styles.errorText}>You can't leave this empty</Text>
          }

          <StyledButton onPress={this._handleSubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </StyledButton>
          <Text style={[styles.baseText, {marginTop: 5}]}> Or </Text>
          <StyledButton2 onPress={() => navigation.navigate('Join')}>
            <Text style={styles.buttonText}>Sign Up Here</Text>
          </StyledButton2>

          <StyledBottomPanel>
            <StyledBottomPanelForgot onPress={() => navigation.navigate('Forgot')}>
              <Text style={styles.titleText}>
                Forgot Password?
                </Text>
            </StyledBottomPanelForgot>
          </StyledBottomPanel>
        </StyledFormPanel>

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
  errorText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.red,
  },
});

const mapStateToProps = state => {
  return {
    user: state.status,
    cart: state.status,
    search: state.status,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (user) => {
      dispatch(loginUser(user))
    },
    onAddToCart: (cart) => {
      dispatch(addToCart(cart))
    },
    onSearch: (search) => {
      dispatch(searchHistoryAdd(search))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);