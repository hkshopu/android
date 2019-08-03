import React, { Component } from 'react';
import { Text, Picker, View, TextInput, Dimensions, StyleSheet, Alert } from 'react-native';
import styled from 'styled-components/native';
import TextField from '../../components/FloatingTextField';
import { colors } from '../../theme';
import DatePicker from 'react-native-datepicker';
import Axios from 'axios';
import { apis } from '../../constants/apis';
import Spinner from '../../components/Spinner';

const { width } = Dimensions.get('window');
const height = width * 0.45;

const ImageContainer = styled.Image`
  width: ${width};
  height: ${height};
  position: absolute;
  bottom: 0px;
  z-index: 0;
`;

const JoinFormContainer = styled.ScrollView`
  flex-grow: 0;
`;

const JoinContainerHeader = styled.Text`
  font-family: 'Roboto';
  font-size: 15;
  background-color: ${colors.gray};
  padding: 10px;
  color: ${colors.white};
`;

const JoinFormInputContainer = styled.View`
  align-items: center;
`;

const JoinFormSubmitButton = styled.TouchableOpacity`
  padding: 10px 20px;
  width: 50%;
  align-items: center;
  background-color: ${colors.gold};
  border-radius: 5px;
  margin: 30px auto;
`;

const PickerCard = styled.View`
border-color: ${colors.turquoise};
border-width: 1;
height: 30;
width: 100%;
border-radius: 5;
`;

export default class Join extends Component {
  static navigationOptions = {
    title: 'Sign Up'
  };

  constructor() {
    super();

    this.state = {
      status: {},
      isLoading: false,
      isError: false,
      isPasswordError: false,
      isErrorBirthDate: false,
      isRequiredUserName: false,
      isRequiredEmail: false,
      isEmailError: false,
      isRequiredPassword: false,
      isPhoneError: false,

      username: '',
      email: '',
      password: '',
      tempPass: '',
      confPass: '',
      first_name: '',
      last_name: '',
      selectedValue: 'male',
      birthDate: '',
      tempBirthDate: new Date(),
      mobNumCc: '',
      mobNum: '',
      address: '',
    }

    this._handleTextChange = this._handleTextChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.navigation.state.params && this.props.navigation.state.params.onGoBack();
  }

  _handleTextChange(type, value) {
    this.setState({
      [type]: value,
    });
  }

  _handlePass(value) {
    if (this.state.confPass.value == value.value) {
      this.setState({
        tempPass: value,
        password: value,
        isError: false,
      })
    } else {
      this.setState({
        tempPass: value,
        isError: true,
        isPasswordError: false,
      })
    }
  }

  _handleConfirmPass(value) {
    if (this.state.tempPass.value == value.value) {
      this.setState({
        confPass: value,
        password: value,
        isError: false,
      })
    } else {
      this.setState({
        confPass: value,
        isError: true,
        isPasswordError: false,
      })
    }
  }

