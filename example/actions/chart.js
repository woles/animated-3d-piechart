import {
  CHART_SIZE_CHANGE,
  HEIGHT_CHANGE,
  RADIUS_CHANGE,
  ANGLE_CHANGE,
  DURATION_CHANGE,
  FONT_SIZE_CHANGE,
  TOGGLE_ANIMATION,
  TOGGLE_SLICE_SELECT,
  TOGGLE_LABEL,
  TOGGLE_LABEL_COLOR,
  TOGGLE_TOOLTIP
} from '../constants';


export function changeChartSize(data) {
  return {
    type: CHART_SIZE_CHANGE,
    payload: {
      data
    }
  };
}

export function changeHeight(data) {
  return {
    type: HEIGHT_CHANGE,
    payload: {
      data
    }
  };
}

export function changeRadius(data) {
  return {
    type: RADIUS_CHANGE,
    payload: {
      data
    }
  };
}

export function changeAngle(data) {
  return {
    type: ANGLE_CHANGE,
    payload: {
      data
    }
  };
}

export function changeDuration(data) {
  return {
    type: DURATION_CHANGE,
    payload: {
      data
    }
  };
}

export function changeFontSize(data) {
  return {
    type: FONT_SIZE_CHANGE,
    payload: {
      data
    }
  };
}

export function toggleAnimation() {
  return {
    type: TOGGLE_ANIMATION
  };
}

export function toggleSliceSelect() {
  return {
    type: TOGGLE_SLICE_SELECT
  };
}

export function toggleLabel() {
  return {
    type: TOGGLE_LABEL
  };
}

export function toggleLabelColor() {
  return {
    type: TOGGLE_LABEL_COLOR
  };
}

export function toggleTooltip() {
  return {
    type: TOGGLE_TOOLTIP
  };
}
