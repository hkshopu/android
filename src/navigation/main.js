import React, { Component } from 'react';
import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createDrawerNavigator
} from 'react-navigation';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import styled from "styled-components/native/dist/styled-components.native.esm";

import Drawer from '../components/Drawer';
import ProductList from '../screens/Main/ProductList';
import ShopList from '../screens/Main/ShopList';
import News from '../screens/Main/News';
import User from '../screens/Main/User';
import Shop from '../navigation/shop'
import { apis } from '../constants/apis';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addToCart } from '../reducers/auth';


const MenuContainer = styled.View`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

const ShopTabs = createMaterialTopTabNavigator({
  ProductList,
  ShopList,
  News,
  User,
});

const ShopMain = createStackNavigator({
  ShopTabs: {
    screen: ShopTabs,
    navigationOptions: ({ navigation }) => ({
      title: 'HKShopU',
    }),
  },
  Shop: {
    screen: Shop,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params && navigation.state.params.name_en ? navigation.state.params.name_en : 'No Title',
    })
  },
}, {
    navigationOptions: ({ navigation, screenProps }) => ({
      headerRight: (
        <View style={{ flex: 1 }}>
          <MenuContainer>
            <TouchableOpacity style={{ paddingRight: 15 }}
              onPress={() => navigation.navigate('SearchResult'
                , {
                  searchType: navigation.state.index === 1 ? apis.types.shop : apis.types.product
                  , id: navigation.state.params ? navigation.state.params.id : null
                  , name: navigation.state.params ? navigation.state.params.name : null
                  // , routeName: navigation.state
                })}>
              <Ionicons name="md-search" size={25} color={colors.black} />
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingRight: 10 }} onPress={
              () => (
                screenProps.user.token ? navigation.navigate('ShoppingCart') : navigation.navigate('UserWelcome')
              )}>
              <Ionicons name="md-cart" size={25} color={colors.black} />
              {
                screenProps.cart > 0 &&
                <View style={{ position: 'absolute', right: 3, top: 0, backgroundColor: 'red', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 10, fontFamily: "Roboto" }}>{screenProps.cart}</Text>
                </View>
              }
            </TouchableOpacity>
          </MenuContainer>
        </View>
      ),
    })
  });

  export default createDrawerNavigator({
  ShopMain: {
    screen: ShopMain,
    navigationOptions: () => ({
      drawerLabel: () => null,
    })
  }
}, {
    contentComponent: Drawer,
  }
);

