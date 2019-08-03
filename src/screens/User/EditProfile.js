import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../theme';
import Spinner from '../../components/Spinner';
import DatePicker from 'react-native-datepicker';
import Axios from 'axios';
import { apis } from '../../constants/apis';

import { connect } from 'react-redux';
import { logoutUser } from '../../reducers/auth';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const height = width * 0.45;

const Section = styled.View`
  flex-direction: row;
`;
const UserImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40;
  margin: 10px;
`;

const StyledButton = styled.TouchableOpacity`
margin-top: 25px;
  width: 50%;
  padding: 10px;
  align-items: center;
  background-color: ${colors.turquoise};
  border-radius: 5px;
`;

class EditForm extends Component {
  static navigationOptions = {
    title: 'Edit Profile',
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
      isEditable: false,
      nickNameText: '',
      nickNameIsEditable: false,
      emailText: '',
      emailIsEditable: false,
      firstNameText: '',
      firstNameIsEditable: false,
      lastNameText: '',
      lastNameIsEditable: false,
      genderText: '',
      genderIsEditable: false,
      bdayText: '',
      bdayIsEditable: false,
      mobileText: '',
      mobileIsEditable: false,
      addressText: '',
      addressIsEditable: false,
      imageURL: require("../../img/no_user.jpg"),
    }
  }

  componentDidMount() {
    let params = this.props.navigation.state.params;
    this.setState({
      nickNameText: params.user.nickname,
      emailText: params.user.email,
      firstNameText: params.user.first_name != null ? params.user.first_name : '(not set)',
      lastNameText: params.user.last_name != null ? params.user.last_name : '(not set)',
      genderText: params.user.gender != null ? params.user.gender : '(not set)',
      bdayText: params.user.birth_date != null ? params.user.birth_date : '(not set)',
      mobileText: params.user.mobile_phone != null ? params.user.mobile_phone : '(not set)',
      addressText: params.user.address != null ? params.user.address : '(not set)',
      imageURL: params.user.image_url != null ? { uri: params.user.image_url } : this.state.imageURL,
    })
  }

  _getParsedDate(date) {
    var parsedDate = String(date).split(' ');
    var days = String(parsedDate[0]).split('-');
    var nowDate = String(new Date()).split(' ');

    // if (days[0] < (nowDate[3] - 4)) {
    this.setState({ bdayText: date });
    // } else {
    // this.setState({ isErrorBirthDate: true, tempBirthDate: date });
    // }
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView style={{ marginBottom: 20 }}>
          {/* <ImageContainer source={require("../../img/image_back_1.jpg")} /> */}
          <View style={{ margin: 20 }}>
            <TouchableOpacity style={{ flex: 1, alignItems: "center" }}>
              <UserImage source={this.state.imageURL} />
              <Text style={styles.titleText}> Change Profile Photo </Text>
            </TouchableOpacity>

            <View style={styles.containerStyle}>
              <Text style={styles.baseText}> First Name </Text>
              <TextInput
                style={styles.inputFieldFormat}
                onChangeText={(text) => this.setState({ firstNameText: text })}
                value={this.state.firstNameText}
              />
            </View>

            <View style={styles.containerStyle}>
              <Text style={[styles.baseText, { marginTop: 3 }]}> Last Name </Text>
              <TextInput
                style={styles.inputFieldFormat}
                onChangeText={(text) => this.setState({ lastNameText: text })}
                value={this.state.lastNameText}
              />
            </View>

            <View style={styles.containerStyle}>
              <Text style={[styles.baseText, { marginTop: 3 }]}> Nick Name </Text>
              <Text
                onPress={() => navigation.navigate('EditPage', { title: 'Nick Name', type: 1, value: this.state.nickNameText })}
                style={styles.inputFieldFormat}
              // onChangeText={(text) => this.setState({ nickNameText: text })}
              // value={this.state.nickNameText}
              >{this.state.nickNameText}</Text>
            </View>
          </View>
          <View style={{ borderTopColor: colors.lightGray, borderTopWidth: 1 }}>
            <Text style={[styles.titleText, { marginLeft: 20, marginTop: 10 }]}> Personal Information </Text>
          </View>
          <View style={{ marginLeft: 20, marginRight: 20 }}>
            <View style={styles.containerStyle}>
              <Text style={styles.baseText}> Email </Text>
              <Text
                onPress={() => navigation.navigate('EditPage', { title: 'Email', type: 3, value: this.state.emailText })}
                style={styles.inputFieldFormat}
                // onChangeText={(text) => this.setState({ emailText: text })}
                // value={this.state.emailText}
              >{this.state.emailText}</Text>
            </View>

            <View style={styles.containerStyle}>
              <Text style={[styles.baseText, { marginTop: 3 }]}> Mobile Phone </Text>
              <Text
                onPress={() => navigation.navigate('EditPage', { title: 'Mobile Phone', type: 2, value: this.state.mobileText })}
                style={styles.inputFieldFormat}
                // onChangeText={(text) => this.setState({ mobileText: text })}
                // value={this.state.mobileText}
              >{this.state.mobileText}</Text>
            </View>

            <View style={styles.containerStyle}>
              <Text style={[styles.baseText, { marginTop: 3 }]}> Gender </Text>
              <Text
                style={styles.inputFieldFormat}
              // onChangeText={(text) => this.setState({ nickNameText: text })}
              // value={this.state.nickNameText}

              > {this.state.nickNameText}
              </Text>
            </View>

            <View style={styles.containerStyle}>
              <Text style={[styles.baseText, { marginTop: 3 }]}> Birthday </Text>
              <DatePicker
                style={styles.datePicker}
                date={this.state.bdayText}
                mode="date"
                androidMode="spinner"
                placeholder="select date"
                format="YYYY-MM-DD"
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    width: 0,
                    height: 0,
                  },
                  dateInput: {
                    paddingLeft: 5,
                    borderWidth: 0,
                    alignItems: 'flex-start',
                  },
                  dateText: {
                    fontFamily: 'Roboto',
                    fontSize: 14,
                  },
                }}
                onDateChange={(date) => { this._getParsedDate(date) }}
              />
            </View>

            <View style={styles.containerStyle}>
              <Text style={[styles.baseText, { marginTop: 3 }]}> Address </Text>
              <TextInput
                style={styles.inputFieldFormat}
                onChangeText={(text) => this.setState({ addressText: text })}
                value={this.state.addressText}
              />
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <StyledButton>
              <Text style={styles.buttonText}>Save</Text>
            </StyledButton>
          </View>

          <Spinner isVisible={this.state.isLoading} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.lightGray,
  },
  buttonText: {
    fontFamily: 'Roboto',
    padding: 4,
    color: colors.white,
  },
  titleText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: colors.turquoise,
  },
  inputFieldFormat: {
    fontFamily: 'Roboto',
    fontSize: 14,
    paddingBottom: 10,
    paddingLeft: 4
  },
  containerStyle: {
    borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 10
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(EditForm);