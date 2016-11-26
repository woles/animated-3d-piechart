import {
  ADD_ROW,
  DELETE_ROW,
  COLOR_CHANGE,
  LABEL_CHANGE,
  VALUE_CHANGE
} from '../constants';

export function addRow() {
  return {
    type: ADD_ROW
  };
}

export function deleteRow() {
  return {
    type: DELETE_ROW
  };
}

export function changeColor(id, data) {
  return {
    type: COLOR_CHANGE,
    payload: {
      data
    },
    id: id
  };
}

export function changeLabel(id, data) {
  return {
    type: LABEL_CHANGE,
    payload: {
      data
    },
    id: id
  };
}

export function changeValue(id, data) {
  return {
    type: VALUE_CHANGE,
    payload: {
      data
    },
    id: id
  };
}

