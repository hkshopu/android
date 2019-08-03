import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation';
import styled from 'styled-components/native';

import { colors } from '../theme';

const DrawerItem = styled.View`
  margin: 0 5px;
`;

class Drawer extends PureComponent {
  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 150, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' }}>
          <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: 'https://dummyimage.com/600x400/fff/000' }}/>
          <Text style={{ color: colors.white }}>Guest</Text>
        </View>
        <ScrollView>
          <DrawerItems {...this.props}/>
          <DrawerItem>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('Login')}>
              <Text>Login</Text>
            </TouchableOpacity>
          </DrawerItem>
          <DrawerItem>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('Join')}>
              <Text>Signup</Text>
            </TouchableOpacity>
          </DrawerItem>
          <DrawerItem>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('Settings')}>
              <Text>Settings</Text>
            </TouchableOpacity>
          </DrawerItem>
        </ScrollView>
      </View>
    );
  }
}

Drawer.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default Drawer;
