import React, { Component } from 'react';
import { View } from 'react-native';
import PostListItem from '../../components/PostListItem';
import styled from 'styled-components/native';
import BottomToolbarThin from '../../components/BottomToolbarThin';
import { colors } from '../../theme';

const NewsContainer = styled.ScrollView`
  background-color: ${colors.white};
`;

const NewsList = [
  {
    id: 1,
    title: 'news 1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    category: 'news category',
    featured_image: 'https://dummyimage.com/600x400/000/fff',
    created_at: new Date(),
    views: 123
  },
  {
    id: 2,
    title: 'news 1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    category: 'news category',
    featured_image: 'https://dummyimage.com/600x400/000/fff',
    created_at: new Date(),
    views: 123
  },
  {
    id: 3,
    title: 'news 1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    category: 'news category',
    featured_image: 'https://dummyimage.com/600x400/000/fff',
    created_at: new Date(),
    views: 123
  },
  {
    id: 4,
    title: 'news 1',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    category: 'news category',
    featured_image: 'https://dummyimage.com/600x400/000/fff',
    created_at: new Date(),
    views: 123
  },
];

export default class News extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <NewsContainer>
          {/* {
            NewsList.map((news, index) => (
              <PostListItem
                key={index}
                onClickHandler={() => navigation.navigate('Post', { ...news })}
                {...news}
              />
            ))
          } */}
        </NewsContainer>
        <BottomToolbarThin actions={[
          {
            icon: 'filter',
			onClickHandler: () => console.log('clicked Filter')
          },
          {
            icon: 'sort',
			onClickHandler: () => console.log('clicked Sort') 
          }
        ]} />
      </View>
    )
  }
}
