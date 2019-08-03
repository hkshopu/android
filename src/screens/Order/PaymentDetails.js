import React, { Component } from 'react';
import { KeyboardAvoidingView, Text, View, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../theme';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import Axios from 'axios';
import { apis } from '../../constants/apis';

const TopSection = styled.View`
    justify-content: flex-start;
`;

const BottomSection = styled.View`
    justify-content: flex-end;
`;

const SectionHeader = styled.View`
    background-color: ${colors.gray};
    padding: 5px 10px;
`;

const ShippingHeader = styled.View`
flex-direction: row;
background-color: ${colors.gray};
padding: 5px;
`;

const ShippingContainer = styled.View`
margin-right: 5px;
margin-left: 5px;
margin-top: 5px;
margin-bottom: 15px;
`;

const AddressContainer = styled.View`
  flex-direction: row;
`;

const PricingContainer = styled.View`
border-top-color: ${colors.gray};
border-top-width: 1; 
padding: 5px;
`;

const PriceContainer = styled.View`
display: flex;
flex-direction: row;
flex-wrap: wrap;
`;

const ButtonSection = styled.TouchableOpacity`
padding: 15px;
background-color: ${ colors.turquoise}
align-items: center;
margin-top: 10px;
`;

const getPaymenticon = code => {
    if (code == 'paypal') return 'paypal';
    if (code == 'bank') return 'money';
    return 'vcard';
}

const getPaymentLabel = code => {
    if (code == 'paypal') return 'Paypal';
    if (code == 'bank') return 'Bank In';
    return 'SPF';
}

export default class PaymentDetails extends Component {
    static navigationOptions = {
        title: 'Payment Details'
    }

    constructor() {
        super();

        this.state = {
            isToShip: true,
            paymentMethod: 0,
            selectedIndex: 0,
            dataSource: null,
        }
    }

    componentDidMount() {
        var shop = this.props.navigation.getParam('shop');
        this.setState({
            paymentMethod: shop.payment_method[0].id,
        })

    }

    _handleSubmit(shopID, receiver, address) {
        if (this.state.paymentMethod == 1) {
            this.props.navigation.navigate('PaypalView', { shopID: shopID, receiver: receiver, address: address, token: this.props.screenProps.user.token });

        } else if (this.state.paymentMethod == 3) {
            Axios.post(apis.urls.order.main, {
                shop_id: shopID,
                payment_method_id: this.state.paymentMethod,
                receiver: receiver,
                address: address,
            }, {
                    headers: {
                        token: this.props.screenProps.user.token && this.props.screenProps.user.token,
                    }
                })
                .then((response) => {
                    this.setState({
                        // isLoading: false,
                        dataSource: response.data,
                    }, () => {
                        console.log("Order Placed");
                        this.props.navigation.navigate('OrderConfirmation', { orderID: this.state.dataSource.order_id, isSuccessful: true });
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({
                        isLoading: false,
                    });
                    // Alert.alert(
                    //     'Something Went Wrong',
                    //     error.response.data.message,
                    //     [
                    //         { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    //         { text: 'OK', onPress: () => console.log('OK Pressed') },
                    //     ],
                    //     { cancelable: false }
                    // );
                    this.props.navigation.navigate('OrderConfirmation', { orderID: this.state.dataSource.order_id, isSuccessful: false });

                });

        } else {
            return;
        }
    }

    renderRow(prodData, index) {
        return (
            <View key={index}
                style={{
                    flex: 1
                    , alignSelf: 'stretch'
                    , flexDirection: 'row'
                    , borderBottomColor: colors.gold
                    , borderBottomWidth: 1
                    , padding: 3
                }}>
                <View style={{ flex: 1 }} >
                    <Text style={styles.baseText}>{prodData.name_en}</Text>
                </View>
                <View style={{ flex: 0.75 }}>
                    <Text style={[styles.baseText, { textAlign: 'right' }]}>{prodData.price_discounted != null ? prodData.price_discounted : prodData.price}</Text>
                </View>
                <View style={{ flex: 0.5 }}>
                    <Text style={[styles.baseText, { textAlign: 'center' }]}>{prodData.quantity}</Text>
                </View>
                <View style={{ flex: 0.75 }}>
                    <Text style={[styles.baseText, { textAlign: 'right' }]}>{prodData.total_price_discounted != null ? prodData.total_price_discounted : prodData.total_price }</Text>
                </View>
            </View>
        )
    }

    render() {
        const { navigation } = this.props;
        const receiver = navigation.getParam('receiver');
        const address = navigation.getParam('address');
        const shop = navigation.getParam('shop');
        const amount = shop.total_amount_discounted != null ? shop.total_amount_discounted : shop.total_amount;
        const total =(receiver !== '' && address !== '') ? shop.shop_cart_total : amount;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <TopSection>
                    <SectionHeader>
                        <Text style={styles.headerText}>Order Summary</Text>
                    </SectionHeader>
                </TopSection>
                <ScrollView>
                    <View>
                        {
                            shop.product.map((datum, index) => { // This will render a row for each data element.
                                return this.renderRow(datum, index);
                            })
                        }
                    </View>
                </ScrollView>
                <BottomSection>
                    <View>
                        <ShippingHeader>
                            <Text style={[styles.headerText, { margin: 3 }]}>Choose Payment Method</Text>
                        </ShippingHeader>
                        <ShippingContainer>
                            <RadioGroup
                                color={colors.turquoise}
                                style={{ display: 'flex', flexDirection: 'row', marginRight: 10 }}
                                selectedIndex={0}
                                onSelect={(index, value) => this.setState({ paymentMethod: value, selectedIndex: index })}
                            >
                                {
                                    shop.payment_method.map((method, index) => (
                                        <RadioButton
                                            value={method.id}
                                            color={colors.turquoise}
                                            key={index}>
                                            <View style={{ flexDirection: 'row', }}>
                                                {
                                                    this.state.selectedIndex == index ?
                                                        <FontAwesome name={getPaymenticon(method.code)} size={20} color={colors.turquoise} />
                                                        :
                                                        <FontAwesome name={getPaymenticon(method.code)} size={20} color={colors.gray} />
                                                }   
                                                <Text style={[styles.baseText, { marginLeft: 5 }]}>{method.name}</Text>
                                            </View>
                                        </RadioButton>
                                    ))
                                }
                            </RadioGroup>
                        </ShippingContainer>
                    </View>
                    {
                        (receiver !== '' && address !== '') &&
                        <View>
                            <ShippingHeader>
                                <Text style={[styles.headerText, { margin: 3 }]}>Shipment Information</Text>
                            </ShippingHeader>
                            <ShippingContainer>
                                <AddressContainer>
                                    <Text style={[styles.baseText, { fontWeight: 'bold' }]}>
                                        {receiver}
                                    </Text>
                                </AddressContainer>
                                <AddressContainer>
                                    <Text style={[styles.baseText, { fontSize: 14 }]}>
                                        {address}
                                    </Text>
                                </AddressContainer>
                            </ShippingContainer>
                        </View>
                    }
                    <PricingContainer>
                        <PriceContainer>
                            <Text style={[styles.fieldText, { flex: 2, textAlign: 'right', fontSize: 20 }]}>Total:</Text>
                            <Text style={styles.priceText}>HK$ {total}</Text>
                        </PriceContainer>
                        <PriceContainer>
                            <Text style={[styles.fieldText, { flex: 2, textAlign: 'right', fontSize: 12 }]}>Shipping Fee:</Text>
                            <Text style={[styles.priceText, { fontSize: 12 }]}>{(receiver !== '' && address !== '') ? 'HK$' + shop.shipment_fee_computed : 'HK$ 0.00'}</Text>
                        </PriceContainer>
                    </PricingContainer>
                    <ButtonSection onPress={() => this._handleSubmit(shop.shop_id, receiver, address)}>
                        <Text style={styles.buttonText}>Confirm</Text>
                    </ButtonSection>
                </BottomSection>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
    },
    baseText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: colors.gray,
    },
    buttonText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: colors.white,
    },
    headerText: {
        color: colors.white,
        fontSize: 16,
    },
    fieldText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: colors.turquoise,
    },
    priceText: {
        fontFamily: 'Roboto',
        fontSize: 20,
        color: colors.gray,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'right',
    }
});