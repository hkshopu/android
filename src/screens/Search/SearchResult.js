import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, Image, Alert } from 'react-native';
import styled from 'styled-components/native';
import ProductCard from '../../components/ProductCard';
import ProductCardList from '../../components/ProductCardList';
import BottomToolbarThin from '../../components/BottomToolbarThin';
import { colors } from "../../theme";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating';
import Axios from 'axios';
import { apis } from '../../constants/apis';
import { strings } from '../../constants/strings';
import ModalSortCustom from 'react-native-modal';
import { connect } from 'react-redux';
import { searchHistoryAdd, searchHistoryDelete } from '../../reducers/auth';

const ProductContainer = styled.View`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

const ProductContainerList = styled.View`
  display: flex;
  flex-wrap: wrap;
  margin: 5px;
`;
const ProductCardContainer = styled.TouchableOpacity`
  flex-basis: 50%;
  justify-content: flex-end;
`;

const StyleText = styled.TouchableOpacity`
  border-bottom-width: 1px ;
  border-bottom-color: ${colors.gray};
  padding-top: 5px;
  padding-bottom: 5px;
`;

const StyledSearchBox = styled.View`
flex-basis: 75%;
  flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${colors.white}; 
  border: 1px solid ${colors.white};
  border-radius: 10;
  margin-top: 35px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 15px;
  padding-left: 10px;
  padding-right: 10px;
`;

const ShopContainer = styled.View`
background-color: ${colors.white};
  border: 1px solid #cccccc;
  padding: 5px;
  margin: 3px;
`;

const ShopHeader = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const ShopImage = styled.Image`
  padding: 5px;
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const ShopTitle = styled.Text`
  margin-right: 10px;
  font-weight: bold;
`;

const ShopCategory = styled.Text`
  color: #cccccc;
  font-style: italic;
`;

const ShopFeaturedProducts = styled.View`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 20px 0;
`;

const ShopFeaturedProduct = styled.TouchableOpacity`
  flex: 1;
  margin: 1%;
  padding: 5px;
  height: auto;
  border: 1px solid #cccccc;
`;

const ShopQuickAction = styled.View`
  flex: 1;
  align-items: center;
  padding: 10px;
  flex-direction: row;
  justify-content: space-around;
`;

const getFirstImage = images => {
    if (typeof images === 'undefined' || images.length === 0) return 'https://dummyimage.com/600x400/ccc/000';

    return images[0];
}

class SearchResult extends Component {
    constructor() {
        super();
        this.state = {
            text: '',
            isFocused: true,
            isLoading: false,
            sorter: null,
            isSortModalProductVisible: false,
            isSortModalShopVisible: false,
            layoutView: strings.layout.grid,
        }

        this._setRenderState = this._setRenderState.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._getProductByName = this._getProductByName.bind(this);
        this._getShopByName = this._getShopByName.bind(this);
        this._setSortModalVisible = this._setSortModalVisible.bind(this);
        this._clearSearches = this._clearSearches.bind(this);
    }

    async _getProductByName(search) {
        const { screenProps, navigation } = this.props;

        try {
            const response = await Axios.get(apis.urls.product.main, {
                params: {
                    name_en: search,
                    shop_id: navigation.state.params.id,
                },
                headers: {
                    token: screenProps.user.token ? screenProps.user.token : '',
                }
            });
            this.setState({
                isLoading: false,
                dataSource: response.data,
            }, () => {
                this.props.onSearch(search);
            });
        }
        catch (error) {
            console.log(JSON.stringify(error));
            Alert.alert('Something Went Wrong', error.response.data.message, [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ], { cancelable: false });
        }

    }

    async _getShopByName(search) {
        const { screenProps } = this.props;

        try {
            const response = await Axios.get(apis.urls.shop.main, {
                params: {
                    name_en: search,
                },
                headers: {
                    token: screenProps.user.token ? screenProps.user.token : '',
                }
            });
            this.setState({
                isLoading: false,
                dataSource: response.data,
            }, () => {
                this.props.onSearch(search);
            });
        }
        catch (error) {
            console.log(JSON.stringify(error));
            Alert.alert('Something Went Wrong', error.response.data.message, [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ], { cancelable: false });
        }
    }

