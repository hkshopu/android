import { createStackNavigator } from 'react-navigation';

import Main from './main';
import Shop from './shop';
import Login from '../screens/User/Login';
import Forgot from '../screens/User/Forgot';
import Join from '../screens/User/Join';
import SuccessJoin from '../screens/User/SuccessJoin';
import EditProfile from '../screens/User/EditProfile';
import EditPage from '../screens/User/EditPage';
import UserWelcome from '../screens/User/UserWelcome';
import Notice from '../screens/User/Notice';
import Invoice from '../screens/User/Invoice';
import BuyRecord from '../screens/User/BuyRecord';
import Product from '../screens/Product';
import Settings from '../screens/Settings';
import Post from '../screens/Post';
import Comments from '../screens/Comments';
import ProductCategory from '../screens/ProductCategory';
import SearchResult from '../screens/Search/SearchResult';
import Filters from '../screens/Search/Filter';
import ShoppingCart from '../screens/Order/ShoppingCart';
import ShippingDetails from '../screens/Order/ShippingDetails';
import PaymentDetails from '../screens/Order/PaymentDetails';
import PaypalView from '../screens/Order/PaypalView';
import OrderConfirmation from '../screens/Order/OrderConfirmation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addToCart, searchHistoryAdd } from '../reducers/auth';

const Navigator = createStackNavigator({
  Main: {
    screen: Main,
    navigationOptions: {
      header: null
    }
  },
  Shop: {
    screen: Shop,
    navigationOptions: {
      header: null
    }
  },
  Product,
  Login,
  Forgot,
  Join,
  SuccessJoin: {
    screen: SuccessJoin,
    navigationOptions: {
      header: null
    }
  },
  Settings,
  EditProfile,
  UserWelcome: {
    screen: UserWelcome,
    navigationOptions: {
      header: null
    }
  },
  Notice,
  Invoice,
  BuyRecord,
  Post,
  Comments,
  SearchResult: {
    screen: SearchResult,
    navigationOptions: {
      header: null
    }
  },
  Filters,
  ShoppingCart,
  ShippingDetails,
  PaymentDetails,
  PaypalView,
  OrderConfirmation: {
    screen: OrderConfirmation,
    navigationOptions: {
      header: null
    }
  },
  ProductCategory,
  EditPage:{
    screen: EditPage,
    navigationOptions: {
      header: null
    }
  },
});

const mapStateToProps = state => {
  // console.log(state);

  return {
    cart: state.auth.cart,
    user: state.auth.user,
    search: state.auth.search,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators([addToCart(), searchHistoryAdd()], dispatch)

const mergeProps = (state, ownProps) => {
  return ({
    ...ownProps,
    screenProps: {
      ...ownProps.screenProps,
      ...state,
    }
  })
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Navigator);
