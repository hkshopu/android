import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ToastAndroid, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../../theme';
import Axios from 'axios';
import { apis } from '../../constants/apis';
import Spinner from '../../components/Spinner';
import { connect } from 'react-redux';
import { addToCart } from '../../reducers/auth';

const { width } = Dimensions.get('window');
const imgWidth = width * 0.405;
const imgHeight = width * 0.39;

const ImageContainer = styled.Image`
  width: ${imgWidth};
  height: ${imgHeight};
  margin-top: 50px;
  margin-bottom: 30px;
`;

const Container = styled.ScrollView`
flex: 1;
  background-color: ${colors.white};
`;

const Section = styled.View`
`;

const SectionContent = styled.View`
  background-color: ${colors.lightGray};
`;

const SectionBlock = styled.View`
  background-color: ${colors.white};
  display: flex;
  flex-wrap: wrap;
  margin: 5px;
`;

const SectionHeader = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray};
  border-style: solid;
  padding: 5px;
`;

const SectionBlockDetails = styled.View`
  flex: 1;
  justify-content: space-around;
  padding-left: 10px;
`;

const StyledButton = styled.TouchableOpacity`
  margin: 2px;
  padding: 5px;
  background-color: ${colors.gold};
  border-radius: 5;
`;

const StyledButtonRed = styled.TouchableOpacity`
  flex-direction: row;
  margin: 2px;
  padding: 5px;
  background-color: ${colors.red};
  border-radius: 5;
`;

const ProductCardContainer = styled.TouchableOpacity`
  flex-basis: 50%;
  justify-content: flex-end;
=`;

const ProductCardCont = styled.View`
    background-color: ${colors.white};
    display: flex;
    flex-direction: row;
    padding: 5px;
`;

const ProductImage = styled.Image`
flex: 1;
width: 100%;
height: 100px;
`;

const ProductDetails = styled.View`
flex: 2;
padding: 0 5px;
`;

const ProductDetailsLeft = styled.View`
display: flex;
flexDirection: row;
flexWrap: wrap;
alignItems: center;
justifyContent: space-between;
`;

const StyledFormPanel = styled.View`
  flex: 1;
  margin-top: 10;
  align-items: center;
  justify-content: center;
  background-color: ${colors.white};
