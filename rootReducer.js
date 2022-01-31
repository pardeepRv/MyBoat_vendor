import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import data_Reducer from './src/Data_Service/reducer';
import { createLogger } from 'redux-logger';

const reducer = combineReducers({ data_Reducer })

const store = createStore(reducer, applyMiddleware(thunk,createLogger()))
export default store