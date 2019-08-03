import React, { Component } from 'react';
import styled from 'styled-components/native';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { apis } from '../../constants/apis';
import Axios from 'axios';
import { colors } from '../../theme';

const StyledCommentBox = styled.TextInput`
  border: 2px solid ${colors.gray};
  border-radius: 10;
  margin: 10px;
  padding: 10px;
`;

const StyledButton = styled.TouchableOpacity`
  margin-vertical: 5;
  padding: 10px;
  align-items: center;
  background-color: ${colors.turquoise};
  border-radius: 10;
`;

export default class Filter extends Component {
	constructor() {
		super();

		this._retrieveCategory = this._retrieveCategory.bind(this);

		this.state = {
			dataSource: ''
		}
	}

	componentDidMount() {

	}

	_retrieveCategory(userID, shopID, type, comment, callback) {
		const { screenProps } = this.props;

		if (type == apis.types.shop) {
			Axios.post(apis.urls[0].shop.comment, {
				shop_id: shopID,
				user_id: userID,
				content: comment,
			}, {
					headers: {
						token: screenProps.user.token ? screenProps.user.token : '',
					}
				})
				.then((response) => {
					this.setState({
						isLoading: false,
					}, () => {
						callback(true);
					});
				})
				.catch((error) => {
					console.log(error.response.status);
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

		if (type == apis.types.blog) {
			Axios.post(apis.urls[0].blog.comment, {
				blog_id: shopID,
				user_id: userID,
				content: comment,
			}, {
					headers: {
						token: screenProps.user.token ? screenProps.user.token : '',
					}
				})
				.then((response) => {
					this.setState({
						isLoading: false,
					}, () => {
						callback(true);
					});
				})
				.catch((error) => {
					console.log(error.response.status);
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
	}

	render() {
		const { navigation } = this.props;

		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				margin: 20,
			}}>
				<Text style={styles.baseText}>Nickname: Sample User</Text>
				<Text style={styles.baseText}>Comment:</Text>
				<StyledCommentBox
					multiline={true}
					numberOfLines={10}
					placeholder="Type here your comment..."
					onChangeText={(text) => this.setState({ text })}
					value={this.state.text}
					style={styles.baseText}
					underlineColorAndroid='transparent'
				/>
				<StyledButton onPress={
					() => this._addComment('123'
						, navigation.state.params.id
						, navigation.state.params.type
						, this.state.text
						, function (ret) {
							if (ret) {
								navigation.state.params.onResume(true);
								navigation.goBack();
							}
						}.bind(this)
					)
				}>
					<Text style={styles.buttonText}>Submit</Text>
				</StyledButton>
			</View>
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
		fontSize: 16,
		color: colors.white,
	}
});