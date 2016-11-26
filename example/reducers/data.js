import {
  ADD_ROW,
  DELETE_ROW,
  COLOR_CHANGE,
  LABEL_CHANGE,
  VALUE_CHANGE
} from '../constants';

function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer
      ? reducer(state, action.payload, action.id)
      : state;
  };
}

const salesData = [
  { label: 'JIVE', color: 'blue' },
  { label: 'NRCIA', color: 'red' },
  { label: 'SPHS', color: 'limegreen' },
  { label: 'TSLA', color: 'mediumpurple' },
  { label: 'ISLE', color: 'orange' },
  { label: 'SLAB', color: 'firebrick' }
];

function randomData() {
  return salesData.map(d =>
    ({
      label: d.label,
      value: 100 * Math.random(),
      color: d.color
    })
  );
}

const initialState = randomData();

export default createReducer(initialState, {
  [ADD_ROW]: state => {
    return Object.assign([], state, state.push({
      value: 10,
      label: '',
      color: '#cacaca'
    }));
  },
  [DELETE_ROW]: state => {
    return Object.assign([], state.slice(0, state.length - 1));
  },
  [COLOR_CHANGE]: (state, payload, id) => {
    return Object.assign([], state, state.map(d => {
      if (state.indexOf(d) === id) {
        state[id].color = payload.data;
      }
      return d;
    }));
  },
  [LABEL_CHANGE]: (state, payload, id) => {
    return Object.assign([], state, state.map(d => {
      if (state.indexOf(d) === id) {
        state[id].label = payload.data;
      }
      return d;
    }));
  },
  [VALUE_CHANGE]: (state, payload, id) => {
    return Object.assign([], state, state.map(d => {
      if (state.indexOf(d) === id) {
        state[id].value = payload.data;
      }
      return d;
    }));
  },
});
