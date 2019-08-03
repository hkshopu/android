import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Header from '../components/splash/Header';

export default class Splash extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Header navigation={navigation}/>
        <View style={styles.links}>
          <Text style={styles.link}>Product</Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Shop')}>Shop</Text>
          <Text style={styles.link}>News</Text>
          <Text style={styles.link}>Me</Text>
          <View style={styles.lineBreaker}></View>
          <Text style={styles.link} onPress={() => navigation.navigate('Settings')}>Setting</Text>
          <Text style={styles.link}>About Us</Text>
          <Text style={styles.link}>Contact Us</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  links: {
    flex: 2,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  link: {
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  lineBreaker: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1
  }
});
