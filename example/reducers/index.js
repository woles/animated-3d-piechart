import { combineReducers } from 'redux';
import chart from './chart';
import data from './data';

const rootReducer = combineReducers({
  chart: chart,
  data: data
});

export default rootReducer;
