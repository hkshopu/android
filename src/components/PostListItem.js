import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import { colors } from '../theme';
import { FontAwesome } from '@expo/vector-icons';

const ArticleListContainer = styled.TouchableOpacity`
  border: 1px solid ${colors.gray};
  display: flex;
  flex-direction: row;
  padding: 5px;
  margin: 1%;
`;

const ArticleImage = styled.Image`
  flex: 1;
  width: 100%;
  height: 100px;
`;

const ArticleDetails = styled.View`
  flex: 2;
  padding: 0 5px;
`;

const ArticleCategory = styled.Text`
  font-style: italic;
`;

const ArticleDetailsHeader = styled.View({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const ArticleTitle = styled.Text`
  flex: 1;
  font-weight: bold;
`;

const ArticleTime = styled.View({
  display: 'flex', 
  flexDirection: 'row', 
  flexWrap: 'wrap', 
  justifyContent: 'space-around', 
});

const getFirstImage = image => {
  if (typeof image === 'undefined' || image.length === 0) return 'https://dummyimage.com/600x400/000/fff';

  return image[0].url;
}

class PostListItem extends PureComponent {
  constructor() {
    super();

    this._handleOnClick = this._handleOnClick.bind(this);
  }

  _handleOnClick() {
    const { onClickHandler } = this.props;

    if (typeof onClickHandler === 'undefined' || !onClickHandler) {
      return false;
    }

    onClickHandler();
  }

  render() {
    const {
      title_en,
      category,
      content_en,
      created_at,
      date_publish_start,
      views,
      image,
      thumbnail,
    } = this.props;

    let datePosted = date_publish_start !== null? String(date_publish_start).split(' ')[0] : String(created_at).split(' ')[0];

    return (
      <View>
        <ArticleListContainer onPress={this._handleOnClick}>
          <ArticleImage source={{ uri: getFirstImage(image) }}/>
          <ArticleDetails>
            <ArticleDetailsHeader>
              <ArticleTitle numberOfLines={1} ellipsizeMode="tail">{title_en}</ArticleTitle>
              <ArticleTime>
                <FontAwesome name="clock-o" size={20}/>
                <Text style={{ marginLeft: 5 }}>{datePosted}</Text>
              </ArticleTime>
            </ArticleDetailsHeader>
            <ArticleDetailsHeader style={{marginBottom: 5}}>
                <ArticleCategory numberOfLines={1} ellipsizeMode="tail">{category.name}</ArticleCategory>
                <ArticleTime style>
                    <FontAwesome name="eye" size={20}/>
                    <Text style={{ marginLeft: 5 }}>{views}</Text>
                </ArticleTime>
            </ArticleDetailsHeader>
            <Text numberOfLines={3} ellipsizeMode="tail">{content_en}</Text>
          </ArticleDetails>
        </ArticleListContainer>
      </View>
    );
  }
}

PostListItem.propTypes = {
  title_en: PropTypes.string,
  category: PropTypes.object,
  content_en: PropTypes.string,
  created_at: PropTypes.string,
  date_publish_start: PropTypes.string,
  views: PropTypes.number,
  image: PropTypes.array,
  onClickHandler: PropTypes.func,
};

PostListItem.defaultProps = {
  thumbnail: 'https://dummyimage.com/600x400/000/fff',
};

export default PostListItem;
