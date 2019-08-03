import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, Alert, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { colors } from '../../theme';
import BottomToolbar from '../../components/BottomToolbar';
import Spinner from '../../components/Spinner';
import { apis } from '../../constants/apis';
import StarRating from 'react-native-star-rating';
import ModalCustom from 'react-native-modal';

import Axios from 'axios';

const { width } = Dimensions.get('window');
const height = width * 0.8;

const ImageContainer = styled.Image`
	  height: ${height};
	  width: ${width};
	`;

const ShopHeader = styled.View`
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  padding: 10px;
	  border-bottom-width: 1;
	  border-bottom-color: ${colors.gray};
	  border-style: solid;
	`;

const ShopLogo = styled.Image`
	  flex: 1;
	  height: 75px;
	  margin-right: 10px;
	`;

const ShopRating = styled.View`
	  flex: 1;
	  display: flex;
	  flex-direction: row;
	  justify-content: flex-end;
	`;

const ShopDetails = styled.View`
	  padding: 5px;
	`;

const ShopFeedback = styled.View`
	  padding: 5px;
	`;

const FeedbackContainer = styled.View`
	  display: flex;
	  flex-direction: row;
	  justify-content: space-around;
	  margin-bottom: 20px;
	  align-items: flex-start;
	`;

const FeedbackUserImage = styled.Image`
	  border-radius: 25;
	  height: 100px;
	  width: 50px;
	  height: 50px;
	  margin-right: 10px;
	`;

const FeedbackDetails = styled.View`
	  flex: 2;
	`;

const PaymentMethod = styled.View`
		display: flex;
	  padding: 10px;
	  flex-direction: row;
	`;

const PaymentMethodDetails = styled.View`
	  marginRight: 15px;
	  flex-direction: row;
	`;

const getUserProfileImage = image => {
	if (typeof image === 'undefined' || image === null) return 'https://dummyimage.com/600x400/ccc/000';

	return image;
}

const getShopLogo = image => {
	if (image === null) return 'https://dummyimage.com/600x400/ccc/000';

	return image;
}

const getPaymenticon = code => {
	if (code == 'paypal') return 'paypal';
	if (code == 'bank') return 'money';
	return 'vcard';
}

const getPaymentLabel = code => {
	if (code == 'paypal') return 'Paypal';
	if (code == 'bank') return 'Bank In';
	return 'SPF';
}

class Info extends Component {
	constructor() {
		super();

		this.state = {
			isLoading: true,
			isRefreshing: false,
			dataSource: null,
			isLoadingComments: false,
			dataSourceComments: null,
			followIcon: null,
			followLabel: null,
			isModalVisible: false,
			starCount: 0,
			isSpinning: false,
			followShop: false,
		}

		this._getShop = this._getShop.bind(this);
		this._getComments = this._getComments.bind(this);
		this._follow = this._follow.bind(this);
		this._unfollow = this._unfollow.bind(this);
		this._setModalVisible = this._setModalVisible.bind(this);
		this._setFollowState = this._setFollowState.bind(this);
		this._rateShop = this._rateShop.bind(this);
		// this._renderComments = this._renderComments.bind(this);

	}

	_setModalVisible(visible) {
		this.setState({ isModalVisible: visible });
	}

	componentDidMount() {
		this._setFollowState(this.props.navigation.state.params.is_following);
		return this._getComments(this.props.navigation.state.params.id);
	}

