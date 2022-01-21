import {combineReducers,createStore,applyMiddleware} from 'redux'
import data_Reducer from './src/Data_Service/reducer'


import thunk from 'redux-thunk'

const reducer= combineReducers({data_Reducer})

const store= createStore(reducer,applyMiddleware(thunk))
export default store