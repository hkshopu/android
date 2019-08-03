import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export default class Header extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>HK ShopU</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.headerButtonClickable}>
            <Text style={{textAlign: 'center', fontSize: 20}}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Join')} style={styles.headerButtonClickable}>
            <Text style={{textAlign: 'center', fontSize: 20}}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  headerTitle: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 50,
  },
  headerButtons: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginVertical: 10
  },
  headerButtonClickable: {
    padding: 10,
    borderColor: '#cccccc',
    borderWidth: 1,
    backgroundColor: '#cccccc',
    marginHorizontal: 5,
    flex: 1
  }
});