  _handleEmail(value) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(value.value)) {
      this.setState({
        email: value,
        isEmailError: false,
        isRequiredEmail: false,
      })
    }
    else {
      this.setState({
        email: value,
        isEmailError: true,
        isRequiredEmail: false,
      })
    }
  }

  _handlePhoneNumber(text, type) {
    console.log("Check phone number");

    let regExCC = /^\+\d{1,3}$/;
    let regEx = /^\d{3}(\-)?\d{4}$/;

    if(text != '') {
      if(type === 1) {
        if(regExCC.test(text)) {
          console.log(true);
          this.setState({
             mobNumCc: text,
             isPhoneError: false,
          });
        } else {
          console.log(false);
          this.setState({
             isPhoneError: true,
          });
        }
      } else if(type === 2) {
        if(regEx.test(text)) {
          console.log(true);
          this.setState({
             mobNum: text,
             isPhoneError: false,
          });
        } else {
          console.log(false);
          this.setState({
             isPhoneError: true,
          });
        }
      }
    } else {
      console.log('empty');
      this.setState({
        mobNumCc: text,
        mobNum: text,
        isPhoneError: false,
      });
    }
  }

  _getParsedDate(date) {
    var parsedDate = String(date).split(' ');
    var days = String(parsedDate[0]).split('-');
    var nowDate = String(new Date()).split(' ');

    // if (days[0] < (nowDate[3] - 4)) {
      this.setState({ isErrorBirthDate: false, tempBirthDate: date, birthDate: date });
    // } else {
      // this.setState({ isErrorBirthDate: true, tempBirthDate: date });
    // }
  }

  _handleSubmit() {
    let parameters = "?username=" + this.state.username.value
      + "&email=" + this.state.email.value
      + "&password=" + this.state.password.value;

    this.state.first_name.value && (parameters = parameters + "&first_name=" + this.state.first_name.value);
    this.state.last_name.value && (parameters = parameters + "&last_name=" + this.state.last_name.value);
    this.state.selectedValue && (parameters = parameters + "&gender=" + this.state.selectedValue);
    this.state.birthDate && (parameters = parameters + "&birth_date=" + this.state.birthDate);
    (this.state.mobNumCc && this.state.mobNum)
      && (parameters = parameters + "&mobile_phone=(" + this.state.mobNumCc + ')' + this.state.mobNum);
    this.state.address.value && (parameters = parameters + "&address=" + this.state.address.value);

    console.log(parameters);

    if (this.state.username.value &&
      this.state.email.value &&
      this.state.password.value &&
      this.state.isError != true &&
      this.state.isPasswordError != true &&
      this.state.isErrorBirthDate != true &&
      this.state.isFormatCorrect != true &&
      this.state.isPhoneError != true) {

      this.setState({ isLoading: true });
      Axios.post(apis.urls.user.signup + parameters
        , null
        , {
          headers: {
            token: apis.headerLogin,
          }
        })
        .then((response) => {
          this.setState({
            isLoading: false,
            status: response.data,
          }, () => {
            this.props.navigation.navigate('SuccessJoin', { onGoBack: () => this.props.navigation && this.props.navigation.goBack(null) })
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
        isRequiredUserName: (this.state.username.value == undefined ? true : false),
        isRequiredEmail: (this.state.email.value == undefined ? true : false),
        isRequiredPassword: (this.state.tempPass.value == undefined ? true : false),
        isPasswordError: (this.state.confPass.value == undefined ? true : false),
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Spinner isVisible={this.state.isLoading} />

        <ImageContainer source={require("../../img/image_back_1.jpg")} />

        <View style={{ maxHeight: '70%' }}>
          <JoinFormContainer>
            <JoinContainerHeader>Basic Information</JoinContainerHeader>
            <JoinFormInputContainer>
              <TextField
                label="Nickname"
                onChangeHandler={value => this._handleTextChange('username', value)}
                onBlur={e => this._handleBlur()}
              />
              {
                this.state.isRequiredUserName && <Text style={styles.errorText}>You can't leave this empty</Text>
              }

              <TextField
                label="Email"
                onChangeHandler={value => this._handleEmail(value)}
                keyboardType={"email-address"}
              />
              {
                this.state.isRequiredEmail && <Text style={styles.errorText}>You can't leave this empty</Text>
              }
              {
                this.state.isEmailError && <Text style={styles.errorText}>Invalid email</Text>
              }

              <TextField
                secureTextEntry
                toggableSecureTextEntry={true}
                label="Password"
                onChangeHandler={value => this._handlePass(value)}
              />
              {
                this.state.isRequiredPassword && <Text style={styles.errorText}>You can't leave this empty</Text>
              }

              <TextField
                secureTextEntry
                toggableSecureTextEntry={true}
                label="Confirm Password"
                onChangeHandler={value => this._handleConfirmPass(value)}
              />
              {
                this.state.isError && <Text style={styles.errorText}>Password do not match</Text>
              }
              {
                this.state.isPasswordError && <Text style={styles.errorText}>You can't leave this empty</Text>
              }

            </JoinFormInputContainer>
            <View style={{ margin: 10, width: '90%' }} />
            <JoinContainerHeader>Optional</JoinContainerHeader>
            <JoinFormInputContainer>
              <TextField
                label="First Name"
                onChangeHandler={(text) => this.setState({ first_name: text })}
              />
              <TextField
                label="Last Name"
                onChangeHandler={(text) => this.setState({ last_name: text })}
              />
              <View style={{ marginTop: 18, width: '90%' }} >
                <Text style={styles.baseText} >Gender</Text>
                <PickerCard>
                  <Picker
                    selectedValue={this.state.selectedValue}
                    style={{ height: 30 }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ selectedValue: itemValue })
                    }>
                    <Picker.Item label="Male" value='male' />
                    <Picker.Item label="Female" value='female' />
                  </Picker>
                </PickerCard>
              </View>
              <View style={{ marginTop: 18, width: '90%' }} >
                <Text style={styles.baseText}>Date of Birth</Text>
                <DatePicker
                  style={styles.datePicker}
                  date={this.state.tempBirthDate}
                  mode="date"
                  androidMode="spinner"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  maxDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      right: 0,
                      top: 4,
                      marginLeft: 10,
                    },
                    dateInput: {
                      paddingLeft: 5,
                      borderWidth: 0,
                      alignItems: 'flex-start',
                    },
                    dateText: {
                      fontFamily: 'Roboto',
                      fontSize: 16,
                      color: colors.gray,
                    },
                  }}
                  onDateChange={(date) => { this._getParsedDate(date) }}
                />
                {
                  this.state.isErrorBirthDate && <Text style={styles.errorText}>Invalid birth date</Text>
                }
              </View>
              <View style={{ marginTop: 18, width: '90%' }} >
                <Text style={styles.baseText}>Mobile Number</Text>
                <View style={{ flexDirection: "row", borderBottomColor: colors.gray, borderBottomWidth: 1 }}>
                  <TextInput
                    style={[styles.mobileNumberInput, { width: '20%'}]}
                    onChangeText={(text) => this._handlePhoneNumber(text, 1)}
                    placeholder={'+000'}
                    maxLength={4}
                    keyboardType={"phone-pad"}
                  />
                  <TextInput
                    style={[styles.mobileNumberInput, { width: '70%', marginLeft: 10}]}
                    onChangeText={(text) => this._handlePhoneNumber(text, 2)}
                    placeholder={'000-0000'}
                    maxLength={8}
                    keyboardType={"phone-pad"}
                  />
                </View>
                {
                  this.state.isPhoneError && <Text style={styles.errorText}>Invalid mobile number</Text>
                }
              </View>
              <TextField
                label="Address"
                onChangeHandler={(text) => this.setState({ address: text })}
              />
            </JoinFormInputContainer>

            <JoinFormSubmitButton onPress={this._handleSubmit}>
              <Text style={styles.buttonText}>Sign-up</Text>
            </JoinFormSubmitButton>
          </JoinFormContainer>
        </View>
      </View>

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
    fontSize: 18,
  },
  focusedText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.turquoise,
  },
  subText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.gold,
    textDecorationLine: 'underline',
  },
  datePicker: {
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.turquoise,
    width: '100%',
  },
  mobileNumberInput: {
    fontFamily: 'Roboto',
    height: 40,
    padding: 5,
    fontSize: 16,
  },
  errorText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.red,
  },
});
