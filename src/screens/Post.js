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

const PostContainer = styled.ScrollView`
  background-color: ${colors.white};
`;

const ImageContainer = styled.ScrollView`
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray};
  border-style: solid;
`;

const Image = styled.Image`
  height: ${height};
  width: ${width};
`;

const PostDetails = styled.View`
  margin: 5px;
  padding-bottom: 10px;
  border-bottom-color: ${colors.gray};
  border-bottom-width: 1px;
  border-style: solid;
`;

const PostTitle = styled.Text`
  font-size: 25px;
  font-weight: bold;
`;

const PostCategory = styled.Text`
  font-style: italic;
  color: ${colors.gray};
`;

const PostStats = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 50%;
`;

const PostStat = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 10px 0;
`;

const PostDescription = styled.Text`
`;

const Comments = styled.View`
  padding: 5px;
`;

const CommentContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
`;

const CommentUserImage = styled.Image`
  border-radius: 25;
  height: 100px;
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const CommentDetails = styled.View`
  flex: 2;
`;

const getUserProfileImage = image => {
  if (typeof image === 'undefined' || image === null) return 'https://dummyimage.com/600x400/ccc/000';
  return image;
}

export default class Post extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title_en || 'Post'
  })

  constructor() {
		super();
    this._getBlogs = this._getBlogs.bind(this);
    
    this.state = {
			isLoading: true,
      dataSource: null,
    }
	}

  componentDidMount() {
    const {navigation} = this.props;

    if(navigation.state.params.type == 1) {
      return this._getBlogs(apis.urls.blog.comment, navigation.state.params.id);

    } else if(navigation.state.params.type == 2) {
      console.log("product");
    
    } else {
      console.log("unknown");
    }
	}

	_getBlogs(apiURL, blogID) {
		Axios.get(apiURL + "/" + blogID, {
      // params: {
      //   blog_id: blogID,
      // },
      headers: {
          token: this.props.screenProps.user.token ? this.props.screenProps.user.token : '',
          
				}
			})
			.then((response) => {
				this.setState({
					isLoading: false,
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
      <PostContainer>
        <ImageContainer 
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {navigation.state.params.image.map((image) => {
							return (
								<View key={image.id}>
									<Image source={{ uri: image.url }} />
								</View>
							);
						})}
        </ImageContainer>
        <PostDetails>
          <PostTitle>{navigation.state.params.title_en || 'Post'}</PostTitle>
          <PostCategory>{navigation.state.params.category.name}</PostCategory>
          <PostStats>
            <PostStat>
              <FontAwesome name="eye" size={20}/>
              <Text>{navigation.state.params.views}</Text>
            </PostStat>
            <PostStat>
              <FontAwesome name="clock-o" size={20}/>
              <Text>{navigation.state.params.created_at}</Text>
            </PostStat>
          </PostStats>
          <PostDescription>
            {navigation.state.params.content_en}
          </PostDescription>
        </PostDetails>
        <Comments>
          <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10 }}>Comments</Text>
          {
            dataSource.map((blog, index) => (
              <CommentContainer key={blog.comment_id}>
                <CommentUserImage source={{ uri: getUserProfileImage(blog.user_profile_image) }}/>
                <CommentDetails>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text style={{ flex: 1, fontWeight: 'bold' }}>{blog.user_name !== null ? blog.user_name : "Unknown User"}</Text>
                    <Text style={{ flex: 1, textAlign: 'right' }}>{blog.posted_date}</Text>
                  </View>
                  <Text ellipsizeMode="tail" numberOfLines={1} style={{ flex: 1 }}>
                    {blog.content}
                  </Text>
                </CommentDetails>
              </CommentContainer>
            ))
          }
        </Comments>
        <BottomToolbar actions={[
		    {
			  icon: 'wechat',
			  label: 'Comment',
			  color: colors.black,
			  onClickHandler: () => {
			    screenProps.user.token ? (
                    navigation.navigate('Comments', {
                        id: this.props.navigation.state.params.id
                        , type: navigation.state.params.type
                        , onResume: (ret) => this._getBlogs(apis.urls.blog.comment, navigation.state.params.id)
                    })
                ) : navigation.navigate('UserWelcome')
			  }
			},
		]} />
      </PostContainer>
    );
  }
}