    _setSortModalVisible(isSortProduct, isSortShop) {
        this.setState({
            isSortModalProductVisible: isSortProduct,
            isSortModalShopVisible: isSortShop,
        });
    }

    _setRenderState(text, state, loading = false) {
        this.setState({
            text: text,
            isFocused: state,
            isLoading: loading,
        });
    }

    _clearSearches() {
        this.props.onSearchDelete();
    }

    _renderItem({ item }) {
        const { navigation } = this.props;

        return (
            <View>
                <ShopContainer>
                    <ShopHeader onPress={() => navigation.navigate('Shop', { ...item })}>
                        {item.logo_url != null ?
                            <ShopImage source={{ uri: item.logo_url }} /> :
                            <ShopImage source={require("../../img/no_image.jpg")} />}
                        <ShopTitle>{item.name_en}</ShopTitle>
                        <ShopCategory>{item.category.name}</ShopCategory>
                    </ShopHeader>
                    {
                        item.featured_products.length > 0 &&
                        <ShopFeaturedProducts>
                            {
                                item.featured_products.map((product, index) => (
                                    <ShopFeaturedProduct key={index} onPress={() => navigation.navigate('Product', { id: product.id, name: product.product_name_en })}>
                                        {product.image_url != null ?
                                            <Image style={{ width: '100%', height: 70 }} source={{ uri: product.image_url }} /> :
                                            <Image style={{ width: '100%', height: 70 }} source={require("../../img/no_image.jpg")} />
                                        }
                                    </ShopFeaturedProduct>
                                ))
                            }
                        </ShopFeaturedProducts>
                    }
                    <View>
                        <Text style={{ fontWeight: 'bold' }}>Shop Description</Text>
                        <Text numberOfLines={4} ellipsizeMode="tail">{item.description_en}</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                        <ShopQuickAction>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={item.rating.average}
                                emptyStarColor={colors.gold}
                                fullStarColor={colors.gold}
                                starSize={20}
                            />
                        </ShopQuickAction>
                        <ShopQuickAction>
                            <View style={{ flexDirection: "row" }}>
                                <Ionicons name="md-heart" size={20} color={colors.red} />
                                <Text style={{ marginLeft: 5 }}>{item.followers}</Text>
                            </View>
                        </ShopQuickAction>
                        <ShopQuickAction>
                            <View style={{ flexDirection: "row" }}>
                                <Ionicons name="ios-chatbubbles" size={20} color={colors.gold} />
                                <Text style={{ marginLeft: 5 }}>{item.comments}</Text>
                            </View>
                        </ShopQuickAction>
                    </View>
                </ShopContainer>
            </View>
        )
    }

