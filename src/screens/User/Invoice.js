import React, { Component } from 'react';
import { AppState, Text, View, TouchableOpacity, AsyncStorage, StyleSheet, SectionList, ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../theme';
import Moment from 'moment';
import Axios from 'axios';
import { apis } from '../../constants/apis';


const Container = styled.ScrollView`
  background-color: ${colors.lightGray};
`;

const Section = styled.View`
  background-color: ${colors.white};
  padding: 10px;
  margin-bottom: 5px;
`;

const SectionTitle = styled.View`
  flex: 1;
`;

const SectionSubTitle = styled.Text`
  flex: 1;
  text-align: right;
`;

const Footer = styled.View`
display: flex;
flex-direction: row; 
padding: 3px 10px;
`;

const ProductCardCont = styled.View`
    background-color: ${colors.white};
    display: flex;
    flex-direction: row;
    padding: 5px;
`;

const ProductImage = styled.Image`
flex: 1;
width: 100%;
height: 70px;
`;

const ProductDetails = styled.View`
flex: 2;
padding: 0 5px;
`;


export default class Invoice extends Component {
    static navigationOptions = {
        title: 'Order Details'
    }

    constructor() {
        super();

        this.state = {
            isLoading: true,    
            dataSource: null,
        }

        this._getOrderDetails = this._getOrderDetails.bind(this);
    }

    componentDidMount() {
        this._getOrderDetails();
    }

    _getOrderDetails() {
        Axios.get(apis.urls.order.main + "/" + this.props.navigation.state.params.orderID, {
            headers: {
                token: this.props.screenProps.user.token && this.props.screenProps.user.token,
            }
        })
            .then((response) => {
                this.setState({
                    isLoading: false,
                    dataSource: response.data,
                }, () => {
                    console.log("Retrieved Order Details");

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

    Capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
        }

    render() {
        const { navigation, screenProps } = this.props;
        const { dataSource } = this.state;

        const customer_fn = screenProps.user.user.first_name != null ? screenProps.user.user.first_name : '';
        const customer_ln = screenProps.user.user.last_name != null ? screenProps.user.user.last_name : '';
        const customer = this.Capitalize(customer_fn) + " " + this.Capitalize(customer_ln);


        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }


        return (
            <Container>
                <Section>
                    <Text style={styles.titleText}>{dataSource.shop.name.toUpperCase()}</Text>
                    <Text style={styles.baseText}>Shop Info</Text>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Text style={styles.subText}>Email: email@example.com</Text>
                        <Text style={styles.subText}>Tel: 12345678</Text>
                    </View>
                </Section>
                <View style={{ backgroundColor: colors.gold, padding: 10 }}>
                    <Text style={styles.headerText}>Customer</Text>
                </View>

                <Section>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.titleText}>{customer != ' ' ? customer : screenProps.user.user.nickname}</Text>
                            <Text style={styles.subText}>{screenProps.user.user.address != null ? screenProps.user.user.address : 'N/A'}</Text>
                            <Text style={styles.subText}>{screenProps.user.user.mobile_phone != null ? screenProps.user.user.mobile_phone : 'N/A'}</Text>
                            <Text style={styles.subText}>{ screenProps.user.user.email}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginBottom: 3 }}>
                                <Text style={styles.titleText}>Order No.</Text>
                                <Text style={styles.subText}>{dataSource.id}</Text>
                            </View>
                            <View>
                                <Text style={styles.titleText}>Delivery Date</Text>
                                <Text style={styles.subText}>DD/MM/YYYY</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginBottom: 3 }}>
                                <Text style={styles.titleText}>Date</Text>
                                <Text style={styles.subText}>{Moment(dataSource.order_date).format('MMM D, YYYY HH:mm')}</Text>
                            </View>
                            <View>
                                <Text style={styles.titleText}>Payment Status</Text>
                                <Text style={styles.subText}>{dataSource.payment_status}</Text>
                            </View>
                        </View>
                    </View>
                </Section>
                {
                    dataSource.shop_order.product.map((prod, index) => 
                       <Section key={index}>
                            <Text style={styles.titleText}>{prod.product_id}</Text>
                            <ProductCardCont>
                                <ProductImage source={{ uri: prod.image_url }} />
                                <ProductDetails>
                                    <Text style={styles.titleText} numberOfLines={2} ellipsizeMode="tail">{prod.name}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[styles.subText, { paddingRight: 10 }]}>Size: {prod.attribute.size != null ? prod.attribute.size.name : 'NA'}</Text>
                                        <Text style={styles.subText}>Color: {prod.attribute.color != null ? prod.attribute.color.name : 'NA'}</Text>
                                    </View>
                                    <Text style={styles.subText}>Quantity: {prod.quantity}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[styles.subText, { paddingRight: 10 }]}>Price: ${prod.price_discounted != null ? prod.price_discounted : prod.price}</Text>
                                        <Text style={styles.subText}>Amount: ${prod.total_price_discounted != null ? prod.total_price_discounted : prod.total_price}</Text>
                                    </View>
                                </ProductDetails>
                            </ProductCardCont>
                        </Section>

                    )
                }
                <Section>
                    <Text style={[styles.baseText, { fontWeight: 'bold', color: colors.turquoise, textAlign: 'center', fontStyle: 'italic' }]}>Thank you for your patronage!</Text>
                    <Footer>
                        <Text style={[styles.baseText, { fontWeight: 'bold', flex: 1 }]}>Sub Total</Text>
                        <Text style={[styles.baseText, { fontWeight: 'bold', flex: 1, textAlign: 'right' }]}>${dataSource.shop_order.total_amount_discounted != null ? dataSource.shop_order.total_amount_discounted  : dataSource.shop_order.total_amount }</Text>
                    </Footer>
                    <Footer>
                        <Text style={[styles.baseText, { fontWeight: 'bold', flex: 1 }]}>Shipment Fee</Text>
                        <Text style={[styles.baseText, { fontWeight: 'bold', flex: 1, textAlign: 'right' }]}>${dataSource.shop_order.shipment_fee_computed}</Text>
                    </Footer>
                    <Footer>
                        <Text style={[styles.titleText, { fontWeight: 'bold', flex: 1 }]}>TOTAL</Text>
                        <Text style={[styles.titleText, { fontWeight: 'bold', flex: 1, textAlign: 'right' }]}>${dataSource.shop_order_total}</Text>
                    </Footer>
                </Section>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    baseText: {
        fontFamily: 'Roboto',
        fontSize: 14,
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
    },
    subText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: colors.gray,
        paddingRight: 3,
    },
    headerText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: colors.white,
        fontWeight: 'bold',
    },
});
