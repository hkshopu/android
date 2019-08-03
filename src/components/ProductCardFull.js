import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { colors } from '../theme';
import BottomToolbar from './BottomToolbar';

const ProductCardContainer = styled.View`
  margin: 1%;
  border: 1px solid #cccccc;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductAdvertisedText = styled.Text`
  text-align: right;
  color: #cccccc;
  margin: 5px;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 150px;
  flex: 1;
`;

const ProductDetails = styled.View`
  width: 100%;
  padding: 5px;
  flex: 1;
`;

const ProductTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  margin: 3px 0;
`;

const ProductCategory = styled.Text`
  color: ${colors.gray};
  margin: 3px 0;
`;

const ProductDescription = styled.Text`
  margin: 3px 0;
`;

const ProductPrice = styled.Text`
  font-size: 25px;
  font-weight: bold;
  margin: 3px 0;
`;

const ProductToolbar = styled(BottomToolbar)`
  flex: 1;
  justify-content: flex-end;
`;

const getFirstImage = images => {
  if (typeof images === 'undefined' || images.length === 0) return '';

  return images[0];
}

class ProductCardFull extends PureComponent {
  render() {
    const { 
      isAdvertised,
      name,
      images,
      category,
      sub_category,
      description,
      currency,
      price,
    } = this.props;

    return (
      <ProductCardContainer>
        { isAdvertised && <ProductAdvertisedText>Advertising</ProductAdvertisedText> }
        <ProductImage source={{uri: getFirstImage(images)}}/>
        <ProductDetails>
          <ProductTitle ellipsizeMode="tail" numberOfLines={1}>{name}</ProductTitle>
          <Text style={{ color: colors.gray }} ellipsizeMode="tail" numberOfLines={1}>Shop Title</Text>
        </ProductDetails>
        <ProductToolbar
          actions={[
            {
              icon: 'share',
            },
            {
              icon: 'heart',
            },
            {
              icon: 'cart-plus',
            }
          ]}
        />
      </ProductCardContainer>
    )
  }
}

ProductCardFull.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
  price: PropTypes.number,
  currency: PropTypes.shape({
    code: PropTypes.string,
    label: PropTypes.string,
  }),
  shop: PropTypes.shape({
    title: PropTypes.string,
  }),
  category: PropTypes.shape({
    title: PropTypes.string,
  }),
  sub_category: PropTypes.shape({
    title: PropTypes.string,
  }),
  description: PropTypes.string,
  isAdvertised: PropTypes.bool,
};

export default ProductCardFull;
