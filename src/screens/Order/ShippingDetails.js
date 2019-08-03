import React, { Component } from 'react';
import { KeyboardAvoidingView, Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../theme';

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

const SectionBlock = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray};
  border-style: solid;
`;

const SectionBlockImageContainer = styled.View`
  flex: 0.75;
  padding: 5px;
`;

const SectionBlockImage = styled.Image`
  width: 100%;
  height: 60px;
`;

const SectionBlockDetails = styled.View`
  flex: 2;
  padding: 5px;
`;

const SectionBlockRight = styled.View`
  flex: 1;
  padding: 5px;
  align-items: flex-end;
`;

const SectionBlockRightSidebar = styled.View`
  flex: 1;
  padding: 5px;
  align-items: center;
  justify-content: center;
  border-left-width: 1px;
  border-left-color: ${colors.gray};
  border-style: solid;
`;

const SectionBlockRightPrice = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.gray};
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
  margin-bottom: 10px;
`;

const StyledCommentBox = styled.TextInput`
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  flex: 1 1 auto;
  border-bottom-color: ${colors.gray};
  border-bottom-width: 1px;
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

export default class ShippingDetails extends Component {
    static navigationOptions = {
        title: 'Delivery Details'
    }

    constructor() {
        super();

        this.state = {
            isToShip: true,
            receiver: "",
            errorReceiver: false,
            address: "",
            errorAddress: false,
        }

        this._handlePlaceOrder = this._handlePlaceOrder.bind(this);
    }

    _handlePlaceOrder(shop) {
        if (this.state.isToShip) {
            if (this.state.receiver !== "" && this.state.address !== "") {
                this.props.navigation.navigate('PaymentDetails', { receiver: this.state.receiver, address: this.state.address, shop: shop });
            } else {
                this.setState({
                    errorReceiver: (this.state.receiver !== "") ? false : true,
                    errorAddress: (this.state.address !== '') ? false : true,
                });
            }
        } else {
            this.props.navigation.navigate('PaymentDetails', { receiver: "", address: "", shop: shop });
        }
    }

    render() {
        const { navigation } = this.props;
        const shop = navigation.getParam('shop');
        const amount = shop.total_amount_discounted != null ? shop.total_amount_discounted : shop.total_amount;
        const total = this.state.isToShip ? shop.shop_cart_total : amount;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <TopSection>
                    <SectionHeader>
                        <Text style={styles.headerText}>Items</Text>
                    </SectionHeader>
                </TopSection>
                <ScrollView style={{ flex: 1 }} >
                    {
                        shop.product.map((prod, index) =>
                            <SectionBlock key={index}>
                                <SectionBlockImageContainer>
                                    <SectionBlockImage source={{ uri: prod.image_url }} />
                                </SectionBlockImageContainer>
                                <SectionBlockDetails>
                                    <Text style={[styles.baseText, { fontWeight: 'bold' }]}>{prod.name_en}</Text>
                                    <Text style={[styles.baseText, { fontSize: 12 }]} numberOfLines={1} ellipsizeMode="tail">
                                        {prod.description_en}
                                    </Text>
                                    <SectionBlockRight>
                                        <SectionBlockRightPrice >HK$ {prod.total_price_discounted != null ? prod.total_price_discounted : prod.total_price}</SectionBlockRightPrice>
                                    </SectionBlockRight>
                                </SectionBlockDetails>
                                <SectionBlockRightSidebar>
                                    <Text style={[styles.baseText, { fontSize: 16 }]}>{prod.quantity + " " + (prod.quantity > 1 ? "pcs" : "pc")}</Text>
                                </SectionBlockRightSidebar>
                            </SectionBlock>
                        )
                    }
                </ScrollView>
                <BottomSection>
                    <View>
                        <ShippingHeader>
                            <Text style={[styles.headerText, { flex: 2, margin: 3 }]}>Shipment</Text>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    isToShip: !this.state.isToShip,
                                    errorAddress: false,
                                    errorReceiver: false,
                                })
                            }}
                                style={{ flex: 1, alignItems: 'flex-end' }}>
                                <FontAwesome name={this.state.isToShip ? 'toggle-on' : 'toggle-off'} size={30} color={colors.turquoise} />
                            </TouchableOpacity>
                        </ShippingHeader>
                        <ShippingContainer>
                            <AddressContainer>
                                {
                                    this.state.isToShip ?
                                        <Text style={[styles.fieldText, { paddingTop: 5 }]}>Receiver:</Text>
                                        :
                                        <Text style={[styles.fieldText, { paddingTop: 5, color: colors.gray }]}>Receiver:</Text>
                                }
                                <StyledCommentBox
                                    placeholder="Receiver's name"
                                    maxLength={60}
                                    onChangeText={(text) => this.setState({ receiver: text })}
                                    value={this.state.receiver}
                                    style={styles.baseText}
                                    editable={this.state.isToShip ? true : false}
                                />
                            </AddressContainer>
                            {
                                this.state.errorReceiver && <Text style={styles.errorText}>You can't leave this empty</Text>
                            }
                            <AddressContainer>
                                {
                                    this.state.isToShip ?
                                        <Text style={[styles.fieldText, { paddingTop: 5 }]}>Address:</Text>
                                        :
                                        <Text style={[styles.fieldText, { paddingTop: 5, color: colors.gray }]}>Address:</Text>
                                }
                                <StyledCommentBox
                                    placeholder="Address"
                                    maxLength={120}
                                    onChangeText={(text) => this.setState({ address: text })}
                                    value={this.state.address}
                                    style={styles.baseText}
                                    editable={this.state.isToShip ? true : false}
                                />
                            </AddressContainer>
                            {
                                this.state.errorAddress && <Text style={styles.errorText}>You can't leave this empty</Text>
                            }
                        </ShippingContainer>
                    </View>
                    <PricingContainer>
                        <PriceContainer>
                            <Text style={[styles.fieldText, { flex: 2, textAlign: 'right', fontSize: 20 }]}>Total:</Text>
                            <Text style={styles.priceText}>HK$ {total}</Text>
                        </PriceContainer>
                        <PriceContainer>
                            <Text style={[styles.fieldText, { flex: 2, textAlign: 'right', fontSize: 12 }]}>Shipping Fee:</Text>
                            <Text style={[styles.priceText, { fontSize: 12 }]}>{this.state.isToShip ? 'HK$' + shop.shipment_fee_computed.toFixed(2) : 'HK$0.00'}</Text>
                        </PriceContainer>
                    </PricingContainer>
                    <ButtonSection onPress={() => this._handlePlaceOrder(shop)}>
                        <Text style={styles.buttonText}>Place Order</Text>
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
        fontSize: 14,
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
    },
    errorText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: colors.red,
    },
});