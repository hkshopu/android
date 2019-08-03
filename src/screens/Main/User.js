import React, { Component } from 'react';
import { AppState, Text, View, TouchableOpacity, AsyncStorage, StyleSheet, SectionList } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../theme';
import Moment from 'moment';

const Container = styled.ScrollView`
  background-color: ${colors.white};
`;

const UserContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  align-items: center;
  background-color: ${colors.turquoise};
`;

const UserImage = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 35;
  margin: 10px;
`;

const UserDetails = styled.View`
  flex: 2;
  margin: 0 10px;
`;

const UserSettings = styled.TouchableOpacity`
  align-items: flex-end;
  margin-right: 20px;
`;

const UserLogoutContainer = styled.View`
    padding: 10px;
    background-color: ${colors.turquoise};
`;

const LoggedOutUserDetails = styled.View`
display: flex;
flexDirection: row;
flexWrap: wrap;
alignItems: center;
justifyContent: space-between;
`;

const StyledButton = styled.TouchableOpacity`
  display: flex;
  padding: 10px;
  margin: 10px 20px;
  background-color: ${colors.turquoise};
  border-radius: 5px;
  flex-grow: 1;
  align-items: center;
  border: 1px solid ${colors.white};
`;

const StyledButton2 = styled.TouchableOpacity`
  display: flex;
  padding: 10px;
  margin: 10px 20px;
  background-color: ${colors.gold};
  border-radius: 5px;
  flex-grow: 1;
  align-items: center;
`;

const Section = styled.TouchableOpacity`
  ${props => props.header && 'background-color: #cccccc;'}
  padding: 20px;
  ${props => !props.noBorder && `
    border-bottom-width: 1px;
    border-style: solid;
    border-bottom-color: ${colors.turquoise};
  `}
  flex-direction: row;
`;

const SectionTitle = styled.Text`
  flex: 1;
`;

const SectionSubTitle = styled.Text`
  flex: 1;
  text-align: right;
`;

const SectionLeft = styled.Text`
  flex: 1;
  text-align: left;
  margin-right: 5px;
`;


const SectionsComplete = [
  {
    title: 'Account Settings',
    data: [
      {
        title: 'Notice',
        icon: 'bell',
        screen: 'Notice',
      },
      {
        title: 'Following',
        icon: 'plus',
      },
      {
        title: 'Like',
        icon: 'heart',
      },
      {
        title: 'Buy',
        icon: 'shopping-cart',
        screen: 'BuyRecord',
      }
    ]
  },
  {
    title: 'About HKShopU',
    data: [
      {
        title: 'About Us',
        icon: 'info-circle',
      },
      {
        title: 'Services Terms',
        icon: 'file-text',
      },
      {
        title: 'Privacy Policy',
        icon: 'shield',
      },
      {
        title: 'Contact Us',
        icon: 'phone',
       },
      {
         title: 'Help',
         icon: 'question-circle',
      },
    ]
  },
];

const SectionsServicesOnly = [
  {
    title: 'About HKShopU',
    data: [
      {
        title: 'About Us',
        icon: 'info-circle',
      },
      {
        title: 'Services Terms',
        icon: 'file-text',
      },
      {
        title: 'Privacy Policy',
        icon: 'shield',
      },
      {
        title: 'Contact Us',
        icon: 'phone',
       },
      {
         title: 'Help',
         icon: 'question-circle',
      },
    ]
  },
];

export default class User extends Component {
  static navigationOptions = {
    title: 'Me'
  }

  constructor() {
    super();

    this.state = {
      appState: AppState.currentState,
      isLoggedIn: false,
    }
  }

 renderItem({item, index, section}, navigation) {
    return (
      <Section key={index} onPress={() => {
        if (typeof item.screen !== 'undefined') {
          return navigation.navigate(item.screen);
        }
        if (typeof item.function === 'function') {
          console.log("Pressed!");
        }
      }}>
        <SectionTitle >
               <SectionLeft> { item.icon && <FontAwesome name={item.icon} size={20} color={colors.turquoise} /> } </SectionLeft>
               <Text> {item.title} </Text>
          </SectionTitle>
          <SectionSubTitle>
            <FontAwesome name={"chevron-right"} size={20} color={colors.turquoise} />
          </SectionSubTitle>
      </Section>
    );
  }

  render() {
    const { navigation, screenProps } = this.props;

    return (
      <Container>
           {
                screenProps.user.token ? (
                  <UserContainer>
                    <UserImage source={require("../../img/no_user.jpg")}/>
                    <UserDetails>
                      <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', }}>
                        <Text style={styles.headerText}>{screenProps.user.user.nickname}</Text>
                        <TouchableOpacity style={{ justifyContent: 'flex-start', paddingLeft: 20 }}
                                onPress={() => navigation.navigate('EditProfile', {user: screenProps.user.user})}>
                            <FontAwesome  name="edit" size={20} color={colors.gold} />
                        </TouchableOpacity>
                      </View>
                      <Text style={ styles.subText }>Join Date {Moment(screenProps.user.user.join_date).format('MMM D, YYYY')}</Text>
                    </UserDetails>
                    <UserSettings onPress={()=> navigation.navigate('Settings')}>
                      <FontAwesome name="cog" size={25} color={colors.white} />
                    </UserSettings>
                  </UserContainer>
                ) : (
                  <UserLogoutContainer>
                     <LoggedOutUserDetails>
                        <UserImage source={require("../../img/no_user.jpg")}/>
                        <Text style={styles.subText} >Hello, Welcome to ShopU Mobile !</Text>
                        <UserSettings onPress={()=> navigation.navigate('Settings')}>
                           <FontAwesome name="cog" size={25} color={colors.white} />
                        </UserSettings>
                     </LoggedOutUserDetails>

                      <LoggedOutUserDetails>
                        <StyledButton onPress={() => navigation.navigate('Login', {onGoBack: () => console.log('from login') })}>
                          <Text style={styles.buttonText}>LOGIN</Text>
                        </StyledButton>
                        <StyledButton2 onPress={() => navigation.navigate('Join', {onGoBack: () => console.log('from signup') })}>
                          <Text style={styles.buttonText}>SIGN UP</Text>
                        </StyledButton2>
                      </LoggedOutUserDetails>
                  </UserLogoutContainer>
                )
           }

            <SectionList
              renderItem={item => this.renderItem(item, navigation)}
              sections={screenProps.user.token ? SectionsComplete : SectionsServicesOnly}
              keyExtractor={(item, index) => item + index}
            />
      </Container>
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
    color: colors.white,
  },
  headerText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
  },
});
