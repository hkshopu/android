import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import reducer from './reducers/index';

let middlewareGroup = [promise(), thunk];

export default createStore(reducer, applyMiddleware(...middlewareGroup));