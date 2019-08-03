const USER_LOGIN = 'hkapp/auth/USER_LOGIN';
const USER_LOGOUT = 'hkapp/auth/USER_LOGOUT';
const USER_VERIFY = 'hkapp/auth/USER_VERIFY';
const ADD_TO_CART = 'hkapp/product/ADD_TO_CART';
const SEARCH_ADD = 'hkapp/product/SEARCH_ADD';
const SEARCH_DELETE = 'hkapp/product/SEARCH_DELETE';

const initialState = {
  cart: '0',
  user: {},
  search: [],
}

export function loginUser(user) {
  return {
    type: USER_LOGIN,
    payload: user,
  }
}

export function logoutUser(user) {
  return {
    type: USER_LOGOUT,
  }
}

export function addToCart(cart) {
  return {
    type: ADD_TO_CART,
    payload: cart && cart,
  }
}

export function searchHistoryAdd(search) {
  return {
    type: SEARCH_ADD,
    payload: search && search,
  }
}

export function searchHistoryDelete() {
  return {
    type: SEARCH_DELETE,
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    case USER_LOGOUT:
      // delete state.user;
      // delete state.cart;
      // delete state.search;

      return {
        ...state,
        user: {},
        cart: '0',
        search: [],
      };
    case USER_VERIFY:
      return {
        ...state,
      };
    case ADD_TO_CART:
      return {
        ...state,
        cart: action.payload,
      };
    case SEARCH_ADD:
      let index = state.search.indexOf(action.payload);

      if (index == -1) {
        return {
          ...state,
          search: [...state.search, action.payload],
        };
      }
      return {
        ...state,
      }
    case SEARCH_DELETE:
      return {
        ...state,
        search: [],
      };

  }

  return state;
};

//import { LOGIIN } from  '../types/actions/type';
//
//const initialState = {
//    token: '',
//    credentials: [],
//}
//
//const authReducer = (state = initialState, action ) => {
//    switch(action.type) {
//        case LOGIN:
//            return {
//                ...state,
//            };
//
//        default:
//            return state;
//    }
//}
//
//export default authReducer;