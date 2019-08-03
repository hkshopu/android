import React, { Component } from 'react';
import { KeyboardAvoidingView, Text, View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../theme';
import Axios from 'axios';
import { apis } from '../../constants/apis';


const Section = styled.View`
background-color: ${colors.white};
border-bottom-width: 1px; 
border-bottom-color: ${colors.gray};
border-style: solid;
`;

const SectionHeader = styled.View`
display: flex;
flex-direction: row;
padding: 5px; 
margin-left: 5;
 margin-right: 5;
  margin-bottom: 10;
  `;

const SectionBlock = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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

const SectionBlockRightSidebar = styled.View`
  flex: 1;
  padding: 5px;
  align-items: center;
  justify-content: center;
`;

const SectionFooter = styled.View`
display: flex;
flex-direction: row;
justify-content: flex-end;
padding: 5px; 
margin-left: 5px;
margin-right: 5px;
margin-top: 10px;
`;

const StyledButton = styled.TouchableOpacity`
  margin: 2px;
  padding: 5px 10px;
  background-color: ${colors.turquoise};
  border-radius: 5;
`;

export default class BuyRecord extends Component {
    static navigationOptions = {
        title: 'Buy Record'
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
                    console.log("retrieved order");
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
            <ScrollView style={{ flex: 1 }} >
                {
                    this.state.dataSource.map((item, val) => 
                        <Section key={val}>
                            <SectionHeader>
                                <Text style={[styles.headerText, { flex: 1 }]}>{item.product_list[0].shop_name}</Text>
                                <View style={{ flex: 0.5 }}>
                                    <Text style={[styles.subText, { fontStyle: 'italic' }]}>{item.product_list[0].payment_status}</Text>
                                    <Text style={[styles.subText, { fontStyle: 'italic' }]}>{item.product_list[0].order_item_status}</Text>
                                </View>
                            </SectionHeader>
                            {
                                item.product_list.map((prod, index) => (
                                    <SectionBlock key={index}>
                                        <SectionBlockImageContainer>
                                            <SectionBlockImage source={{ uri: prod.product_image != null ? prod.product_image : 'https://dummyimage.com/600x400/ccc/000' }} />
                                        </SectionBlockImageContainer>
                                        <SectionBlockDetails>
                                            <Text style={[styles.baseText, { fontWeight: 'bold' }]}>{ prod.product_name }</Text>
                                            <Text style={[styles.baseText, { fontSize: 12 }]} numberOfLines={1} ellipsizeMode="tail">
                                                {prod.product_description}
                                        </Text>
                                            <Text style={[styles.baseText, { fontWeight: 'bold' }]}>HK${prod.price}</Text>
                                            <Text style={styles.baseText}>x{prod.quantity   }</Text>
                                        </SectionBlockDetails>
                                        <SectionBlockRightSidebar>
                                            <StyledButton onPress={() => console.log("presssed!!!")}>
                                                <Text style={[styles.buttonText, { fontStyle: 'italic' }]}>Finish</Text>
                                            </StyledButton>
                                        </SectionBlockRightSidebar>
                                    </SectionBlock>
                                ))
                            }

                            <SectionFooter>
                                <Text style={styles.baseText}>{item.order_total_quantity} item, Total: </Text>
                                <Text style={[styles.fieldText, { fontWeight: 'bold' }]}>HK${item.order_total_price}</Text>
                            </SectionFooter>
                        </Section>

                    )
                }
            </ScrollView>

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
        fontSize: 16,
        color: colors.white,
    },
    headerText: {
        fontFamily: 'Roboto',
        color: colors.turquoise,
        fontSize: 16,
        fontWeight: 'bold',
    },
    fieldText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: colors.turquoise,
    },
    subText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: colors.gray,
    },

});