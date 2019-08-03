import React, { Component } from 'react';
import { View, Text, BackHandler, Dimensions, StyleSheet, Alert } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../theme';

import { connect } from 'react-redux';
import { addToCart } from '../../reducers/auth';
import Axios from 'axios';
import { apis } from '../../constants/apis';



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

const LogoContainerFailed = styled.Image`
      width: ${logoHeight + 2};
      height: ${logoHeight};
	`;

const StyledFormContainer = styled.View`
  flex: 1;
  padding-horizontal: 10;
  background-color: ${colors.white};
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


class OrderConfirmation extends Component {
    static navigationOptions = {
        title: 'Order Confirmation'
    }

    constructor() {
        super();

        this.state = {
            isSuccessful: true,
            dataSource: null,
        }

        this._getUser = this._getUser.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        // call user to get updated cart total items
        this._getUser();
    }

    _getUser() {
        Axios.get(apis.urls.user.main + "/" + this.props.screenProps.user.user_id, {
            headers: {
                token: this.props.screenProps.user.token && this.props.screenProps.user.token,
            }
        })
            .then((response) => {
                this.setState({
                    dataSource: response.data,
                }, () => {
                    console.log("Retrieved User");
                    this.props.onAddToCart(this.state.dataSource.cart_items);

                });
            })
            .catch((error) => {
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

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        // this.goBack(); // works best when the goBack is async
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
        return true;
    }

    render() {
        const { navigation } = this.props;

        return (
            <StyledFormContainer>
                <StyledFormPanel>
                    {
                        navigation.state.params.isSuccessful ?
                            <LogoContainer source={require("../../img/sign-up-success.png")} />
                            :
                            <LogoContainerFailed source={require("../../img/failed.png")} />
                    }
                    {
                        navigation.state.params.isSuccessful ?
                            <View style={{ width: '80%', alignItems: 'center', marginTop: 20 }}>
                                <Text style={styles.titleText}> Success Order </Text>
                                <Text style={styles.highlightText}> Your Order ID: {navigation.state.params.orderID} </Text>
                                <Text style={[styles.baseText, { marginTop: 10 }]} > Your order has been successfully placed. Please wait for the confirmation message to be sent in your inbox. </Text>
                            </View>
                            :
                            <View style={{ width: '80%', alignItems: 'center', marginTop: 20 }}>
                                <Text style={[styles.titleText, { color: colors.red }]}> Purchase Order Failed! </Text>
                                <Text style={[styles.baseText, { marginTop: 10 }]} > Your order purchase has failed. Please try again. </Text>
                            </View>
                    }
                    <StyledButton onPress={() => this.handleBackPress()}>
                        <Text style={styles.buttonText}>Continue Shopping</Text>
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
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
    },
    highlightText: {
        fontFamily: 'Roboto',
        fontSize: 20,
        color: colors.turquoise,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonText: {
        fontFamily: 'Roboto',
        fontSize: 16,
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

const mapStateToProps = state => {
    return {
        cart: state.status,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAddToCart: (cart) => {
            dispatch(addToCart(cart))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderConfirmation);