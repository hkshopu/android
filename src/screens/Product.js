import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, ActivityIndicator, Animated, TouchableOpacity, Picker, Alert, Share } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../theme';
import BottomToolbar from '../components/BottomToolbar';
import { FontAwesome } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating';
import Axios from 'axios';
import { apis } from '../constants/apis';
import ModalCartCustom from 'react-native-modal';
import { strings } from '../constants/strings';
import { connect } from 'react-redux';
import { addToCart } from '../reducers/auth';


const { width } = Dimensions.get('window');
const height = width * 0.8;

const ProductContainer = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const ImageContainer = styled.ScrollView`
  margin-bottom: 5px;
`;

const Image = styled.Image`
  height: ${height};
  width: ${width};
`;

const ProductHeader = styled.View`
  display: flex;
  flex-direction: row;
  padding: 5px;
`;

const ProductTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const ProductCategory = styled.Text`
  font-size: 15px;
  color: ${colors.gray};
`;

const ProductPrice = styled.Text`
  flex: 1;
  text-align: right;
  font-size: 25px;
  font-weight: bold;
`;

const ProductPriceDiscounted = styled.Text`
  flex: 1;
  text-align: right;
  font-size: 15px;
  font-weight: bold;
  text-decoration-line: line-through;
  color: ${colors.gray};
`;

const Section = styled.View`
  padding: 5px 15px;
`;

const SectionHeader = styled.Text`
  font-size: 15px;
  font-weight: bold;
`;

const ProductOwnerHeader = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const ProductOwnerImage = styled.Image`
  height: 50px;
  width: 50px;
  margin-right: 10px;
`;

const ProductOwnerTitle = styled.Text`
  font-weight: bold;
  font-size: 15px;
  margin-right: 10px;
  color: ${colors.turquoise}
`;

const ProductStats = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const ProductStatItem = styled.View`
  flex: 1;
  align-items: center;
  flex-direction: row;
  margin-right: 5px;
`;

const ShopFeaturedProducts = styled.View`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 5px 0;
`;

const ShopFeaturedProduct = styled.TouchableOpacity`
  flex: 1;
  margin: 1%;
  padding: 5px;
  height: auto;
  border: 1px solid #cccccc;
`;

const StyledButton = styled.TouchableOpacity`
  margin-vertical: 5;
  padding: 10px;
  background-color: ${colors.turquoise};
  border-radius: 10;
`;

const Circle = styled.View`
  border-radius: 25;
  border-color: ${colors.gray};
  width: 25;
  height: 25;
`;

const CartSection = styled.View`
flex: 1;
flex-direction: row;
margin: 5px;
`;

const PickerCard = styled.View`
flex: 2;  
border-color: ${colors.turquoise};
border-width: 1;
height: 30;
border-radius: 5;
`;

const getProductImages = image => {
  if (image === null) return 'https://dummyimage.com/600x400/ccc/000';

  return image;
}

const getFirstImage = images => {
  if (typeof images === 'undefined' || images.length === 0) return 'https://dummyimage.com/600x400/ccc/000';

  return images[0];
}

const categoryListing = category_root => {
  var str = category_root.category;
  var strToLoop = category_root.sub_category;

  for (let i = 0; strToLoop.length > 0; i++) {
    str = str + " > " + strToLoop[0].category;
    strToLoop = strToLoop[0].sub_category;

  }

  return str;
}