`;

class ShoppingCart extends Component {
    static navigationOptions = {
        title: 'Cart'
    }

    constructor() {
        super();

        this.state = {
            isLoading: true,
            dataSource: null,
            selectedQuantity: 0,
            isModalVisible: false,
        }

        this._getCartItems = this._getCartItems.bind(this);
        this._showAlertDeleteCofirmation = this._showAlertDeleteCofirmation.bind(this);
        this._addToCart = this._addToCart.bind(this);
        this._removeFromCart = this._removeFromCart.bind(this);
    }

    componentDidMount() {
        return this._getCartItems();
    }

    _getCartItems() {
        Axios.get(apis.urls.cart.main + "/undefined", {
            headers: {
                token: this.props.screenProps.user.token && this.props.screenProps.user.token,
            }
        })
            .then((response) => {
                this.setState({
                    isLoading: false,
                    dataSource: response.data,
                }, () => {
                    console.log("successfully retrieved cart");
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    isModalVisible: false,
                });
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

    _addToCart(cartID, productID, attributeID, q) {
        this.setState({ isModalVisible: true });
        Axios.post(apis.urls.cart.main, {
            cart_id: cartID,
            product_id: productID,
            attribute_id: attributeID,
            quantity: q,
        }, {
                headers: {
                    token: this.props.screenProps.user.token && this.props.screenProps.user.token,
                }
            }).then((response) => {
                this.setState({
                    isModalVisible: false,
                    dataSource: response.data,
                }, () => {
                    ToastAndroid.show(
                        'Successfully added to cart.',
                        ToastAndroid.LONG
                    );
                    let quantity = this.props.screenProps.cart + q
                    this.props.onAddToCart(quantity);    
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    isModalVisible: false,
                });
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

    _removeFromCart(shopID, cartItemID = null, q = 0) {
        console.log("ShopID: " + shopID);
        console.log("CartID: " + cartItemID);
        console.log("Quantity: " + q);

        this.setState({ isModalVisible: true });
        Axios.delete(apis.urls.cart.main, {// + "?shop_id="+shopID+"&cart_item_id="+cartItemID+"&quantity="+q, {
            headers: {
                token: this.props.screenProps.user.token && this.props.screenProps.user.token,
            },
            params: {
                shop_id: shopID,
                cart_item_id: cartItemID,
                quantity: q,
            },
        })
            .then((response) => {
                console.log(response.data);

                this.setState({
                    isModalVisible: false,
                    dataSource: response.data,
                }, () => {
                    
                    ToastAndroid.show(
                        'Successfully removed from cart.',
                        ToastAndroid.LONG
                    );
                    let quantity = this.props.screenProps.cart - q
                    this.props.onAddToCart(quantity);    
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    isModalVisible: false,
                });
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

    _showAlertDeleteCofirmation(type, shopID, cartItemID, quantity) {
        Alert.alert(
            'Delete from cart',
            'Are you sure you want to delete item(s)?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Delete', onPress: () => (type == 1 ? this._removeFromCart(shopID, null, quantity) : this._removeFromCart(shopID, cartItemID, quantity)) },
            ],
        );
    }

    render() {
        const { navigation } = this.props;
        const { dataSource } = this.state;

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <Container>
                <Spinner isVisible={this.state.isModalVisible} />
                <Section>
                    <SectionContent>
                        {
                            (dataSource.shop && dataSource.shop.length > 0) ?
                                dataSource.shop.map((shop, index) => (
                                    <SectionBlock key={index}>
                                        <SectionHeader>
                                            <SectionBlockDetails>
                                                <Text style={styles.titleText}>{shop.name_en}</Text>
                                            </SectionBlockDetails>
                                            <StyledButtonRed onPress={() => this._showAlertDeleteCofirmation(1, shop.shop_id, null, shop.total_quantity)}>
                                                <FontAwesome name='minus-circle' size={12} color={colors.white} style={{ margin: 3 }} />
                                                <Text style={styles.buttonText}>Delete</Text>
                                            </StyledButtonRed>
                                            <StyledButton onPress={() => navigation.navigate('ShippingDetails', { shop: shop })}>
                                                <Text style={styles.buttonText}>Check Out</Text>
                                            </StyledButton>

                                        </SectionHeader>
                                        {
                                            shop.product.map((product, pindex) => {
                                                return (
                                                    <ProductCardContainer key={pindex}
                                                        onPress={() => navigation.navigate('Product', { id: product.product_id, name: product.name_en })}>
                                                        <ProductCardCont>
                                                            <ProductImage source={{ uri: product.image_url }} />
                                                            <ProductDetails>
                                                                <Text style={styles.titleText} numberOfLines={2} ellipsizeMode="tail">{product.name_en}</Text>
                                                                <Text style={styles.subTitleText} numberOfLines={1} ellipsizeMode="tail">
                                                                { product.attribute.color != null ? product.attribute.color.name : '' }
                                                                { product.attribute.color != null && product.attribute.size ? ', ' : '' }
                                                                { product.attribute.size != null ? product.attribute.size.name : '' }</Text>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <View style={{ flex: 1 }}>
                                                                        <ProductDetailsLeft style={{ marginBottom: 5 }}>
                                                                            <View style={{ flex: 1 }}>
                                                                                <Text style={styles.priceText} numberOfLines={1}>
                                                                                    HK$ {
                                                                                        product.price_discounted == null ?
                                                                                        product.price : product.price_discounted
                                                                                        }
                                                                                </Text>
                                                                                <Text style={styles.strike} numberOfLines={1}>
                                                                                    { product.price_discounted != null && 'HK$' + product.price}
                                                                                </Text>
                                                                            </View>
                                                                        </ProductDetailsLeft>
                                                                        <View style={{ flexDirection: 'row', marginRight: 5, }}>
                                                                            <TouchableOpacity onPress={
                                                                                () => {
                                                                                    this._removeFromCart(shop.shop_id, product.cart_item_id, 1);
                                                                                }
                                                                            }>
                                                                                <FontAwesome name='minus-circle' size={20} color={colors.gold} />
                                                                            </TouchableOpacity>
                                                                            <Text style={
                                                                                {
                                                                                    width: 40
                                                                                    , height: 23
                                                                                    , borderRadius: 5
                                                                                    , borderWidth: 1
                                                                                    , borderColor: colors.gray
                                                                                    , textAlign: "center"
                                                                                    , fontSize: 14
                                                                                    , padding: 2
                                                                                    , margin: 2
                                                                                }
                                                                            }>{product.quantity}</Text>
                                                                            <TouchableOpacity onPress={
                                                                                () => {
                                                                                    this._addToCart(shop.shop_id, product.product_id, product.attribute_id, 1);
                                                                                }
                                                                            }>
                                                                                <FontAwesome name='plus-circle' size={20} color={colors.gold} />
                                                                            </TouchableOpacity>
                                                                        </View>

                                                                    </View>
                                                                    <View style={{ flex: 0.5, justifyContent: 'center' }}>
                                                                        <TouchableOpacity style={{ alignSelf: 'center', }} onPress={() => this._showAlertDeleteCofirmation(2, shop.shop_id, product.cart_item_id, product.merge_count)} >
                                                                            <FontAwesome name='trash' size={25} color={colors.gray} />
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                            </ProductDetails>
                                                        </ProductCardCont>
                                                    </ProductCardContainer>
                                                )
                                            })
                                        }
                                    </SectionBlock>
                                ))
                                :
                                <StyledFormPanel>
                                    <ImageContainer source={require("../../img/no-items.png")} />
                                    <Text style={styles.textImage}> There are no items in this cart. </Text>
                                </StyledFormPanel>
                        }
                    </SectionContent>
                </Section>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.turquoise,
    },
    subTitleText: {
        fontSize: 12,
        color: colors.gray,
        marginBottom: 5,
    },
    priceText: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.gray,
    },
    strike: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        color: colors.gray,
    },
    buttonText: {
        fontSize: 16,
        color: colors.white,
        marginRight: 5,
        marginLeft: 5,
    },
    textImage: {
        fontSize: 16,
        color: colors.gray,
    }
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);