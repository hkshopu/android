import React, { Component } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import { Header, Icon } from 'react-native-elements';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors } from '../../theme';

export default class EditPage extends Component {
    constructor() {
        super();
    
        this.state = {
          valueText: '',
        }
      }

      componentDidMount() {
        let params = this.props.navigation.state.params;
        this.setState({valueText: params.value})
      }

  render() {
      const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <View>
          <Header
            outerContainerStyles={styles.topMenu}
            backgroundColor={colors.turquoise}
            leftComponent={
                <FontAwesome
                name="times"
                size={20}
                color={colors.white}
                onPress={() => console.log('pressed')}
              />  
            }
            centerComponent={{ text: navigation.state.params.title, style: { color: '#fff', fontSize: 20} }}
            rightComponent={
              <FontAwesome
                name="check"
                size={20}
                color={colors.white}
                onPress={() => console.log('pressed')}
              />
            }
          />
        </View>
        {
            // navigation.state.params.type === 1 &&
            <View>
               <TextInput
              style={[styles.baseText, styles.inputFieldFormat]}
              onChangeText={(text) => this.setState({ valueText: text })}
              value={this.state.valueText}
            />
            </View>
        }
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  topMenu: {
    height: 53,
    backgroundColor: colors.turquoise,
  },
});