    render() {
        const { navigation } = this.props;

        let sortModal;
        let bottomToolbar;
        let renderSearchResult;

        const renderSearchHistory = (
            <View style={{ margin: 10 }}>
                {this.props.screenProps.search.length > 0 &&
                    <View style={{ flexDirection: 'row', display: 'flex', marginBottom: 10 }}>
                        <Text style={[styles.baseText, { flex: 1 }]}>Search History</Text>
                        <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={() => this._clearSearches()}>
                            <FontAwesome name='trash' size={15} color={colors.gray} />
                        </TouchableOpacity>
                    </View>
                }

                {this.props.screenProps.search.map((searchHistory, index) => (
                    <StyleText key={index} onPress={() => {
                        this._setRenderState(searchHistory, false, true);
                    }}>
                        <Text>{searchHistory}</Text>
                    </StyleText>
                ))}
            </View>
        );

        const renderSearchResultsProdGrid = (
            <ScrollView>
                <ProductContainer>
                    {(this.state.dataSource && this.state.dataSource.length > 0)
                        && this.state.dataSource.sort((a, b) => {
                            if (this.state.sorter == strings.sorter.date) {
                                return a.created_at < b.created_at;
                            } else if (this.state.sorter == strings.sorter.rating) {
                                return a.rating.average < b.rating.average;
                            } else if (this.state.sorter == strings.sorter.priceLH) {
                                return a.price_original > b.price_original;
                            } else if (this.state.sorter == strings.sorter.priceHL) {
                                return a.price_original < b.price_original;
                            }
                        }).map((product, index) => (
                            <ProductCardContainer key={index}
                                onPress={() => navigation.navigate('Product', { id: product.id, name: product.name_en })}>
                                <ProductCard {...product} hasActions />
                            </ProductCardContainer>
                        ))}
                </ProductContainer>
            </ScrollView>
        );

        const renderSearchResultsProdList = (
            <ScrollView>
                <ProductContainerList>
                    {(this.state.dataSource && this.state.dataSource.length > 0)
                        && this.state.dataSource.sort((a, b) => {
                            if (this.state.sorter == strings.sorter.date) {
                                return a.created_at < b.created_at;
                            } else if (this.state.sorter == strings.sorter.rating) {
                                return a.rating.average < b.rating.average;
                            } else if (this.state.sorter == strings.sorter.priceLH) {
                                return a.price_original > b.price_original;
                            } else if (this.state.sorter == strings.sorter.priceHL) {
                                return a.price_original < b.price_original;
                            }
                        }).map((product, index) => (
                            <ProductCardContainer key={index} onPress={() => navigation.navigate('Product', { id: product.id, name: product.name_en })}>
                                <ProductCardList {...product} hasActions />
                            </ProductCardContainer>
                        ))}
                </ProductContainerList>
            </ScrollView>
        );

        const renderSearchResultShop = (
            <FlatList
                data={(this.state.dataSource && this.state.dataSource.length > 0)
                    && this.state.dataSource.sort((a, b) => {
                        if (this.state.sorter == strings.sorter.name) {
                            return a.name_en.localeCompare(b.name_en);
                        } else if (this.state.sorter == strings.sorter.rating) {
                            return a.rating.average < b.rating.average;
                        }
                    }).map((blog, index) => (
                        blog
                    ))
                }
                renderItem={this._renderItem}
                keyExtractor={(item, index) => item.id.toString()}
            />
        );

        const bottomToolbarProd = (
            <BottomToolbarThin actions={[
                {
                    icon: 'filter',
                    onClickHandler: () => console.log('clicked Filter')
                },
                {
                    icon: 'sort',
                    onClickHandler: () => {
                        this._setSortModalVisible(!this.state.isSortModalProductVisible, this.state.isSortModalShopVisible)

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
        );

        const bottomToolbarShop = (
            <BottomToolbarThin actions={[
                {
                    icon: 'filter',
                    onClickHandler: () => console.log('clicked Filter')
                },
                {
                    icon: 'sort',
                    onClickHandler: () => {
                        this._setSortModalVisible(this.state.isSortModalProductVisible, !this.state.isSortModalShopVisible)
                    }
                }
            ]} />
        )

        const modalSortProduct = (
            <ModalSortCustom
                isVisible={this.state.isSortModalProductVisible}
                onBackButtonPress={() => {
                    this._setSortModalVisible(!this.state.isSortModalProductVisible)
                }}
                onBackdropPress={() => {
                    this._setSortModalVisible(!this.state.isSortModalProductVisible)
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
                                isSortModalProductVisible: false,
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
                                isSortModalProductVisible: false,
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
                                isSortModalProductVisible: false,
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
                                isSortModalProductVisible: false,
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
        )

        const modalSortShop = (
            <ModalSortCustom
                isVisible={this.state.isSortModalShopVisible}
                onBackButtonPress={() => {
                    this._setSortModalVisible(!this.state.isSortModalShopVisible)
                }}
                onBackdropPress={() => {
                    this._setSortModalVisible(!this.state.isSortModalShopVisible)
                }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    paddingBottom: 10,
                }}>
                    <View style={{
                        height: 150,
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
                                sorter: strings.sorter.name,
                                isSortModalShopVisible: false,
                            })
                        } style={[this.state.sorter == strings.sorter.name ? { backgroundColor: colors.selected_option } : { backgroundColor: colors.white }]}>
                            <View style={{
                                padding: 10,
                            }}>
                                <Text>Shop Title (A-Z)</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={
                            () => this.setState({
                                sorter: strings.sorter.rating,
                                isSortModalShopVisible: false,
                            })
                        } style={[this.state.sorter == strings.sorter.rating ? { backgroundColor: colors.selected_option } : { backgroundColor: colors.white }]}
                        >
                            <View style={{
                                padding: 10,
                            }}>
                                <Text>Top-rating</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ModalSortCustom>
        )

        const loading = (
            <View style={{ flex: 1, padding: 20 }}>
                <ActivityIndicator />
            </View>
        )

        const searchNotFound = (
            <ScrollView>
                <Text>No items found.</Text>
            </ScrollView>
        )

        if (navigation.state.params.searchType === apis.types.product) {
            sortModal = modalSortProduct;
            bottomToolbar = bottomToolbarProd;
            if (this.state.isLoading) {
                renderSearchResult = loading;
                this._getProductByName(this.state.text);
            } else {
                if (this.state.dataSource && this.state.dataSource.length > 0) {
                    renderSearchResult = this.state.layoutView == strings.layout.grid ? renderSearchResultsProdGrid : renderSearchResultsProdList;
                } else {
                    renderSearchResult = searchNotFound;
                }
            }
        } else {
            sortModal = modalSortShop;
            bottomToolbar = bottomToolbarShop;
            if (this.state.isLoading) {
                renderSearchResult = loading;
                this._getShopByName(this.state.text);
            } else {
                if (this.state.dataSource && this.state.dataSource.length > 0) {
                    renderSearchResult = renderSearchResultShop;
                } else {
                    renderSearchResult = searchNotFound;
                }
            }
        }

        var placeHolderVal = "Search product here...";
        if (navigation.state.params.id !== null) {
            placeHolderVal = "Search in " + navigation.state.params.name;
        } else {
            if (navigation.state.params.searchType === apis.types.shop) {
                placeHolderVal = "Search shop here...";
            }
        }

        return (
            <View style={{ flex: 1, }}>

                <View style={{
                    flexDirection: "row",
                    height: 80,
                    backgroundColor: colors.turquoise,
                    marginBottom: 5,
                }}>
                    <TouchableOpacity style={{ marginTop: 35, marginLeft: 15, }} onPress={() => navigation.goBack()}>
                        <Ionicons name="md-arrow-back" size={25} color={colors.white} />
                    </TouchableOpacity>
                    <StyledSearchBox>
                        <FontAwesome name="search" size={16} color={colors.gray} />
                        <TextInput
                            style={styles.input}
                            placeholder={placeHolderVal}
                            onChangeText={(text) => this._setRenderState(text, true)}
                            value={this.state.text}
                            underlineColorAndroid="transparent"
                            returnKeyType='search'
                            autoFocus={true}
                            onFocus={(i) => this._setRenderState(this.state.text, true)}
                            onSubmitEditing={() => this._setRenderState(this.state.text, false, true)} //perform query here
                        />
                    </StyledSearchBox>
                </View>
                {this.state.isFocused ? renderSearchHistory : renderSearchResult}
                {!this.state.isFocused && sortModal}
                {!this.state.isFocused && bottomToolbar}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        paddingTop: 0,
        paddingRight: 10,
        paddingBottom: 0,
        paddingLeft: 10,
        color: '#424242',
    },
    baseText: {
        color: colors.gray,
    },
    searchTerms: {
        marginBottom: 5,
    },
});

const mapStateToProps = state => {
    return {
        search: state.status,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSearch: (search) => {
            dispatch(searchHistoryAdd(search))
        },
        onSearchDelete: () => {
            dispatch(searchHistoryDelete())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);