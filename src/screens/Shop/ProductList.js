import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator, Text, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import ProductCard from '../../components/ProductCard';
import ProductCardList from '../../components/ProductCardList';
import BottomToolbarThin from '../../components/BottomToolbarThin';
import { colors } from '../../theme';
import Axios from 'axios';
import { apis } from '../../constants/apis';
import { strings } from '../../constants/strings';
import ModalSortCustom from 'react-native-modal';

const Container = styled.View`
  flex: 1;
  background-color: ${colors.lightGray};
`;

const ProductContainer = styled.View`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 5px;
  background-color: ${colors.lightGray};
`;

const ProductContainerList = styled.View`
  display: flex;
  flex-wrap: wrap;
  margin: 5px;
  background-color: ${colors.lightGray};

`;

const ProductCardContainer = styled.TouchableOpacity`
  flex-basis: 50%;
  justify-content: flex-end;
  background-color: ${colors.lightGray};
`;

export default class ProductList extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            dataSource: null,
            sorter: null,
            isSortModalVisible: false,
            layoutView: strings.layout.grid,
        }

        this._getAllProduct = this._getAllProduct.bind(this);
        this._setSortModalVisible = this._setSortModalVisible.bind(this);

    }

    componentDidMount() {
        return this._getAllProduct();
    }

    async _getAllProduct() {
        this.setState({ isLoading: true });

        Axios.get(apis.urls.product.main, {
            params: {
                shop_id: this.props.navigation.state.params.id,
            },
            headers: {
                token: this.props.screenProps.user.token ? this.props.screenProps.user.token : '',
            }
        })
            .then((response) => {
                this.setState({
                    isLoading: false,
                    dataSource: response.data,
                }, () => { });
            })
            .catch((error) => {
                Alert.alert(
                    'Something Went Wrong',
                    JSON.stringify(error),
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false }
                );
            });
    }

    _setSortModalVisible(visible) {
        this.setState({ isSortModalVisible: visible });
    }

    render() {
        const { navigation } = this.props;

        return (
            <Container>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this._getAllProduct}
                            enabled={true}
                        />
                    }>
                    {this.state.layoutView === strings.layout.grid &&
                        <ProductContainer>
                            {!this.state.isLoading && this.state.dataSource.sort((a, b) => {
                                var priceA = a.price_discounted;
                                var priceB = b.price_discounted;
                                if(a.price_discounted === null) {
                                  priceA = a.price_original;
                                }
                                if(b.price_discounted === null) {
                                  priceB = b.price_original;
                                }

                                if (this.state.sorter == strings.sorter.date) {
                                    return a.created_at < b.created_at;
                                } else if (this.state.sorter == strings.sorter.rating) {
                                    return a.rating.average < b.rating.average;
                                } else if (this.state.sorter == strings.sorter.priceLH) {
                                    return priceA > priceB; 
                                } else if (this.state.sorter == strings.sorter.priceHL) {
                                    return priceA < priceB; 
                                }
                            }).map((product, index) => (
                                <ProductCardContainer key={index} onPress={() => navigation.navigate('Product', { id: product.id, name: product.name_en })}>
                                    <ProductCard {...product} hasActions />
                                </ProductCardContainer>
                            ))}
                        </ProductContainer>
                    }

                    {this.state.layoutView === strings.layout.list &&
                        <ProductContainerList>
                            {!this.state.isLoading && this.state.dataSource.sort((a, b) => {
                                var priceA = a.price_discounted;
                                var priceB = b.price_discounted;
                                if(a.price_discounted === null) {
                                  priceA = a.price_original;
                                }
                                if(b.price_discounted === null) {
                                  priceB = b.price_original;
                                }

                                if (this.state.sorter == strings.sorter.date) {
                                    return a.created_at < b.created_at;
                                } else if (this.state.sorter == strings.sorter.rating) {
                                    return a.rating.average < b.rating.average;
                                } else if (this.state.sorter == strings.sorter.priceLH) {
                                    return priceA > priceB; 
                                } else if (this.state.sorter == strings.sorter.priceHL) {
                                    return priceA < priceB; 
                                }
                            }).map((product, index) => (
                                <ProductCardContainer key={index} onPress={() => navigation.navigate('Product', { id: product.id, name: product.name_en })}>
                                    <ProductCardList {...product} hasActions />
                                </ProductCardContainer>
                            ))}
                        </ProductContainerList>
                    }
                </ScrollView>
                <ModalSortCustom
                    isVisible={this.state.isSortModalVisible}
                    onBackButtonPress={() => {
                        this._setSortModalVisible(!this.state.isSortModalVisible)
                    }}
                    onBackdropPress={() => {
                        this._setSortModalVisible(!this.state.isSortModalVisible)
                    }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        paddingBottom: 10,
                    }}>
                        <View style={{
                            height: 220,
                            backgroundColor: colors.white,
                            borderRadius: 4,
                        }}>
                            <View style={{
                                padding: 10,
                            }}>
                                <Text>Sort by </Text>
                            </View>
                            <View style={{
                                borderBottomColor: colors.gray,
                                borderBottomWidth: 1,
                                borderStyle: 'solid',
                                marginLeft: 5,
                                marginRight: 5,
                                marginTop: 5,
                                marginBottom: 15,
                            }} />

                            <TouchableOpacity onPress={
                                () => this.setState({
                                    sorter: strings.sorter.rating,
                                    isSortModalVisible: false,
                                })
                            } style={[this.state.sorter == strings.sorter.rating ? { backgroundColor: colors.selected_option } : { backgroundColor: colors.white }]}>
                                <View style={{
                                    padding: 10,
                                }}>
                                    <Text>Most popular</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={
                                () => this.setState({
                                    sorter: strings.sorter.date,
                                    isSortModalVisible: false,
                                })
                            } style={[this.state.sorter == strings.sorter.date ? { backgroundColor: colors.selected_option } : { backgroundColor: colors.white }]}>
                                <View style={{
                                    padding: 10,
                                }}>
                                    <Text>Most recent</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={
                                () => this.setState({
                                    sorter: strings.sorter.priceLH,
                                    isSortModalVisible: false,
                                })
                            } style={[this.state.sorter == strings.sorter.priceLH ? { backgroundColor: colors.selected_option } : { backgroundColor: colors.white }]}
                            >
                                <View style={{
                                    padding: 10,
                                }}>
                                    <Text>Price low to high</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={
                                () => this.setState({
                                    sorter: strings.sorter.priceHL,
                                    isSortModalVisible: false,
                                })
                            } style={[this.state.sorter == strings.sorter.priceHL ? { backgroundColor: colors.selected_option } : { backgroundColor: colors.white }]}>
                                <View style={{
                                    padding: 10,
                                }}>
                                    <Text>Price high to low</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ModalSortCustom>
                <BottomToolbarThin actions={[
                    {
                        icon: 'filter',
                        onClickHandler: () => console.log('clicked Filter')
                    },
                    {
                        icon: 'sort',
                        onClickHandler: () => {
                            this._setSortModalVisible(!this.state.isSortModalVisible)
                        }
                    },
                    {
                        icon: this.state.layoutView === strings.layout.grid ? 'th-list' : 'th-large',
                        onClickHandler: () => {
                            this.setState({
                                layoutView: this.state.layoutView === strings.layout.grid ? strings.layout.list : strings.layout.grid,
                            })
                        }
                    }
                ]} />

            </Container>
        );
    }
}
