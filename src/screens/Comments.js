import React, { Component } from 'react';
import styled from 'styled-components/native';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { apis } from '../constants/apis';
import Axios from 'axios';
import { colors } from '../theme';

const StyledButton = styled.TouchableOpacity`
  padding: 10px 20px;
  width: 50%;
  align-items: center;
  background-color: ${colors.turquoise};
  border-radius: 10px;
  margin: 30px auto;
`;

const DismissKeyboard = ({ children }) => (
	<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
		{children}
	</TouchableWithoutFeedback>
)
export default class Comments extends Component {
	static navigationOptions = {
        title: 'Comment'
    }
	constructor() {
		super();
		this._addComment = this._addComment.bind(this);
		this.state = { text: '' }
	}

	_addComment(userID, shopID, type, comment, callback) {
		const { screenProps } = this.props;

		if(comment.trim() != "") {
			if (type == apis.types.shop) {
				Axios.post(apis.urls.shop.comment, {
					shop_id: shopID,
					user_id: userID,
					content: comment,
				}, {
						headers: {
							token: screenProps.user.token,
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
				Axios.post(apis.urls.blog.comment, {
					blog_id: shopID,
					user_id: userID,
					content: comment,
				}, {
						headers: {
							token: screenProps.user.token,
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
		} else {
			callback(true);
		}

	}

	render() {
		const { navigation, screenProps } = this.props;

		return (
			<DismissKeyboard>
			<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
				<Text style={[styles.baseText, {marginTop: 20}]}>Nickname: {screenProps.user.user.nickname}</Text>
				<Text style={[styles.baseText, {marginTop: 20}]}>Comment: </Text>
				<View style={styles.commentBox}>
					<TextInput
						editable={true}
						maxLength={280}
						multiline={true}
						numberOfLines={7}
						placeholder="Type here your comment..."
						onChangeText={(text) => this.setState({ text })}
						value={this.state.text}
						style={[styles.baseText, {height: 120}]}
						underlineColorAndroid='transparent'
						keyboardType={'default'}
						returnKeyType={"done"}
						blurOnSubmit={true}
						onSubmitEditing={() => console.log("DONE")}
					/>
				</View>
				<StyledButton onPress={
					() => this._addComment(screenProps.user.id
						, navigation.state.params.id
						, navigation.state.params.type
						, this.state.text
						, function (ret) {
							if (ret) {
								// console.log(this.state.text);
								navigation.state.params.onResume(true);
								navigation.goBack();
							}
						}.bind(this)
					)
				}>
					<Text style={styles.buttonText}>Submit</Text>
				</StyledButton>

			</KeyboardAvoidingView>
			</DismissKeyboard>
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
	},
	container: {
		backgroundColor: colors.white,
		padding: 20,
		flex: 1,
	},
	commentBox: {
		borderWidth: 2,
		borderColor: colors.gray,
		borderRadius: 10,
		margin: 10,
		padding: 10,
	}
});