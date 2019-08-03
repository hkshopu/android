import React, { Component } from 'react';
import { Text, View, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../theme';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const height = width * 0.8;

import Axios from 'axios';
import { apis } from '../constants/apis';
import BottomToolbar from '../components/BottomToolbar';

export default class ProductCategory extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Product Category'
  })

  constructor() {
        super();

        this.state = {
            isLoading: true,
            dataSource: null,
          }
        
        this._getAllProductCategory = this._getAllProductCategory.bind();
    }

  componentDidMount() {
    return this._getAllProductCategory();
  }

  async _getAllProductCategory() {
    Axios.get(apis.urls.category.product)
        .then((response) => {
          this.setState({
            isLoading: false,
            dataSource: response.data,
          }, () => {
            console.log("Retrieved prod categ");
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
    const { dataSource } = this.state;
    
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }

    return (
        <View>
            <View>
                <View>

                </View>
            </View>
            <View>
            
            </View>
        </View>
    );
  }
}