	async _getShop(shopID) {
		Axios.get(apis.urls.shop.main + "/" + shopID, {
			headers: {
				token: this.props.screenProps.user.token ? this.props.screenProps.user.token : '',
			}
		})
			.then((response) => {
				this.setState({
					isLoading: false,
					isRefreshing: false,
					dataSource: response.data,
				}, () => {

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

	async _getComments(shopID) {
		const { params } = this.props.navigation.state;

		Axios.get(apis.urls.shop.comment + "/" + shopID, {
			headers: {
				token: this.props.screenProps.user.token ? this.props.screenProps.user.token : '',
			}
		})
			.then((response) => {
				this.setState({
					isLoading: false,
					dataSource: params,
					isLoadingComments: false,
					dataSourceComments: response.data,
					starCount: params.rating.user_rating != null ? params.rating.user_rating : 0,
				}, () => {
					console.log("retrieved all comments successfully");
				});
			})
			.catch((error) => {
				Alert.alert(
					'Something Went Wrong',
					JSON.stringify(error.response),
					[
						{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
						{ text: 'OK', onPress: () => console.log('OK Pressed') },
					],
					{ cancelable: false }
				);
			});
	}

	_follow(shopID, callback) {
		this.setState({ isSpinning: true });

		Axios.post(apis.urls.shop.following, {
			shop_id: shopID,
		}, {
				headers: {
					token: this.props.screenProps.user.token,
				}
			})
			.then((response) => {
				this.setState({
					isLoading: false,
					dataSource: response.data,
					isSpinning: false,
					followShop: true,
				}, () => {
					callback(true);
				});
			})
			.catch((error) => {
				this.setState({ isSpinning: false });
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

	_unfollow(shopID, callback) {
		this.setState({ isSpinning: true });

		Axios.delete(apis.urls.shop.following + "/" + shopID, {
			// shop_id: shopID,
			// }, {
			headers: {
				token: this.props.screenProps.user.token,
			}
		})
			.then((response) => {
				this.setState({
					isLoading: false,
					dataSource: response.data,
					isSpinning: false,
					followShop: true,
				}, () => {
					callback(false);
				});
			})
			.catch((error) => {
				this.setState({ isSpinning: false });
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

	_rateShop(userID, shopID, rate, callback) {
		if(rate > 0) {
			Axios.post(apis.urls.shop.rating, {
				shop_id: shopID,
				rating: rate,
				user_id: userID,
			}, {
					headers: {
						token: this.props.screenProps.user.token,
					}
				})
				.then((response) => {
					this.setState({
						isLoading: false,
						dataSource: response.data,
					}, () => {
						callback(true);
					});
				})
				.catch((error) => {
					console.log(JSON.stringify(error));
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
	
		} else {
			callback(true);
		}
	}

	_setFollowState(isFollowing) {
		if (isFollowing) {
			this.setState({
				followIcon: 'heart',
				followLabel: 'Following',
			});
		} else {
			this.setState({
				followIcon: 'heart-o',
				followLabel: 'Follow',
			});
		}
	}

	_refresh() {
		this._getShop(this.props.navigation.state.params.id);
		this._setFollowState(this.props.navigation.state.params.is_following);
		this._getComments(this.props.navigation.state.params.id);
	}

	render() {
		const { navigation, screenProps } = this.props;
		const { dataSource, dataSourceComments } = this.state;

		if (this.state.isLoading) {
			return (
				<View style={{ flex: 1, padding: 20 }}>
					<ActivityIndicator />
				</View>
			)
		}

		return (
			<View style={{ flex: 1 }}>
				<Spinner isVisible={this.state.isSpinning} />
				<ScrollView
					// refreshControl={
					// 	<RefreshControl
					// 		refreshing={this.state.isRefreshing}
					// 		onRefresh={this._getShop(this.props.navigation.state.params.id)}
					// 		enabled={true}
					// 	/>
					// }
				>
					<ShopHeader>
						<ShopLogo source={{ uri: getShopLogo(dataSource.logo_url) }} />
						<View style={{ flex: 1 }}>
							<Text style={styles.header}>
								{dataSource.name_en}
							</Text>
							<Text style={{ fontSize: 10, color: colors.gray }}> {dataSource.category.name} </Text>
						</View>
						<View style={{ flex: 1 }}>
							<ShopRating>
								<StarRating
									disabled={true}
									maxStars={5}
									rating={dataSource.rating.average}
									emptyStarColor={colors.gold}
									fullStarColor={colors.gold}
									starSize={20}
								/>
							</ShopRating>
							<ShopRating>
								<FontAwesome name="heart" size={20} color={colors.red} style={{ paddingRight: 5 }} />
								<Text style={{ paddingRight: 5 }}>{dataSource.followers}</Text>
							</ShopRating>
						</View>
					</ShopHeader>
					<ScrollView
						horizontal
						pagingEnabled={true}
						showsHorizontalScrollIndicator={false}
					>
						{dataSource.image.map((shop, key) => {
							return (
								<View key={shop.id}>
									<ImageContainer source={{ uri: shop.url }} />
								</View>
							);
						})}
					</ScrollView>
					<ShopDetails>
						<Text style={styles.titleText}>Shop Description and Information</Text>
						<Text>{dataSource.description_en}</Text>
					</ShopDetails>
					<View style={{
						marginLeft: 15,
						marginRight: 15,
						marginTop: 10,
						marginBottom: 10,
						borderBottomColor: colors.yellow,
						borderBottomWidth: 2
					}} />
					<ShopDetails>
						<Text style={styles.titleText}>Payment Method</Text>
						<PaymentMethod>
							{
								dataSource.payment_method.map((method, index) => (
									<PaymentMethodDetails key={index}>
										<FontAwesome name={getPaymenticon(method.code)} size={20} style={{ paddingRight: 5 }} />
										<Text style={{ paddingRight: 5 }}>{getPaymentLabel(method.code)}</Text>
									</PaymentMethodDetails>
								))
							}
						</PaymentMethod>
					</ShopDetails>
					<View style={{
						marginLeft: 15,
						marginRight: 15,
						marginTop: 10,
						marginBottom: 10,
						borderBottomColor: colors.yellow,
						borderBottomWidth: 2
					}} />
					<ShopFeedback>
						<Text style={styles.titleText}>Feedback &amp; Review</Text>
						{
							dataSourceComments.map((comment, index) => (
								<FeedbackContainer key={comment.comment_id}>
									{
										comment.user_profile_image != null && comment.user_profile_image !== 'undefined' ?
										<FeedbackUserImage source={{ uri: comment.user_profile_image }} /> :
										<FeedbackUserImage source={require("../../img/no_user.jpg")} />
									}
									<FeedbackDetails>
										<View style={{ display: 'flex', flexDirection: 'row' }}>
											<Text style={styles.titleText}>{comment.user_name !== null ? comment.user_name : "Unknown User"}</Text>
											<Text style={{ flex: 1, textAlign: 'right' }}>{comment.posted_date}</Text>
										</View>
										<Text multiline={true} style={{ flex: 1 }}>
											{comment.content}
										</Text>
									</FeedbackDetails>
								</FeedbackContainer>
							))
						}
					</ShopFeedback>

				</ScrollView>
				<ModalCustom
					isVisible={this.state.isModalVisible}
					backdropOpacity={0.30}
					onBackButtonPress={() => {
						this._setModalVisible(!this.state.isModalVisible)
					}}
					onBackdropPress={() => {
						this._setModalVisible(!this.state.isModalVisible)
					}}>
					<View style={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}>
						<View style={{
							width: 300,
							height: 300,
							backgroundColor: colors.white,
							padding: 50
						}}>
							<Text>Rate the shop:</Text>
							<StarRating
								maxStars={5}
								rating={this.state.starCount}
								emptyStarColor={colors.gold}
								fullStarColor={colors.gold}
								starSize={30}
								selectedStar={(rating) => this.setState({ starCount: rating })}
							/>
							<TouchableOpacity onPress={
								() => this._rateShop(this.props.screenProps.user.id, dataSource.id, this.state.starCount, function (ret) {
									if (ret) {
										this._setModalVisible(!this.state.isModalVisible);
										this._getShop(dataSource.id);
									}
								}.bind(this))
							}>
								<View style={{
									backgroundColor: "lightblue",
									padding: 12,
									margin: 16,
									justifyContent: "center",
									alignItems: "center",
									borderRadius: 4,
									borderColor: "rgba(0, 0, 0, 0.1)"
								}}>
									<Text>OK</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</ModalCustom>
				<BottomToolbar actions={[
					{
						icon: this.state.followIcon,
						label: this.state.followLabel,
						color: colors.red,
						onClickHandler: () => {
							screenProps.user.token ? (
								dataSource.is_following ?
									this._unfollow(dataSource.id, (ret) => this._setFollowState(ret))
									:
									this._follow(dataSource.id, (ret) => this._setFollowState(ret))
							) : navigation.navigate('UserWelcome')
						}
					}, {
						icon: 'wechat',
						label: 'Comment',
						color: colors.turquoise,
						onClickHandler: () => {
							screenProps.user.token ? (
								navigation.navigate('Comments', {
									id: this.props.navigation.state.params.id
									, type: apis.types.shop
									, onResume: (ret) => {
										if (ret) {
											this._getComments(navigation.state.params.id);
										}
									}
								})
							) : navigation.navigate('UserWelcome')
						}
					}, {
						icon: 'star',
						label: 'Rate',
						color: colors.turquoise,
						onClickHandler: () => {
							screenProps.user.token ? (this._setModalVisible(!this.state.isModalVisible)) : navigation.navigate('UserWelcome')
						}
					}
				]} />
			</View>
		);
	}
}
const styles = StyleSheet.create({
	baseText: {
		fontFamily: 'Roboto',
		fontSize: 14,
		color: colors.gray,
	},
	buttonText: {
		fontFamily: 'Roboto',
		padding: 4,
	},
	titleText: {
		fontFamily: 'Roboto',
		fontSize: 14,
		color: colors.turquoise,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	header: {
		fontSize: 18,
		color: colors.gray,
	}
});
export default Info;