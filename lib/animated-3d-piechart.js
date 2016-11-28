(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"));
	else if(typeof define === 'function' && define.amd)
		define(["d3"], factory);
	else if(typeof exports === 'object')
		exports["animated-3d-piechart"] = factory(require("d3"));
	else
		root["animated-3d-piechart"] = factory(root["d3"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _d = __webpack_require__(0);

var piechart3D = {};

var colors = ['limegreen', 'mediumvioletred', 'mediumpurple', 'orange', 'firebrick', 'chartreuse', 'dodgerblue', 'tomato'];

function prepearData(_data, fontSize, height) {
  var data = (0, _d.pie)().value(function (d) {
    return d.value;
  })(_data);
  var newSlice = null;

  data = data.map(function (d) {
    if (d.startAngle < Math.PI / 2 && d.endAngle > 3 / 2 * Math.PI) {
      newSlice = {
        value: d.value,
        startAngle: Math.PI / 2,
        endAngle: d.endAngle,
        data: d.data,
        index: data.length,
        parentIndex: d.index,
        oldEndAngle: d.endAngle,
        oldSartAngle: d.startAngle
      };
      d.oldEndAngle = d.endAngle;
      d.oldSartAngle = d.startAngle;
      d.endAngle = Math.PI / 2;
      d.childIndex = data.length;
    }
    return d;
  });

  if (newSlice) {
    data.push(newSlice);
  }

  var pi1 = data.map(function (d) {
    return d.endAngle <= Math.PI / 2 ? d : null;
  }).filter(function (d) {
    return d !== null;
  }).sort(function (a, b) {
    return b.value - a.value;
  });
  var pi2 = data.map(function (d) {
    return d.endAngle > Math.PI / 2 && d.endAngle <= Math.PI ? d : null;
  }).filter(function (d) {
    return d !== null;
  }).sort(function (a, b) {
    return a.value - b.value;
  });
  var pi3 = data.map(function (d) {
    return d.endAngle > Math.PI && d.endAngle <= 3 * Math.PI / 2 ? d : null;
  }).filter(function (d) {
    return d !== null;
  }).sort(function (a, b) {
    return a.value - b.value;
  });
  var pi4 = data.map(function (d) {
    return d.endAngle > 3 * Math.PI / 2 ? d : null;
  }).filter(function (d) {
    return d !== null;
  }).sort(function (a, b) {
    return b.value - a.value;
  });

  data = [].concat(pi4).concat(pi1).concat(pi3).concat(pi2);

  data = data.map(function (d) {
    if (Math.round((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) < 2) {
      d.data.labelMargin = fontSize / (height / 180) + data[data.indexOf(d) - 1].data.labelMargin;
    } else {
      d.data.labelMargin = 0;
    }
    return d;
  });
  return data;
}

function checkDataColors(data) {
  return data.map(function (d) {
    if (!d.color) {
      d.color = colors[data.indexOf(d) % colors.length];
    }
    return d;
  });
}

function checkData(data) {
  return data.map(function (d) {
    return (typeof d === 'undefined' ? 'undefined' : _typeof(d)) === 'object' ? Object.assign({}, d) : { value: Number(d) };
  });
}

function midAngle(d) {
  return d.oldEndAngle ? d.oldSartAngle + (d.oldEndAngle - d.oldSartAngle) / 2 : d.startAngle + (d.endAngle - d.startAngle) / 2;
}

function pieTop(d, rx, ry, ir) {
  if (d.endAngle - d.startAngle === 0) {
    return 'M 0 0';
  }

  var sx = rx * Math.cos(d.startAngle);
  var sy = ry * Math.sin(d.startAngle);
  var ex = rx * Math.cos(d.endAngle);
  var ey = ry * Math.sin(d.endAngle);
  var ret = [];

  ret.push('M', sx, sy, 'A', rx, ry, '0', d.endAngle - d.startAngle > Math.PI ? 1 : 0);
  ret.push('1', ex, ey, 'L', ir * ex, ir * ey);
  ret.push('A', ir * rx, ir * ry, '0', d.endAngle - d.startAngle > Math.PI ? 1 : 0, '0', ir * sx, ir * sy, 'z');
  return ret.join(' ');
}

function pieInner(d, rx, ry, h, ir) {
  var startAngle = d.startAngle < Math.PI ? Math.PI : d.startAngle;
  var endAngle = d.endAngle < Math.PI ? Math.PI : d.endAngle;
  var sx = ir * rx * Math.cos(startAngle);
  var sy = ir * ry * Math.sin(startAngle);
  var ex = ir * rx * Math.cos(endAngle);
  var ey = ir * ry * Math.sin(endAngle);
  var ret = [];

  ret.push('M', sx, sy, 'A', ir * rx, ir * ry, '0 0 1', ex, ey);
  ret.push('L', ex, h + ey, 'A', ir * rx, ir * ry, '0 0 0', sx, h + sy, 'z');
  return ret.join(' ');
}

function pieOuter(d, rx, ry, h) {
  var startAngle = d.startAngle > Math.PI ? Math.PI : d.startAngle;
  var endAngle = d.endAngle > Math.PI ? Math.PI : d.endAngle;
  var sx = rx * Math.cos(startAngle);
  var sy = ry * Math.sin(startAngle);
  var ex = rx * Math.cos(endAngle);
  var ey = ry * Math.sin(endAngle);
  var ret = [];

  ret.push('M', sx, h + sy, 'A', rx, ry, '0 0 1', ex, h + ey, 'L', ex, ey);
  ret.push('A', rx, ry, '0 0 0', sx, sy, 'z');
  return ret.join(' ');
}

function pieWalls(d, rx, ry, h, ir) {
  var sx = rx * Math.cos(d.startAngle);
  var sy = ry * Math.sin(d.startAngle);
  var ex = rx * Math.cos(d.endAngle);
  var ey = ry * Math.sin(d.endAngle);
  var ret = [];

  ret.push('M', ir * ex, ir * ey, 'L', ir * ex, ir * ey + h, 'L', ex, ey + h, 'L', ex, ey, 'z');
  ret.push('M', ir * sx, ir * sy, 'L', ir * sx, ir * sy + h, 'L', sx, sy + h, 'L', sx, sy, 'z');
  return ret.join(' ');
}

function labelPath(d, rx, ry, h) {
  var x1 = rx * Math.cos(midAngle(d));
  var y1 = ry * Math.sin(midAngle(d));
  var labelPathLength = 1 + h / rx / 2;
  var path = [];

  path.push('M', x1, y1, 'L', x1 * labelPathLength, y1 * labelPathLength);
  path.push('L', (rx + 14) * (midAngle(d) > 3 / 2 * Math.PI || midAngle(d) < Math.PI / 2 ? 1 : -1), y1 * labelPathLength + d.data.labelMargin);
  path.push('L', x1 * labelPathLength, y1 * labelPathLength, 'z');

  return path.join(' ');
}

function onClick(id, d, rx, ry, onSliceSelect) {
  function move() {
    var angle = midAngle(d);
    var ex = 0.2 * rx * Math.cos(angle > Math.PI ? angle : -angle);
    var ey = 0.2 * ry * Math.sin(angle);

    if (!d.data.moved) {
      return [ex, ey];
    }
    return [0, 0];
  }

  var pos = move();
  var slice = (0, _d.select)('#' + id + '-slice-' + d.index);
  var slice2 = null;
  var onClickSlice = slice.on('click');

  if (d.parentIndex === 0) {
    slice2 = (0, _d.select)('#' + id + '-slice-' + d.parentIndex);
    slice2.transition().duration(1000).attr('transform', 'translate(' + pos + ')').on('start', function () {
      return slice.on('click', null);
    }).on('end', function () {
      return slice.on('click', onClickSlice);
    });
  }

  if (d.childIndex) {
    slice2 = (0, _d.select)('#' + id + '-slice-' + d.childIndex);
    slice2.transition().duration(1000).attr('transform', 'translate(' + pos + ')').on('start', function () {
      return slice.on('click', null);
    }).on('end', function () {
      return slice.on('click', onClickSlice);
    });
  }

  slice.transition().duration(1000).attr('transform', 'translate(' + pos + ')').on('start', function () {
    return slice.on('click', null);
  }).on('end', function () {
    return slice.on('click', onClickSlice);
  });

  var tooltip = (0, _d.select)('#' + id + '-' + (d.childIndex ? d.childIndex : d.index) + '-tooltip');

  tooltip.transition().duration(1000).attr('transform', 'translate(' + pos + ')').on('start', function () {
    return tooltip.on('click', null);
  }).on('end', function () {
    return tooltip.on('click', onClickSlice);
  });

  var t = (0, _d.select)('#' + id + '-' + (d.childIndex ? d.childIndex : d.index) + '-text');
  t.transition().duration(1000).attr('transform', function (d2) {
    if (!d.data.moved) {
      d2.data.labelPosition = {
        x: t.node().transform.baseVal[0].matrix.e,
        y: t.node().transform.baseVal[0].matrix.f
      };
      return 'translate(' + [d2.data.labelPosition.x + pos[0], d2.data.labelPosition.y + pos[1]] + ')';
    }

    return 'translate(' + [d2.data.labelPosition.x, d2.data.labelPosition.y] + ')';
  });

  var path = (0, _d.select)('#' + id + '-' + (d.childIndex ? d.childIndex : d.index) + '-path');
  path.transition().duration(1000).attr('transform', 'translate(' + pos + ')');

  if (!d.data.moved) {
    d.data.moved = true;
  } else {
    d.data.moved = false;
  }

  if (onSliceSelect) {
    onSliceSelect(d);
  }
}

function prepareConfig(userConfig) {
  var conf = {
    h: 20,
    ir: 0,
    fontSize: 12,
    animationDuration: 750,
    linesColor: 'black',
    labelColor: 'black',
    angle: 45,
    onSliceSelect: null,
    animatedSlices: true,
    tooltipColor: 'black',
    size: 100,
    label: function label(d) {
      return (d.data.label ? d.data.label : '') + '(' + Math.round((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%)';
    },
    tooltip: function tooltip(d) {
      return '' + Number(d.value).toFixed(2);
    },
    topColor: function topColor(d) {
      return (0, _d.hsl)(d.data.color);
    },
    wallsColor: function wallsColor(d) {
      return (0, _d.hsl)(d.data.color).darker(0.7);
    }
  };

  conf = userConfig && (typeof userConfig === 'undefined' ? 'undefined' : _typeof(userConfig)) === 'object' ? Object.assign(conf, userConfig) : conf;

  conf.h = conf.h >= 0 ? conf.h : 0;
  conf.angle = conf.angle > 90 ? 90 : conf.angle;
  conf.angle = conf.angle < 0 ? 0 : conf.angle;
  conf.h *= (90 - conf.angle) / 90;

  conf.ir /= 100;
  conf.ir = conf.ir < 0 || conf.ir > 1 ? 0 : conf.ir;
  return conf;
}

piechart3D.update = function (chartId, _data, userConfig) {
  var conf = prepareConfig(userConfig);

  var height = (0, _d.select)('#' + chartId).node().getBoundingClientRect().height;
  var width = (0, _d.select)('#' + chartId).node().getBoundingClientRect().width;

  var rx = width / 4 * conf.size / 100;
  var ry = rx * conf.angle / 90;
  var duration = conf.animationDuration;

  var id = chartId + '-svg';

  var data = checkData(_data);

  data = checkDataColors(data);
  data = prepearData(data, conf.fontSize, height);

  function drowingStart(d) {
    (0, _d.select)('#' + id + '-slice-' + d.index).on('click', null);
  }

  function drowingEnd(d) {
    (0, _d.select)('#' + id + '-slice-' + d.index).on('click', function (d2) {
      return conf.animatedSlices ? onClick(id, d2, rx, ry, conf.onSliceSelect) : null;
    });
  }

  var slices = (0, _d.select)('#' + id).selectAll('.slice');

  slices.each(function (d) {
    if (d.data.moved) {
      onClick(id, d, rx, ry);
      d.data.moved = false;
    }

    return null;
  });

  var slicesCount = slices._groups[0].length;

  if (slicesCount > data.length) {
    for (var i = slicesCount - data.length - 1; i >= 0; i -= 1) {
      (0, _d.select)('#' + id + '-slice-' + i).remove();
      (0, _d.select)('#' + id + '-' + i + '-text').remove();
      (0, _d.select)('#' + id + '-' + i + '-path').remove();
    }
  } else if (slicesCount < data.length) {
    for (var _i = data.length - slicesCount - 1; _i >= 0; _i -= 1) {
      var slice = (0, _d.select)('#' + id).select('.slices').append('g').attr('class', 'slice').attr('id', '#' + id + '-slice-' + (data.length - _i));

      slice.append('path').attr('class', 'wallSlice');
      slice.append('path').attr('class', 'outerSlice');
      slice.append('path').attr('class', 'innerSlice');
      slice.append('path').attr('class', 'topSlice');

      (0, _d.select)('#' + id).select('.lines').append('path').attr('class', 'label-path');

      (0, _d.select)('#' + id).select('.labels').append('text').attr('class', 'label');

      (0, _d.select)('#' + id).select('.tooltips').append('text').attr('class', 'tooltip');
    }
  }

  slices.data(data).attr('id', function (d) {
    return id + '-slice-' + d.index;
  }).on('click', function (d) {
    return conf.animatedSlices ? onClick(id, d, rx, ry, conf.onSliceSelect) : null;
  }).on('mouseover', function (d) {
    (0, _d.select)('#' + id + '-' + d.index + '-tooltip').style('opacity', 1);
  }).on('mouseout', function (d) {
    (0, _d.select)('#' + id + '-' + d.index + '-tooltip').style('opacity', 0.0);
  });

  var topSlices = (0, _d.select)('#' + id).selectAll('.topSlice');

  topSlices.each(function (d) {
    this.current = d;
  }).data(data).attr('id', function (d) {
    return id + '-' + d.index + '-top';
  }).style('fill', conf.topColor).transition().delay(function (d) {
    return d.parentIndex === 0 ? duration : 0;
  }).duration(function (d) {
    return d.parentIndex === 0 ? duration : duration;
  }).attrTween('d', function (d) {
    var i = (0, _d.interpolate)(this.current, d);
    return function (t) {
      return pieTop(i(t), rx, ry, conf.ir);
    };
  }).on('start', function (d) {
    return drowingStart(d);
  }).on('end', function (d) {
    return drowingEnd(d);
  });

  var walls = (0, _d.select)('#' + id).selectAll('.wallSlice');

  walls.each(function (d) {
    this.current = d;
  }).data(data).attr('id', function (d) {
    return id + '-' + d.index + '-wall';
  }).style('fill', conf.wallsColor).transition().delay(function (d) {
    return d.parentIndex === 0 ? duration : 0;
  }).duration(function (d) {
    return d.parentIndex === 0 ? duration : duration;
  }).attrTween('d', function (d) {
    var i = (0, _d.interpolate)(this.current, d);
    return function (t) {
      return pieWalls(i(t), rx, ry, conf.h, conf.ir);
    };
  }).on('start', function (d) {
    return drowingStart(d);
  }).on('end', function (d) {
    return drowingEnd(d);
  });

  var outers = (0, _d.select)('#' + id).selectAll('.outerSlice');

  outers.each(function (d) {
    this.current = d;
  }).data(data).attr('id', function (d) {
    return id + '-' + d.index + '-outer';
  }).style('fill', conf.wallsColor).transition().delay(function (d) {
    return d.parentIndex === 0 ? duration : 0;
  }).duration(function (d) {
    return d.parentIndex === 0 ? duration : duration;
  }).attrTween('d', function (d) {
    var i = (0, _d.interpolate)(this.current, d);
    return function (t) {
      return pieOuter(i(t), rx, ry, conf.h);
    };
  }).on('start', function (d) {
    return drowingStart(d);
  }).on('end', function (d) {
    return drowingEnd(d);
  });

  var inner = (0, _d.select)('#' + id).selectAll('.innerSlice');

  inner.each(function (d) {
    this.current = d;
  }).data(data).attr('id', function (d) {
    return id + '-' + d.index + '-inner';
  }).style('fill', conf.wallsColor).transition().delay(function (d) {
    return d.parentIndex === 0 ? duration : 0;
  }).duration(function (d) {
    return d.parentIndex === 0 ? duration : duration;
  }).attrTween('d', function (d) {
    var i = (0, _d.interpolate)(this.current, d);
    return function (t) {
      return pieInner(i(t), rx, ry, conf.h, conf.ir);
    };
  }).on('start', function (d) {
    return drowingStart(d);
  }).on('end', function (d) {
    return drowingEnd(d);
  });

  (0, _d.select)('#' + id).selectAll('.tooltip').data(data).attr('id', function (d) {
    return id + '-' + d.index + '-tooltip';
  }).style('font-size', conf.fontSize).style('fill', conf.tooltipColor).text(function (d) {
    return conf.tooltip ? conf.tooltip(d) : null;
  }).attr('x', function (d) {
    return (rx + rx * conf.ir) / 2 * Math.cos(midAngle(d));
  }).attr('y', function (d) {
    return (ry + ry * conf.ir) / 2 * Math.sin(midAngle(d));
  }).on('click', function (d) {
    return conf.animatedSlices ? onClick(id, d, rx, ry, conf.onSliceSelect) : null;
  }).on('mouseover', function (d) {
    (0, _d.select)('#' + id + '-' + d.index + '-tooltip').style('opacity', conf.tooltip ? 1 : 0);
  }).on('mouseout', function (d) {
    (0, _d.select)('#' + id + '-' + d.index + '-tooltip').style('opacity', 0.0);
  });

  var lines = (0, _d.select)('#' + id).selectAll('.label-path');

  lines.each(function (d) {
    this.current = d;
  }).data(data[data.length - 1].oldEndAngle ? data.slice(0, data.length - 2) : data).attr('id', function (d) {
    return id + '-' + d.index + '-path';
  }).style('stroke', conf.linesColor).style('opacity', conf.label ? 1 : 0).transition().duration(duration).attrTween('d', function (d) {
    var i = (0, _d.interpolate)(this.current, d);
    return function (t) {
      return labelPath(i(t), rx, ry, conf.h);
    };
  });

  (0, _d.select)('#' + id).selectAll('.label').each(function (d) {
    this.current = d;
  }).data(data[data.length - 1].oldEndAngle ? data.slice(0, data.length - 2) : data).attr('id', function (d) {
    return id + '-' + d.index + '-text';
  }).style('font-size', conf.fontSize).style('fill', conf.labelColor).text(conf.label ? conf.label : '').transition().duration(duration).attrTween('transform', function (d) {
    var i = (0, _d.interpolate)(this.current, d);
    return function (t) {
      i(t).endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
      var labelPathLength = 1 + conf.h / rx / 2;
      return 'translate(' + (rx + 16) * (midAngle(i(t)) > 3 / 2 * Math.PI || midAngle(i(t)) < Math.PI / 2 ? 1 : -1) + ', \n                  ' + (ry * Math.sin(midAngle(i(t))) * labelPathLength + i(t).data.labelMargin + 3) + ')';
    };
  }).styleTween('text-anchor', function (d) {
    var i = (0, _d.interpolate)(this.current, d);
    return function (t) {
      i(t).endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
      return midAngle(i(t)) > 3 / 2 * Math.PI || midAngle(i(t)) < Math.PI / 2 ? 'start' : 'end';
    };
  });
};

piechart3D.draw = function (chartId, _data, userConfig) {
  var conf = prepareConfig(userConfig);

  (0, _d.select)('#' + chartId).append('svg').style('width', '100%').style('height', '100%').append('g').attr('id', chartId + '-svg');

  var height = (0, _d.select)('#' + chartId).node().getBoundingClientRect().height;
  var width = (0, _d.select)('#' + chartId).node().getBoundingClientRect().width;

  var rx = width / 4 * conf.size / 100;
  var ry = rx * conf.angle / 90;
  var duration = conf.animationDuration;

  var id = chartId + '-svg';

  var data = checkData(_data);

  data = checkDataColors(data);
  data = prepearData(data, conf.fontSize, height);

  var slices = (0, _d.select)('#' + id).append('g').attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')').style('cursor', 'pointer').attr('class', 'slices');

  slices.selectAll('.slices').data(data).enter().append('g').attr('class', 'slice').attr('id', function (d) {
    return id + '-slice-' + d.index;
  }).on('click', function (d) {
    return conf.animatedSlices ? onClick(id, d, rx, ry, conf.onSliceSelect) : null;
  }).on('mouseover', function (d) {
    (0, _d.select)('#' + id + '-' + d.index + '-tooltip').style('opacity', 1);
  }).on('mouseout', function (d) {
    (0, _d.select)('#' + id + '-' + d.index + '-tooltip').style('opacity', 0.0);
  });

  function drowingStart(d) {
    (0, _d.select)('#' + id + '-slice-' + d.index).on('click', null);
  }

  function drowingEnd(d) {
    (0, _d.select)('#' + id + '-slice-' + d.index).on('click', function (d2) {
      return conf.animatedSlices ? onClick(id, d2, rx, ry, conf.onSliceSelect) : null;
    });
  }

  data.map(function (s) {
    slices.select('#' + id + '-slice-' + s.index).append('path').attr('class', 'wallSlice').attr('id', function () {
      return id + '-' + s.index + '-wall';
    }).style('fill', conf.wallsColor).transition().delay(function () {
      return s.parentIndex === 0 ? duration : 0;
    }).duration(function () {
      return s.parentIndex === 0 ? duration : duration;
    }).attrTween('d', function () {
      var s2 = {};
      Object.assign(s2, s);
      return function (t) {
        s2.endAngle = s.startAngle + (s.endAngle - s.startAngle) * t;
        return pieWalls(s2, rx, ry, conf.h, conf.ir);
      };
    }).on('start', function (d) {
      return drowingStart(d);
    }).on('end', function (d) {
      return drowingEnd(d);
    });

    slices.select('#' + id + '-slice-' + s.index).append('path').attr('class', 'innerSlice').attr('id', function () {
      return id + '-' + s.index + '-inner';
    }).style('fill', conf.wallsColor).attr('d', function () {
      return pieInner(s, rx, ry, conf.h, conf.ir);
    }).transition().delay(function (d) {
      return d.parentIndex === 0 ? duration : 0;
    }).duration(function (d) {
      return d.parentIndex === 0 ? duration : duration;
    }).attrTween('d', function () {
      var s2 = {};
      Object.assign(s2, s);
      return function (t) {
        s2.endAngle = s.startAngle + (s.endAngle - s.startAngle) * t;
        return pieInner(s2, rx, ry, conf.h, conf.ir);
      };
    }).on('start', function (d) {
      return drowingStart(d);
    }).on('end', function (d) {
      return drowingEnd(d);
    });

    slices.select('#' + id + '-slice-' + s.index).append('path').attr('class', 'outerSlice').attr('id', function () {
      return id + '-' + s.index + '-outer';
    }).style('fill', conf.wallsColor).transition().delay(function (d) {
      return d.parentIndex === 0 ? duration : 0;
    }).duration(function (d) {
      return d.parentIndex === 0 ? duration : duration;
    }).attrTween('d', function () {
      var s2 = {};
      Object.assign(s2, s);
      return function (t) {
        s2.endAngle = s.startAngle + (s.endAngle - s.startAngle) * t;
        return pieOuter(s2, rx, ry, conf.h);
      };
    }).on('start', function (d) {
      return drowingStart(d);
    }).on('end', function (d) {
      return drowingEnd(d);
    });

    slices.select('#' + id + '-slice-' + s.index).append('path').attr('class', 'topSlice').attr('id', function () {
      return id + '-' + s.index + '-top';
    }).style('fill', conf.topColor).transition().delay(function (d) {
      return d.parentIndex === 0 ? duration : 0;
    }).duration(function (d) {
      return d.parentIndex === 0 ? duration : duration;
    }).attrTween('d', function () {
      var s2 = {};
      Object.assign(s2, s);
      return function (t) {
        s2.endAngle = s.startAngle + (s.endAngle - s.startAngle) * t;
        return pieTop(s2, rx, ry, conf.ir);
      };
    }).on('start', function (d) {
      return drowingStart(d);
    }).on('end', function (d) {
      return drowingEnd(d);
    });

    return null;
  });

  slices.exit().remove();

  if (conf.tooltip) {
    var tooltips = (0, _d.select)('#' + id).append('g').attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')').attr('class', 'tooltips');

    tooltips.selectAll('.tooltips').data(data).enter().append('text').attr('class', 'tooltip').attr('id', function (d) {
      return id + '-' + d.index + '-tooltip';
    }).style('opacity', 0).style('font-size', conf.fontSize).style('fill', conf.tooltipColor).style('font-weight', 'bold').style('cursor', 'pointer').text(function (d) {
      return conf.tooltip(d);
    }).attr('text-anchor', 'middle').attr('x', function (d) {
      return (rx + rx * conf.ir) / 2 * Math.cos(midAngle(d));
    }).attr('y', function (d) {
      return (ry + ry * conf.ir) / 2 * Math.sin(midAngle(d));
    }).on('click', function (d) {
      return conf.animatedSlices ? onClick(id, d, rx, ry, conf.onSliceSelect) : null;
    }).on('mouseover', function (d) {
      (0, _d.select)('#' + id + '-' + d.index + '-tooltip').style('opacity', 1);
    }).on('mouseout', function (d) {
      (0, _d.select)('#' + id + '-' + d.index + '-tooltip').style('opacity', 0.0);
    });

    tooltips.exit().remove();
  }

  if (conf.label) {
    var lines = (0, _d.select)('#' + id).append('g').attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')').attr('class', 'lines');

    lines.selectAll('.lines').data(data[data.length - 1].oldEndAngle ? data.slice(0, data.length - 2) : data).enter().append('path').attr('class', 'label-path').attr('id', function (d) {
      return id + '-' + d.index + '-path';
    }).style('stroke', conf.linesColor).transition().duration(duration).attrTween('d', function (d) {
      var d2 = {};
      Object.assign(d2, d);
      return function (t) {
        d2.endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
        return labelPath(d2, rx, ry, conf.h);
      };
    });

    lines.exit().remove();

    var labels = (0, _d.select)('#' + id).append('g').attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')').attr('class', 'labels');

    labels.selectAll('.labels').data(data[data.length - 1].oldEndAngle ? data.slice(0, data.length - 2) : data).enter().append('text').attr('class', 'label').attr('id', function (d) {
      return id + '-' + d.index + '-text';
    }).style('font-size', conf.fontSize).style('fill', conf.labelColor).text(conf.label).transition().duration(duration).attrTween('transform', function (d) {
      var d2 = {};
      Object.assign(d2, d);
      return function (t) {
        d2.endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
        var labelPathLength = 1 + conf.h / rx / 2;
        return 'translate(' + (rx + 16) * (midAngle(d2) > 3 / 2 * Math.PI || midAngle(d2) < Math.PI / 2 ? 1 : -1) + ', \n                    ' + (ry * Math.sin(midAngle(d2)) * labelPathLength + d2.data.labelMargin + 3) + ')';
      };
    }).styleTween('text-anchor', function (d) {
      var d2 = {};
      Object.assign(d2, d);
      return function (t) {
        d2.endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
        return midAngle(d2) > 3 / 2 * Math.PI || midAngle(d2) < Math.PI / 2 ? 'start' : 'end';
      };
    });

    labels.exit().remove();
  }
};

module.exports = piechart3D;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=animated-3d-piechart.js.map