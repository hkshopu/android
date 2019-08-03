import React, { Component } from 'react';
import PostListItem from '../../components/PostListItem';
import styled from 'styled-components/native';
import BottomToolbarThin from '../../components/BottomToolbarThin';
import { colors } from '../../theme';
import { View, ActivityIndicator, Alert, Text, TouchableOpacity, RefreshControl, ScrollView } from "react-native";

import Axios from 'axios';
import { apis } from '../../constants/apis';
import { strings } from '../../constants/strings';
import ModalSortCustom from 'react-native-modal';

const BlogContainer = styled.ScrollView`
  
`
export default class BlogList extends Component {
  static navigationOptions = {
    title: 'Blog'
  }

  constructor() {
    super();

    this.state = {
      isLoading: true,
      refreshing: false,
      dataSource: null,
      sorter: strings.sorter.date,
      isSortModalVisible: false,
    }

    this._setSortModalVisible = this._setSortModalVisible.bind(this);
    this._getBlogs = this._getBlogs.bind(this);

  }

  componentDidMount() {
    return this._getBlogs();
  }

  _setSortModalVisible(visible) {
    this.setState({ isSortModalVisible: visible });
  }

  async _getBlogs() {
    this.setState({ isLoading: true });

    Axios.get(apis.urls.blog.main, {
      params: {
        shop_id: this.props.navigation.state.params.id,
      }, headers: {
        token: this.props.screenProps.user.token ? this.props.screenProps.user.token : '',
      }
    })
      .then((response) => {
        this.setState({
          isLoading: false,
          dataSource: response.data,
        }, () => {
          console.log("Successfully retrieved blogs.");
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
    const { navigation } = this.props;
    const { dataSource } = this.state;

    // if (this.state.isLoading) {
    //   return (
    //     <View style={{ flex: 1, padding: 20 }}>
    //       <ActivityIndicator />
    //     </View>
    //   )
    // }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={this._getBlogs}
            enabled={true}
            />
          }
          style={{backgroundColor: colors.white}}
        >
          {(dataSource && dataSource.length > 0) ?
            dataSource.sort((a, b) => {
              if (this.state.sorter == strings.sorter.date) {
                return a.created_at < b.created_at;
              } else {
                return a.title_en > b.title_en;
              }
            }).map((blog, index) => (
              <PostListItem
                key={index}
                onClickHandler={() => navigation.navigate('Post', {
                  ...blog
                  , type: apis.types.blog
                })}
                {...blog}
              />
            ))
            : <Text> No available blogs for this shop. </Text>
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
                  sorter: strings.sorter.date,
                  isSortModalVisible: false,
                })
              } style={[this.state.sorter == strings.sorter.date ? { backgroundColor: colors.selected_option } : { backgroundColor: colors.white }]}>
                <View style={{
                  padding: 10,
                }}>
                  <Text>Most recent blogs</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={
                () => this.setState({
                  sorter: strings.sorter.name,
                  isSortModalVisible: false,
                })
              } style={[this.state.sorter == strings.sorter.name ? { backgroundColor: colors.selected_option } : { backgroundColor: colors.white }]}
              >
                <View style={{
                  padding: 10,
                }}>
                  <Text>Shop Title (A-Z)</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ModalSortCustom>
        <BottomToolbarThin actions={[
          {
            icon: 'filter',
            onClickHandler: () => {
              console.log('clicked Filter');

            }
          },
          {
            icon: 'sort',
            onClickHandler: () => {
              console.log('clicked Sort');
              this._setSortModalVisible(!this.state.isSortModalVisible)
            }
          }
        ]} />
      </View>
    )
  }
}