class Product extends Component {
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      title: `${state.params.title}`,
    };
  };


  ChangeThisTitle = (titleText) => {
    const {setParams} = this.props.navigation;
     setParams({ title: titleText })
 }

  constructor() {
    super();

    this.state = {
      isLoading: true,
      dataSource: null,
      isModalVisible: false,
      selectedQuantity: 1,
      selectedColor: 0,
      selectedSize: 0,
      pageTitle: '',
      followProductID: false,
    }

    this._getProductDetails = this._getProductDetails.bind(this);
    this._addItemToCart = this._addItemToCart.bind(this);

  }

  componentDidMount() {
    this.ChangeThisTitle(this.props.navigation.state.params && this.props.navigation.state.params.name);
    return this._getProductDetails(this.props.navigation.state.params.id);
  }

  _getProductDetails(productID) {
    this.setState({isLoading: true});
    
    Axios.get(apis.urls.product.main + "/" + productID, {
      headers: {
        token: this.props.screenProps.user.token ? this.props.screenProps.user.token : '',
      }
    })
      .then((response) => {
        this.setState({
          isLoading: false,
          dataSource: response.data,
        }, () => {
          this.ChangeThisTitle(response.data.name_en)
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

  _addItemToCart(productID, attributeID, q, callback) {
    if(attributeID != 0) {
      Axios.post(apis.urls.cart.main, {
        product_id: productID,
        attribute_id: attributeID,
        quantity: q
      },
        {
          headers: {
            token: this.props.screenProps.user.token && this.props.screenProps.user.token,
          }
        })
        .then((response) => {
          this.setState({
            isLoading: false,
          }, () => {
            let quantity = this.props.screenProps.cart + q
            this.props.onAddToCart(quantity);
  
            callback(true);
          });
        })
        .catch((error) => {
          console.log(error);
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
    } else {
      Alert.alert(
        'No product color and size is selected',
        "Please select one.",
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );

    }
  }

  _addToFavorites(productID) {
    if (!this.state.dataSource.is_following) {
      Axios.post(apis.urls.product.follow, {
        product_id: productID,
      }, {
          headers: {
            token: this.props.screenProps.user.token && this.props.screenProps.user.token,
          }
        })
        .then((response) => {
          this.setState({
            dataSource: response.data,
            followProductID: true,
          }, () => {
            console.log("Successfully added");
          });
        })
        .catch((error) => {
          console.log(error);
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

    } else if (this.state.dataSource.is_following) {
      Axios.delete(apis.urls.product.follow + "/" + productID, {
        headers: {
          token: this.props.screenProps.user.token && this.props.screenProps.user.token,
        }
      })
        .then((response) => {
          this.setState({
            dataSource: response.data,
            followProductID: true,
          }, () => {
            console.log("Successfully unfollow");
          });
        })
        .catch((error) => {
          console.log(error);
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
    } else {
      console.log("error");
    }
  }

  _shareText() {
    console.log('Share Text');

    Share.share({
      message: 'http://sample.product.url',
      url: 'http://sample.product.url',
      title: 'HKShopU'
    }, {
      dialogTitle: 'Share this product with friends!',
      tintColor: 'green'
    })
    .then(this._showResult)
    .catch((error) => this.setState({result: 'error: ' + error.message}));
  }

  _showResult(result) {
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        this.setState({result: 'shared with an activityType: ' + result.activityType});
      } else {
        this.setState({result: 'shared'});
      }
    } else if (result.action === Share.dismissedAction) {
      this.setState({result: 'dismissed'});
    }
  }

  scrollX = new Animated.Value(0) // this will be the scroll location of our ScrollView

  render() {
    const { navigation, screenProps } = this.props;
    const { dataSource } = this.state;

    // position will be a value between 0 and photos.length - 1 assuming you don't scroll pass the ends of the ScrollView
    let position = Animated.divide(this.scrollX, width);

    let availableColors = [];
    let availableColorsObj = [];
    let availableSizes = [];
    let availableSizesObj = [];
    let pickerColors = [];
    let pickerColorsObj = [];
    let pickerSizes = [];
    let pickerSizesObj = [];

    if (dataSource) {
      if (dataSource.attributes.length > 0) {
        for (let colorsObj of dataSource.attributes) {
          if (colorsObj.color !== null) {
            if (availableColors.indexOf(colorsObj.color.name) == -1) {
              availableColors.push(colorsObj.color.name);
              availableColorsObj.push(colorsObj.color.code);
            }
          }

          if (colorsObj.size !== null) {
            if (availableSizes.indexOf(colorsObj.size.name) == -1) {
              availableSizes.push(colorsObj.size.name);
              availableSizesObj.push(colorsObj.size.code);
            }
          }
        }
      }
    }

    let pickerColorDisplay = () => {
      if (dataSource) {
        if (dataSource.attributes.length > 0) {
          for (let colorsObj of dataSource.attributes) {
            if (colorsObj.stock >= this.state.selectedQuantity && colorsObj.color !== null) {
              if (pickerColors.indexOf(colorsObj.color.name) == -1) {
                pickerColors.push(colorsObj.color.name);
                availableSizesObj.length > 0 ? pickerColorsObj.push(colorsObj.color.id) : pickerColorsObj.push(colorsObj.id);
              }
            }
          }
        }
      }

      return pickerColorsObj.map((colorID, index) => (
        <Picker.Item label={pickerColors[index]}
          value={colorID}
          key={index} />
      ))
    }

    let pickerSizeDisplay = () => {
      if (dataSource) {
        if (dataSource.attributes.length > 0) {
          for (let colorsObj of dataSource.attributes) {
            if (this.state.selectedColor > 0) {
              if (colorsObj.color.id == this.state.selectedColor && colorsObj.size !== null) {
                if (pickerSizes.indexOf(colorsObj.size.name) == -1) {
                  pickerSizes.push(colorsObj.size.name);
                  pickerSizesObj.push(colorsObj.id);
                }
              }
            // } else {
              // if (colorsObj.size !== null) {
              //   if (pickerSizes.indexOf(colorsObj.size.name) == -1) {
              //     pickerSizes.push(colorsObj.size.name);
              //     pickerSizesObj.push(colorsObj.id);
              //   }
              // }
            }
          }
        }
      }

      return pickerSizesObj.map((colorID, index) => (
        <Picker.Item label={pickerSizes[index]}
          value={colorID}
          key={index}
          mode={'dropdown'} />
      ))
    }


    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }

    return (
      <ProductContainer>
        <ScrollView>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
            <ImageContainer
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              // the onScroll prop will pass a nativeEvent object to a function
              onScroll={Animated.event( // Animated.event returns a function that takes an array where the first element...
                [{ nativeEvent: { contentOffset: { x: this.scrollX } } }] // ... is an object that maps any nativeEvent prop to a variable
              )} // in this case we are mapping the value of nativeEvent.contentOffset.x to this.scrollX
              scrollEventThrottle={16} // this will ensure that this ScrollView's onScroll prop is called no faster than 16ms between each function call

            >
              {
                dataSource.image.length > 0 ?
                  dataSource.image.map((image, key) => {
                    return (
                      <View key={image.id}>
                        <Image source={{ uri: getProductImages(image.url) }} />
                      </View>
                    );
                  }) :
                  <View>
                    <Image source={{ uri: 'https://dummyimage.com/600x400/ccc/000' }} />
                  </View>
              }
            </ImageContainer>
            <View
              style={{ flexDirection: 'row', }} // this will layout our dots horizontally (row) instead of vertically (column)
            >
              {dataSource.image.map((_, i) => { // the _ just means we won't use that parameter
                let opacity = position.interpolate({
                  inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
                  outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
                  // inputRange: [i - 0.50000000001, i - 0.5, i, i + 0.5, i + 0.50000000001], // only when position is ever so slightly more than +/- 0.5 of a dot's index
                  // outputRange: [0.3, 1, 1, 1, 0.3], // is when the opacity changes from 1 to 0.3
                  extrapolate: 'clamp' // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
                });
                return (
                  <Animated.View // we will animate the opacity of the dots so use Animated.View instead of View here
                    key={i} // we will use i for the key because no two (or more) elements in an array will have the same index
                    style={{ opacity, height: 5, width: 5, backgroundColor: colors.turquoise, margin: 2, borderRadius: 5 }}
                  />
                );
              })}
            </View>
          </View>
          <ProductHeader>
            <View style={{ flex: 1, marginLeft: 10, }}>
              <ProductTitle>{dataSource.name_en}</ProductTitle>
              <ProductCategory>{categoryListing(dataSource.category_root[0])}</ProductCategory>
            </View>
            <View style={{ flex: 1, marginRight: 10, }}>
              <ProductPrice>HK${dataSource.price_discounted === null ? dataSource.price_original : dataSource.price_discounted}</ProductPrice>
              <ProductPriceDiscounted>{dataSource.price_discounted !== null && 'HK$' + dataSource.price_original}</ProductPriceDiscounted>
            </View>
          </ProductHeader>
          <Section>
            <ProductStats>
              <ProductStatItem>
                <FontAwesome name="eye" size={20} style={{ marginRight: 5 }} />
                <Text>{dataSource.views}</Text>
              </ProductStatItem>
              <ProductStatItem>
                <FontAwesome name="heart" size={20} color={colors.red} style={{ marginRight: 5 }} />
                <Text>{dataSource.followers}</Text>
              </ProductStatItem>
              <ProductStatItem>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={dataSource.rating.average}
                  emptyStarColor={colors.gold}
                  fullStarColor={colors.gold}
                  starSize={20}
                />
              </ProductStatItem>

            </ProductStats>
          </Section>
          <View style={{
            marginLeft: 15,
            marginRight: 15,
            marginTop: 10,
            marginBottom: 10,
            borderBottomColor: colors.yellow,
            borderBottomWidth: 2
          }} />
          <Section>
            <ProductStatItem>
              <SectionHeader style={{ flex: 1 }}>Description:</SectionHeader>
              <Text style={{ flex: 2, }}>{dataSource.description_en}</Text>
            </ProductStatItem>
          </Section>
          {
            availableColorsObj.length > 0 &&
            <Section>
              <ProductStatItem>
                <SectionHeader style={{ flex: 1 }}>Available colors:</SectionHeader>
                <View style={{ flex: 2, flexDirection: 'row' }}>
                  {
                    availableColorsObj && availableColorsObj.map((colorObj, index) => (
                      <Circle key={index} style={{
                        backgroundColor: colorObj
                        , borderWidth: 1
                        , borderColor: colors.gray
                        , marginRight: 5
                      }}></Circle>
                    ))
                  }
                </View>
              </ProductStatItem>
            </Section>
          }
          {
            availableSizesObj.length > 0 &&
            <Section>
              <ProductStatItem>
                <SectionHeader style={{ flex: 1 }}>Available sizes:</SectionHeader>
                <View style={{ flex: 2, flexDirection: 'row', }}>
                  {
                    availableSizesObj && availableSizesObj.map((colorObj, index) => (
                      <View key={index} style={{ marginRight: 5 }}>
                        <Text>{colorObj.toUpperCase()}</Text>
                      </View>
                    ))
                  }
                </View>
              </ProductStatItem>
            </Section>
          }
          <View style={{
            marginLeft: 15,
            marginRight: 15,
            marginTop: 10,
            marginBottom: 10,
            borderBottomColor: colors.yellow,
            borderBottomWidth: 2
          }} />
          <Section>
            <ProductOwnerHeader>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" }}>
                <ProductOwnerImage source={dataSource.shop.logo_url !== null ? { uri: dataSource.shop.owner.image_url } : require("../img/no_user.jpg")} />
                <ProductOwnerTitle >{dataSource.shop.name_en}</ProductOwnerTitle>
              </View>
              <StyledButton onPress={() => navigation.navigate('Shop', { ...dataSource.shop })}>
                <Text style={styles.buttonText}>View Shop</Text>
              </StyledButton>
            </ProductOwnerHeader>
            {
              dataSource.shop.featured_products &&
              <ShopFeaturedProducts>
                {
                  dataSource.shop.featured_products.map((product, index) => (
                    <ShopFeaturedProduct key={index} onPress={() => (this._getProductDetails(product.id))}>
                      <Image style={{ width: '100%', height: 70 }} source={{ uri: product.image_url != null ? product.image_url : 'https://dummyimage.com/600x400/ccc/000' }} />
                    </ShopFeaturedProduct>
                  ))
                }
              </ShopFeaturedProducts>
            }
            <View style={{
              marginTop: 10,
              marginBottom: 10,
              borderBottomColor: colors.yellow,
              borderBottomWidth: 2
            }} />
            <SectionHeader>Shop Description</SectionHeader>
            <Text>{dataSource.shop.description_en}</Text>
          </Section>
        </ScrollView>
        <ModalCartCustom
          isVisible={this.state.isModalVisible}
          onBackButtonPress={() => {
            this.setState({
              isModalVisible: false,
            })
          }}
          onBackdropPress={() => {
            this.setState({
              isModalVisible: false,
            })
          }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={{
              width: 300,
              height: 300,
              backgroundColor: colors.white,
              padding: 10,
            }}>
              <CartSection >
                <Text style={styles.titleText}>Order Details </Text>
              </CartSection>
              <CartSection>
                <SectionHeader style={{ flex: 1 }}>Quantity</SectionHeader>
                <View style={{ flex: 2, flexDirection: 'row', marginRight: 5, justifyContent: 'space-around' }}>
                  <TouchableOpacity onPress={
                    () => {
                      this.setState({
                        selectedQuantity: this.state.selectedQuantity > 1 ? (this.state.selectedQuantity - 1) : 1,
                      })
                    }
                  }>
                    <FontAwesome name='minus-circle' size={25} color={colors.gold} />
                  </TouchableOpacity>
                  <Text style={
                    {
                      width: 100
                      , height: 30
                      , borderRadius: 5
                      , borderWidth: 1
                      , borderColor: colors.gray
                      , textAlign: "center"
                      , fontSize: 16
                      , padding: 3
                    }
                  }>{this.state.selectedQuantity}</Text>
                  <TouchableOpacity onPress={
                    () => {
                      this.setState({
                        selectedQuantity: this.state.selectedQuantity + 1,
                      })
                    }
                  }>
                    <FontAwesome name='plus-circle' size={25} color={colors.gold} />
                  </TouchableOpacity>
                </View>
              </CartSection>
              {
                availableColorsObj.length > 0 &&
                <CartSection>
                  <SectionHeader style={{ flex: 1 }}>Product Color</SectionHeader>
                  <PickerCard>
                    <Picker
                      selectedValue={this.state.selectedColor}
                      style={{ height: 30 }}
                      onValueChange={(itemValue, itemIndex) => (
                        this.setState({ selectedColor: itemValue })
                      )
                      }>
                      <Picker.Item label="Select color" value='0' />
                      {pickerColorDisplay()}
                    </Picker>
                  </PickerCard>
                </CartSection>
              }
              {
                (this.state.selectedColor > 0 && availableSizesObj.length > 0) &&
                <CartSection>
                  <SectionHeader style={{ flex: 1 }}>Product Size</SectionHeader>
                  <PickerCard>
                    <Picker
                      selectedValue={this.state.selectedSize}
                      style={{ height: 30 }}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ selectedSize: itemValue })
                      }>
                      <Picker.Item label="Select size" value='0' />
                      {pickerSizeDisplay()}
                    </Picker>
                  </PickerCard>
                </CartSection>
              }
              <View style={{
                marginTop: 10,
                marginBottom: 10,
                borderBottomColor: colors.yellow,
                borderBottomWidth: 2
              }} />

              <CartSection style={{ justifyContent: 'space-around' }}>
                <TouchableOpacity onPress={
                  () => {
                    this.setState({ isModalVisible: false })
                  }
                }>
                  <View style={{ flex: 1, flexDirection: 'row', }}>
                    <FontAwesome name='close' size={25} color={colors.red} />
                    <Text style={styles.buttonText}>Cancel</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={
                  () => {
                    this._addItemToCart(this.props.navigation.state.params.id
                      , this.state.selectedSize != 0 && this.state.selectedSize //: this.state.selectedColor
                      , this.state.selectedQuantity
                      , function (ret) {
                        if (ret) {
                          this.setState({ isModalVisible: false })
                        }
                      }.bind(this))
                  }
                }>
                  <View style={{ flex: 1, flexDirection: 'row', }}>
                    <FontAwesome name='check' size={25} color={colors.turquoise} />
                    <Text style={styles.buttonText}>Confirm</Text>
                  </View>
                </TouchableOpacity>
              </CartSection>
            </View>
          </View>
        </ModalCartCustom>
        <BottomToolbar actions={[
          {
            icon: 'share',
            label: 'Share',
            onClickHandler: () => {
              screenProps.user.token ? this._shareText() : navigation.navigate('UserWelcome')
            }
          },
          {
            icon: dataSource.is_following ? 'heart' : 'heart-o',
            label: dataSource.is_following ? 'Liked' : 'Like',
            color: colors.red,
            onClickHandler: () => {
              screenProps.user.token ? this._addToFavorites(navigation.state.params.id) : navigation.navigate('UserWelcome')
            }
          },
          {
            icon: 'cart-plus',
            label: 'Add to cart',
            size: 2,
            onClickHandler: () => {
              screenProps.user.token ? (this.setState({ isModalVisible: true, })) : navigation.navigate('UserWelcome')
            }
          }
        ]} />
      </ProductContainer >
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
  },
  titleText: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: colors.turquoise,
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

export default connect(mapStateToProps, mapDispatchToProps)(Product);