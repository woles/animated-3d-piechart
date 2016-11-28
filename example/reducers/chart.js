import {
  HEIGHT_CHANGE,
  RADIUS_CHANGE,
  ANGLE_CHANGE,
  DURATION_CHANGE,
  FONT_SIZE_CHANGE,
  CHART_SIZE_CHANGE,
  TOGGLE_ANIMATION,
  TOGGLE_SLICE_SELECT,
  TOGGLE_LABEL,
  TOGGLE_LABEL_COLOR,
  TOGGLE_TOOLTIP
} from '../constants';

function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer
      ? reducer(state, action.payload)
      : state;
  };
}

function onSliceSelect(d) {
  console.log(d);
}

function labelFunction(d) {
  return `${d.data.label ? d.data.label : ''}(${Math.round((d.endAngle - d.startAngle) /
        (2 * Math.PI) * 100)}%)`;
}

function labelColor(d) {
  return d.value < 20 ? 'red' : 'black';
}

function tooltipFunction(d) {
  return `${Number(d.value).toFixed(2)}`;
}

const initialState = {
  h: 40,
  angle: 60,
  ir: 60,
  size: 100,
  animationDuration: 750,
  fontSize: 12,
  animatedSlices: true,
  labelColor: labelColor,
  linesColor: d => d.value < 20 ? 'red' : 'black',
  onSliceSelect: onSliceSelect,
  label: labelFunction,
  tooltip: tooltipFunction
};

export default createReducer(initialState, {
  [CHART_SIZE_CHANGE]: (state, payload) => {
    return Object.assign({}, state, {
      size: payload.data
    });
  },
  [HEIGHT_CHANGE]: (state, payload) => {
    return Object.assign({}, state, {
      h: payload.data
    });
  },
  [RADIUS_CHANGE]: (state, payload) => {
    return Object.assign({}, state, {
      ir: payload.data
    });
  },
  [ANGLE_CHANGE]: (state, payload) => {
    return Object.assign({}, state, {
      angle: payload.data
    });
  },
  [DURATION_CHANGE]: (state, payload) => {
    return Object.assign({}, state, {
      animationDuration: payload.data
    });
  },
  [FONT_SIZE_CHANGE]: (state, payload) => {
    return Object.assign({}, state, {
      fontSize: payload.data
    });
  },
  [TOGGLE_ANIMATION]: (state) => {
    return Object.assign({}, state, {
      animatedSlices: !state.animatedSlices
    });
  },
  [TOGGLE_SLICE_SELECT]: (state) => {
    return Object.assign({}, state, {
      onSliceSelect: state.onSliceSelect ? false : onSliceSelect
    });
  },
  [TOGGLE_LABEL]: (state) => {
    return Object.assign({}, state, {
      label: state.label ? false : labelFunction
    });
  },
  [TOGGLE_LABEL_COLOR]: (state) => {
    return Object.assign({}, state, {
      labelColor: state.labelColor !== 'black' ? 'black' : labelColor,
      linesColor: state.labelColor !== 'black' ? 'black' : labelColor,
    });
  },
  [TOGGLE_TOOLTIP]: (state) => {
    return Object.assign({}, state, {
      tooltip: state.tooltip ? false : tooltipFunction
    });
  },

});
