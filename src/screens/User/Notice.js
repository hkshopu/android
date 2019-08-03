import React, { Component } from 'react';
import { AppState, Text, View, TouchableOpacity, AsyncStorage, StyleSheet, SectionList, ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../theme';
import Moment from 'moment';
import Axios from 'axios';
import { apis } from '../../constants/apis';

const Container = styled.ScrollView`
  background-color: ${colors.white};
`;

const Section = styled.TouchableOpacity`
padding: 20px;
border-bottom-width: 1px;
border-style: solid;
border-bottom-color: ${colors.turquoise};
  flex-direction: row;
`;

const SectionTitle = styled.View`
  flex: 1;
`;

const SectionSubTitle = styled.Text`
  flex: 1;
  text-align: right;
`;


export default class Notice extends Component {
    static navigationOptions = {
        title: 'My Account'
    }

    constructor() {
        super();

        this.state = {
            isLoading: true,
            dataSource: null,
        }

        this._getOrder = this._getOrder.bind(this);
    }

    componentDidMount() {
        return this._getOrder();
    }

    _getOrder() {
        Axios.get(apis.urls.order.main, {
            headers: {
                token: this.props.screenProps.user.token && this.props.screenProps.user.token,
            }
        })
            .then((response) => {
                this.setState({
                    isLoading: false,
                    dataSource: response.data,

                }, () => {
                    console.log("retrieve order");
                });
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
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

    render() {
        const { navigation, screenProps } = this.props;
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <Container>
                {
                    this.state.dataSource.map((item, index) => (
                        <Section key={index} onPress={() => {
                            return navigation.navigate('Invoice', {orderID: item.order_id});
                        }}>
                            <SectionTitle >
                                <Text style={styles.headerText}>{item.order_id}</Text>
                                <Text style={styles.baseText}>Order payment is {item.product_list[0].payment_status}</Text>
                            </SectionTitle>
                            <SectionSubTitle>
                                <Text style={[styles.baseText, { textAlign: 'right' }]}> {Moment(item.product_list[0].order_date).format('MMM D, YYYY HH:mm')} </Text>
                            </SectionSubTitle>
                        </Section>
                    ))
                }
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
        color: colors.gray,
        fontWeight: 'bold',
        justifyContent: 'flex-start',
    },
});
