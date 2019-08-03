import React, { PureComponent } from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import BottomToolbar from './BottomToolbar';
import { colors } from '../theme';
import StarRating from 'react-native-star-rating';
import { FontAwesome } from '@expo/vector-icons';

const ProductCardContainer = styled.View`
background-color: ${colors.white};
display: flex;
flex-direction: row;
padding: 5px;
margin: 1%;
`;

const ProductAdvertisedText = styled.Text`
  text-align: right;
  color: #cccccc;
  padding: 5px;
`;

const ProductImage = styled.Image`
flex: 1;
width: 100%;
height: 100px;
`;

const ProductDetails = styled.View`
flex: 2;
padding: 0 5px;
`;

const ProductDetailsLeft = styled.View`
display: flex;
flexDirection: row;
flexWrap: wrap;
alignItems: center;
justifyContent: space-between;
`;

const ProductRating = styled.View({
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 3,
});

const ProductStat = styled.View`
flex:1;
flexDirection: row;
justify-content: flex-end;
`;

const ProductDetailsRight = styled.View`
  flex: 1;
  align-items: flex-end;
`;

const ProductToolbar = styled(BottomToolbar)`
  flex: 1;
  justify-content: flex-end;
`;

const getFirstImage = image => {
    if (typeof image === 'undefined' || image.length === 0) return 'https://dummyimage.com/600x400/000/fff';
    return image[0].url;
}

class ProductCardList extends PureComponent {
    render() {
        const {
            image,
            name_en,
            price_discounted,
            price_original,
            description_en,
            rating,
            followers,
            is_following,
            currency,
            shop,
            isAdvertised,
            hasActions,
        } = this.props;

        const org_price = (
            <ProductDetailsLeft>
                <Text numberOfLines={1} style={styles.titleText}>${price_original}</Text>
            </ProductDetailsLeft>
        );

        const discounted = (
            <ProductDetailsLeft>
                <Text numberOfLines={1} style={styles.titleText}>${price_discounted}</Text>
                <Text numberOfLines={1} style={styles.strike}>${price_original}</Text>
            </ProductDetailsLeft>
        );

        return (
            <ProductCardContainer>
                {isAdvertised && <ProductAdvertisedText>Advertising</ProductAdvertisedText>}
                <ProductImage source={{ uri: getFirstImage(image) }} />
                <ProductDetails>
                    <ProductDetailsLeft>
                        <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">{name_en}</Text>
                        <Text style={styles.priceText} numberOfLines={1} ellipsizeMode="tail"> HK${this.props.price_discounted === null ? price_original : price_discounted}</Text>
                    </ProductDetailsLeft>
                    <ProductDetailsLeft style={{ marginBottom: 5 }}>
                        <Text style={styles.subTitleText} numberOfLines={1} ellipsizeMode="tail">{shop.name_en}</Text>
                        <Text style={styles.strike} numberOfLines={1} ellipsizeMode="tail">{this.props.price_discounted !== null && 'HK$' + price_original}</Text>
                    </ProductDetailsLeft>
                    <Text numberOfLines={3} ellipsizeMode="tail">{description_en}</Text>
                    <ProductStat>
                        <ProductRating>
                            <ProductDetailsLeft>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={rating.average}
                                    emptyStarColor={colors.gold}
                                    fullStarColor={colors.gold}
                                    starSize={15}
                                />
                                <Text>({rating.count})</Text>
                            </ProductDetailsLeft>
                        </ProductRating>
                        <ProductRating>
                            <ProductDetailsLeft>
                                <FontAwesome name={is_following ? 'heart' : 'heart-o' } size={15} color={colors.red} style={{ marginRight: 5 }} />
                                <Text>({followers})</Text>
                            </ProductDetailsLeft>
                        </ProductRating>

                    </ProductStat>
                </ProductDetails>
            </ProductCardContainer>
        )
    }
}

ProductCardList.propTypes = {
    image: PropTypes.arrayOf(PropTypes.object),
    name_en: PropTypes.string,
    price_discounted: PropTypes.number,
    price_original: PropTypes.number,
    currency: PropTypes.shape({
        code: PropTypes.string,
        label: PropTypes.string,
    }),
    description_en: PropTypes.string,
    rating: PropTypes.shape({
        average: PropTypes.number,
        count: PropTypes.number,
    }),
    followers: PropTypes.number,
    is_following: PropTypes.bool,
    shop: PropTypes.shape({
        name_en: PropTypes.string,
    }),
    isAdvertised: PropTypes.bool,
    hasActions: PropTypes.bool,
};

const styles = StyleSheet.create({
    titleText: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.turquoise,
    },
    subTitleText: {
        fontSize: 12,
        color: colors.gray,
    },
    priceText: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.gray,
        marginLeft: 5,
        textAlign: 'right',
    },
    strike: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        textAlign: 'left',
        marginLeft: 5,
        color: colors.gray,
    }
});

export default ProductCardList;
