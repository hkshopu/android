import React, { Component, PureComponent } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { colors } from '../../theme';
import { apis } from '../../constants/apis';
import BottomToolbarThin from '../../components/BottomToolbarThin';
import StarRating from 'react-native-star-rating';
import { strings } from '../../constants/strings';
import ModalSortCustom from 'react-native-modal';
import Axios from 'axios';
import { AdMobBanner } from 'expo';

const Container = styled.View`
  background-color: ${colors.lightGray};
  flex: 1;
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

class MyListItem extends React.PureComponent {
  render() { 
    const { navigation, item } = this.props;

    return (
      <ShopContainer>
        <ShopHeader onPress={() => navigation.navigate('Shop', { ...item })}>
          {item.logo_url != null ?
            <ShopImage source={{ uri: item.logo_url}} /> :
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
    );
   }
}

export default class ShopList extends Component {
  static navigationOptions = {
    title: 'Shop'
  }

  constructor() {
    super();

    this.state = {
      path: "Shop",
      isLoading: true,
      sorter: null,
      isSortModalVisible: false,
    }

    this._renderItem = this._renderItem.bind(this);
    this._setSortModalVisible = this._setSortModalVisible.bind(this);
    this._getAllShop = this._getAllShop.bind(this);
  }

  componentDidMount() {
    return this._getAllShop();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.screenProps != prevProps.screenProps) || (this.props.screenProps.user != prevProps.screenProps.user)) {
      this._getAllShop();
    }
  }

  async _getAllShop() {
    const { screenProps } = this.props;
    this.setState({ isLoading: true });

    Axios.get(apis.urls.shop.main, {
      headers: {
        token: screenProps.user.token ? screenProps.user.token : '',
      }
    })
      .then((response) => {
        this.setState({
          isLoading: false,
          dataSource: response.data,
        }, () => {
          console.log("Retrieved Shop");
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

  _setSortModalVisible(visible) {
    this.setState({ isSortModalVisible: visible });
  }

  _renderItem = ({ item }) => (
    <MyListItem 
      item={item}
      navigation={this.props.navigation} />
  );
    // {
    // const { navigation } = this.props;

    // return (
    //   <ShopContainer>
    //     <ShopHeader onPress={() => navigation.navigate('Shop', { ...item })}>
    //       {item.logo_url != null ?
    //         <ShopImage source={{ uri: item.logo_url }} /> :
    //         <ShopImage source={require("../../img/no_image.jpg")} />}
    //       <ShopTitle>{item.name_en}</ShopTitle>
    //       <ShopCategory>{item.category.name}</ShopCategory>
    //     </ShopHeader>
    //     {
    //       item.featured_products.length > 0 &&
    //       <ShopFeaturedProducts>
    //         {
    //           item.featured_products.map((product, index) => (
    //             <ShopFeaturedProduct key={index} onPress={() => navigation.navigate('Product', { id: product.id, name: product.product_name_en })}>
    //               {product.image_url != null ?
    //                 <Image style={{ width: '100%', height: 70 }} source={{ uri: product.image_url }} /> :
    //                 <Image style={{ width: '100%', height: 70 }} source={require("../../img/no_image.jpg")} />
    //               }
    //             </ShopFeaturedProduct>
    //           ))
    //         }
    //       </ShopFeaturedProducts>
    //     }
    //     <View>
    //       <Text style={{ fontWeight: 'bold' }}>Shop Description</Text>
    //       <Text numberOfLines={4} ellipsizeMode="tail">{item.description_en}</Text>
    //     </View>

    //     <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
    //       <ShopQuickAction>
    //         <StarRating
    //           disabled={true}
    //           maxStars={5}
    //           rating={item.rating.average}
    //           emptyStarColor={colors.gold}
    //           fullStarColor={colors.gold}
    //           starSize={20}
    //         />
    //       </ShopQuickAction>
    //       <ShopQuickAction>
    //         <View style={{ flexDirection: "row" }}>
    //           <Ionicons name="md-heart" size={20} color={colors.red} />
    //           <Text style={{ marginLeft: 5 }}>{item.followers}</Text>
    //         </View>
    //       </ShopQuickAction>
    //       <ShopQuickAction>
    //         <View style={{ flexDirection: "row" }}>
    //           <Ionicons name="ios-chatbubbles" size={20} color={colors.gold} />
    //           <Text style={{ marginLeft: 5 }}>{item.comments}</Text>
    //         </View>
    //       </ShopQuickAction>
    //     </View>
    //   </ShopContainer>
    // )
  // }

  render() {
    //   this.props.isFocused && this._getAllShop();

    return (
      <Container>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this._getAllShop}
              enabled={true}
            />
          }
          data={
            !this.state.isLoading && this.state.dataSource.sort((a, b) => {
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
                  isSortModalVisible: false,
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
                  isSortModalVisible: false,
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
        <BottomToolbarThin actions={[
          {
            icon: 'filter',
            onClickHandler: () => { }
          },
          {
            icon: 'sort',
            onClickHandler: () => {
              this._setSortModalVisible(!this.state.isSortModalVisible)
            }
          }
        ]} />
        <AdMobBanner
          bannerSize="banner"
          adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
          testDeviceID="EMULATOR" //What is this??
          didFailToReceiveAdWithError={this.bannerError} />
      </Container>
    );
  }
}
