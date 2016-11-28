import { pie, select, hsl, interpolate } from 'd3';

const piechart3D = {};

const colors = ['limegreen', 'mediumvioletred', 'mediumpurple', 'orange',
  'firebrick', 'chartreuse', 'dodgerblue', 'tomato'];

function prepearData(_data, fontSize, height) {
  let data = pie().value(d => d.value)(_data);
  let newSlice = null;

  data = data.map(d => {
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

  const pi1 = data.map(d => d.endAngle <= Math.PI / 2 ? d : null)
                  .filter(d => d !== null).sort((a, b) => (b.value - a.value));
  const pi2 = data.map(d => d.endAngle > Math.PI / 2 && d.endAngle <= Math.PI ? d : null)
                  .filter(d => d !== null).sort((a, b) => (a.value - b.value));
  const pi3 = data.map(d => d.endAngle > Math.PI && d.endAngle <= 3 * Math.PI / 2 ? d : null)
                  .filter(d => d !== null).sort((a, b) => (a.value - b.value));
  const pi4 = data.map(d => d.endAngle > 3 * Math.PI / 2 ? d : null)
                  .filter(d => d !== null).sort((a, b) => (b.value - a.value));

  data = [].concat(pi4).concat(pi1).concat(pi3).concat(pi2);

  data = data.map(d => {
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
  return data.map(d => {
    if (!d.color) {
      d.color = colors[data.indexOf(d) % colors.length];
    }
    return d;
  });
}

function checkData(data) {
  return data.map(d => typeof d === 'object' ? Object.assign({}, d) : { value: Number(d) });
}

function midAngle(d) {
  return d.oldEndAngle ? d.oldSartAngle + (d.oldEndAngle - d.oldSartAngle) / 2 :
    d.startAngle + (d.endAngle - d.startAngle) / 2;
}

function pieTop(d, rx, ry, ir) {
  if (d.endAngle - d.startAngle === 0) {
    return 'M 0 0';
  }

  const sx = rx * Math.cos(d.startAngle);
  const sy = ry * Math.sin(d.startAngle);
  const ex = rx * Math.cos(d.endAngle);
  const ey = ry * Math.sin(d.endAngle);
  const ret = [];

  ret.push('M', sx, sy, 'A', rx, ry, '0', (d.endAngle - d.startAngle > Math.PI ? 1 : 0));
  ret.push('1', ex, ey, 'L', ir * ex, ir * ey);
  ret.push('A', ir * rx, ir * ry, '0', (d.endAngle - d.startAngle > Math.PI ? 1 : 0),
    '0', ir * sx, ir * sy, 'z');
  return ret.join(' ');
}

function pieInner(d, rx, ry, h, ir) {
  const startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
  const endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);
  const sx = ir * rx * Math.cos(startAngle);
  const sy = ir * ry * Math.sin(startAngle);
  const ex = ir * rx * Math.cos(endAngle);
  const ey = ir * ry * Math.sin(endAngle);
  const ret = [];

  ret.push('M', sx, sy, 'A', ir * rx, ir * ry, '0 0 1', ex, ey);
  ret.push('L', ex, h + ey, 'A', ir * rx, ir * ry, '0 0 0', sx, h + sy, 'z');
  return ret.join(' ');
}

function pieOuter(d, rx, ry, h) {
  const startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
  const endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);
  const sx = rx * Math.cos(startAngle);
  const sy = ry * Math.sin(startAngle);
  const ex = rx * Math.cos(endAngle);
  const ey = ry * Math.sin(endAngle);
  const ret = [];

  ret.push('M', sx, h + sy, 'A', rx, ry, '0 0 1', ex, h + ey, 'L', ex, ey);
  ret.push('A', rx, ry, '0 0 0', sx, sy, 'z');
  return ret.join(' ');
}

function pieWalls(d, rx, ry, h, ir) {
  const sx = rx * Math.cos(d.startAngle);
  const sy = ry * Math.sin(d.startAngle);
  const ex = rx * Math.cos(d.endAngle);
  const ey = ry * Math.sin(d.endAngle);
  const ret = [];

  ret.push('M', ir * ex, ir * ey, 'L', ir * ex, ir * ey + h, 'L', ex, ey + h, 'L', ex, ey, 'z');
  ret.push('M', ir * sx, ir * sy, 'L', ir * sx, ir * sy + h, 'L', sx, sy + h, 'L', sx, sy, 'z');
  return ret.join(' ');
}

function labelPath(d, rx, ry, h) {
  const x1 = rx * Math.cos(midAngle(d));
  const y1 = ry * Math.sin(midAngle(d));
  const labelPathLength = 1 + h / rx / 2;
  const path = [];

  path.push('M', x1, y1, 'L', x1 * labelPathLength, y1 * labelPathLength);
  path.push('L', (rx + 14) * (midAngle(d) > 3 / 2 * Math.PI || midAngle(d) < Math.PI / 2 ? 1 : -1),
            y1 * labelPathLength + d.data.labelMargin);
  path.push('L', x1 * labelPathLength, y1 * labelPathLength, 'z');

  return path.join(' ');
}

function onClick(id, d, rx, ry, onSliceSelect) {
  function move() {
    const angle = midAngle(d);
    const ex = 0.2 * rx * Math.cos(angle > Math.PI ? angle : -angle);
    const ey = 0.2 * ry * Math.sin(angle);

    if (!d.data.moved) {
      return [ex, ey];
    }
    return [0, 0];
  }

  const pos = move();
  const slice = select(`#${id}-slice-${d.index}`);
  let slice2 = null;
  const onClickSlice = slice.on('click');

  if (d.parentIndex === 0) {
    slice2 = select(`#${id}-slice-${d.parentIndex}`);
    slice2.transition()
      .duration(1000)
      .attr('transform', `translate(${pos})`)
      .on('start', () => slice.on('click', null))
      .on('end', () => slice.on('click', onClickSlice));
  }

  if (d.childIndex) {
    slice2 = select(`#${id}-slice-${d.childIndex}`);
    slice2.transition()
      .duration(1000)
      .attr('transform', `translate(${pos})`)
      .on('start', () => slice.on('click', null))
      .on('end', () => slice.on('click', onClickSlice));
  }

  slice.transition()
      .duration(1000)
      .attr('transform', `translate(${pos})`)
      .on('start', () => slice.on('click', null))
      .on('end', () => slice.on('click', onClickSlice));

  const tooltip = select(`#${id}-${d.childIndex ? d.childIndex : d.index}-tooltip`);

  tooltip.transition()
      .duration(1000)
      .attr('transform', `translate(${pos})`)
      .on('start', () => tooltip.on('click', null))
      .on('end', () => tooltip.on('click', onClickSlice));

  const t = select(`#${id}-${d.childIndex ? d.childIndex : d.index}-text`);
  t.transition()
    .duration(1000)
    .attr('transform', d2 => {
      if (!d.data.moved) {
        d2.data.labelPosition = {
          x: t.node().transform.baseVal[0].matrix.e,
          y: t.node().transform.baseVal[0].matrix.f,
        };
        return `translate(${[d2.data.labelPosition.x + pos[0], d2.data.labelPosition.y + pos[1]]})`;
      }

      return `translate(${[d2.data.labelPosition.x, d2.data.labelPosition.y]})`;
    });

  const path = select(`#${id}-${d.childIndex ? d.childIndex : d.index}-path`);
  path.transition()
    .duration(1000)
    .attr('transform', `translate(${pos})`);

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
  let conf = {
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
    label: d =>
      `${d.data.label ? d.data.label : ''}(${Math.round((d.endAngle - d.startAngle) /
        (2 * Math.PI) * 100)}%)`,
    tooltip: d => `${Number(d.value).toFixed(2)}`,
    topColor: d => hsl(d.data.color),
    wallsColor: d => hsl(d.data.color).darker(0.7)
  };

  conf = userConfig && typeof userConfig === 'object' ? Object.assign(conf, userConfig) : conf;

  conf.h = conf.h >= 0 ? conf.h : 0;
  conf.angle = conf.angle > 90 ? 90 : conf.angle;
  conf.angle = conf.angle < 0 ? 0 : conf.angle;
  conf.h *= (90 - conf.angle) / 90;

  conf.ir /= 100;
  conf.ir = conf.ir < 0 || conf.ir > 1 ? 0 : conf.ir;
  return conf;
}

piechart3D.update = (chartId, _data, userConfig) => {
  const conf = prepareConfig(userConfig);

  const height = select(`#${chartId}`).node().getBoundingClientRect().height;
  const width = select(`#${chartId}`).node().getBoundingClientRect().width;

  const rx = width / 4 * conf.size / 100;
  const ry = rx * conf.angle / 90;
  const duration = conf.animationDuration;

  const id = `${chartId}-svg`;

  let data = checkData(_data);

  data = checkDataColors(data);
  data = prepearData(data, conf.fontSize, height);

  function drowingStart(d) {
    select(`#${id}-slice-${d.index}`).on('click', null);
  }

  function drowingEnd(d) {
    select(`#${id}-slice-${d.index}`).on('click', d2 => conf.animatedSlices ?
      onClick(id, d2, rx, ry, conf.onSliceSelect) : null);
  }

  const slices = select(`#${id}`).selectAll('.slice');

  slices.each(d => {
    if (d.data.moved) {
      onClick(id, d, rx, ry);
      d.data.moved = false;
    }

    return null;
  });

  const slicesCount = slices._groups[0].length;

  if (slicesCount > data.length) {
    for (let i = slicesCount - data.length - 1; i >= 0; i -= 1) {
      select(`#${id}-slice-${i}`).remove();
      select(`#${id}-${i}-text`).remove();
      select(`#${id}-${i}-path`).remove();
    }
  } else if (slicesCount < data.length) {
    for (let i = data.length - slicesCount - 1; i >= 0; i -= 1) {
      const slice = select(`#${id}`).select('.slices')
                       .append('g')
                       .attr('class', 'slice')
                       .attr('id', `#${id}-slice-${data.length - i}`);

      slice.append('path').attr('class', 'wallSlice');
      slice.append('path').attr('class', 'outerSlice');
      slice.append('path').attr('class', 'innerSlice');
      slice.append('path').attr('class', 'topSlice');

      select(`#${id}`).select('.lines')
                     .append('path')
                     .attr('class', 'label-path');

      select(`#${id}`).select('.labels')
                     .append('text')
                     .attr('class', 'label');

      select(`#${id}`).select('.tooltips')
                     .append('text')
                     .attr('class', 'tooltip');
    }
  }

  slices.data(data)
        .attr('id', d => `${id}-slice-${d.index}`)
        .on('click', d => conf.animatedSlices ? onClick(id, d, rx, ry, conf.onSliceSelect) : null)
        .on('mouseover', d => {
          select(`#${id}-${d.index}-tooltip`).style('opacity', 1);
        })
        .on('mouseout', d => {
          select(`#${id}-${d.index}-tooltip`).style('opacity', 0.0);
        });

  const topSlices = select(`#${id}`).selectAll('.topSlice');

  topSlices.each(function (d) { this.current = d; })
          .data(data)
          .attr('id', d => `${id}-${d.index}-top`)
          .style('fill', conf.topColor)
          .transition()
          .delay(d => d.parentIndex === 0 ? duration : 0)
          .duration(d => d.parentIndex === 0 ? duration : duration)
          .attrTween('d', function (d) {
            const i = interpolate(this.current, d);
            return t => pieTop(i(t), rx, ry, conf.ir);
          })
          .on('start', d => drowingStart(d))
          .on('end', d => drowingEnd(d));

  const walls = select(`#${id}`).selectAll('.wallSlice');

  walls.each(function (d) { this.current = d; })
          .data(data)
          .attr('id', d => `${id}-${d.index}-wall`)
          .style('fill', conf.wallsColor)
          .transition()
          .delay(d => d.parentIndex === 0 ? duration : 0)
          .duration(d => d.parentIndex === 0 ? duration : duration)
          .attrTween('d', function (d) {
            const i = interpolate(this.current, d);
            return t => pieWalls(i(t), rx, ry, conf.h, conf.ir);
          })
          .on('start', d => drowingStart(d))
          .on('end', d => drowingEnd(d));

  const outers = select(`#${id}`).selectAll('.outerSlice');

  outers.each(function (d) { this.current = d; })
          .data(data)
          .attr('id', d => `${id}-${d.index}-outer`)
          .style('fill', conf.wallsColor)
          .transition()
          .delay(d => d.parentIndex === 0 ? duration : 0)
          .duration(d => d.parentIndex === 0 ? duration : duration)
          .attrTween('d', function (d) {
            const i = interpolate(this.current, d);
            return t => pieOuter(i(t), rx, ry, conf.h);
          })
          .on('start', d => drowingStart(d))
          .on('end', d => drowingEnd(d));

  const inner = select(`#${id}`).selectAll('.innerSlice');

  inner.each(function (d) { this.current = d; })
          .data(data)
          .attr('id', d => `${id}-${d.index}-inner`)
          .style('fill', conf.wallsColor)
          .transition()
          .delay(d => d.parentIndex === 0 ? duration : 0)
          .duration(d => d.parentIndex === 0 ? duration : duration)
          .attrTween('d', function (d) {
            const i = interpolate(this.current, d);
            return t => pieInner(i(t), rx, ry, conf.h, conf.ir);
          })
          .on('start', d => drowingStart(d))
          .on('end', d => drowingEnd(d));

  select(`#${id}`).selectAll('.tooltip')
          .data(data)
          .attr('id', d => `${id}-${d.index}-tooltip`)
          .style('font-size', conf.fontSize)
          .style('fill', conf.tooltipColor)
          .text(d => conf.tooltip ? conf.tooltip(d) : null)
          .attr('x', d => (rx + rx * conf.ir) / 2 * Math.cos(midAngle(d)))
          .attr('y', d => (ry + ry * conf.ir) / 2 * Math.sin(midAngle(d)))
          .on('click', d => conf.animatedSlices ?
            onClick(id, d, rx, ry, conf.onSliceSelect) : null)
          .on('mouseover', d => {
            select(`#${id}-${d.index}-tooltip`).style('opacity', conf.tooltip ? 1 : 0);
          })
          .on('mouseout', d => {
            select(`#${id}-${d.index}-tooltip`).style('opacity', 0.0);
          });

  const lines = select(`#${id}`).selectAll('.label-path');

  lines.each(function (d) { this.current = d; })
        .data(data[data.length - 1].oldEndAngle ? data.slice(0, data.length - 2) : data)
        .attr('id', d => `${id}-${d.index}-path`)
        .style('stroke', conf.linesColor)
        .style('opacity', conf.label ? 1 : 0)
        .transition()
        .duration(duration)
        .attrTween('d', function (d) {
          const i = interpolate(this.current, d);
          return t => labelPath(i(t), rx, ry, conf.h);
        });

  select(`#${id}`).selectAll('.label')
        .each(function (d) { this.current = d; })
        .data(data[data.length - 1].oldEndAngle ? data.slice(0, data.length - 2) : data)
        .attr('id', d => `${id}-${d.index}-text`)
        .style('font-size', conf.fontSize)
        .style('fill', conf.labelColor)
        .text(conf.label ? conf.label : '')
        .transition()
        .duration(duration)
        .attrTween('transform', function (d) {
          const i = interpolate(this.current, d);
          return t => {
            i(t).endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
            const labelPathLength = 1 + conf.h / rx / 2;
            return `translate(${(rx + 16) * (midAngle(i(t)) >
                  3 / 2 * Math.PI || midAngle(i(t)) < Math.PI / 2 ? 1 : -1)}, 
                  ${ry * Math.sin(midAngle(i(t))) * labelPathLength + i(t).data.labelMargin + 3})`;
          };
        })
        .styleTween('text-anchor', function (d) {
          const i = interpolate(this.current, d);
          return t => {
            i(t).endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
            return midAngle(i(t)) > 3 / 2 * Math.PI || midAngle(i(t)) < Math.PI / 2 ? 'start' : 'end';
          };
        });
};

piechart3D.draw = (chartId, _data, userConfig) => {
  const conf = prepareConfig(userConfig);

  select(`#${chartId}`).append('svg')
                .style('width', '100%')
                .style('height', '100%')
                .append('g')
                .attr('id', `${chartId}-svg`);

  const height = select(`#${chartId}`).node().getBoundingClientRect().height;
  const width = select(`#${chartId}`).node().getBoundingClientRect().width;

  const rx = width / 4 * conf.size / 100;
  const ry = rx * conf.angle / 90;
  const duration = conf.animationDuration;

  const id = `${chartId}-svg`;

  let data = checkData(_data);

  data = checkDataColors(data);
  data = prepearData(data, conf.fontSize, height);

  const slices = select(`#${id}`)
                  .append('g')
                  .attr('transform', `translate(${width / 2}, ${height / 2})`)
                  .style('cursor', 'pointer')
                  .attr('class', 'slices');

  slices.selectAll('.slices')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'slice')
        .attr('id', d => `${id}-slice-${d.index}`)
        .on('click', d => conf.animatedSlices ? onClick(id, d, rx, ry, conf.onSliceSelect) : null)
        .on('mouseover', d => {
          select(`#${id}-${d.index}-tooltip`).style('opacity', 1);
        })
        .on('mouseout', d => {
          select(`#${id}-${d.index}-tooltip`).style('opacity', 0.0);
        });

  function drowingStart(d) {
    select(`#${id}-slice-${d.index}`).on('click', null);
  }

  function drowingEnd(d) {
    select(`#${id}-slice-${d.index}`).on('click', d2 => conf.animatedSlices ?
      onClick(id, d2, rx, ry, conf.onSliceSelect) : null);
  }

  data.map(s => {
    slices.select(`#${id}-slice-${s.index}`)
          .append('path')
          .attr('class', 'wallSlice')
          .attr('id', () => `${id}-${s.index}-wall`)
          .style('fill', conf.wallsColor)
          .transition()
          .delay(() => s.parentIndex === 0 ? duration : 0)
          .duration(() => s.parentIndex === 0 ? duration : duration)
          .attrTween('d', () => {
            const s2 = {};
            Object.assign(s2, s);
            return t => {
              s2.endAngle = s.startAngle + (s.endAngle - s.startAngle) * t;
              return pieWalls(s2, rx, ry, conf.h, conf.ir);
            };
          })
          .on('start', d => drowingStart(d))
          .on('end', d => drowingEnd(d));

    slices.select(`#${id}-slice-${s.index}`)
          .append('path')
          .attr('class', 'innerSlice')
          .attr('id', () => `${id}-${s.index}-inner`)
          .style('fill', conf.wallsColor)
          .attr('d', () => pieInner(s, rx, ry, conf.h, conf.ir))
          .transition()
          .delay(d => d.parentIndex === 0 ? duration : 0)
          .duration(d => d.parentIndex === 0 ? duration : duration)
          .attrTween('d', () => {
            const s2 = {};
            Object.assign(s2, s);
            return t => {
              s2.endAngle = s.startAngle + (s.endAngle - s.startAngle) * t;
              return pieInner(s2, rx, ry, conf.h, conf.ir);
            };
          })
          .on('start', d => drowingStart(d))
          .on('end', d => drowingEnd(d));

    slices.select(`#${id}-slice-${s.index}`)
          .append('path')
          .attr('class', 'outerSlice')
          .attr('id', () => `${id}-${s.index}-outer`)
          .style('fill', conf.wallsColor)
          .transition()
          .delay(d => d.parentIndex === 0 ? duration : 0)
          .duration(d => d.parentIndex === 0 ? duration : duration)
          .attrTween('d', () => {
            const s2 = {};
            Object.assign(s2, s);
            return t => {
              s2.endAngle = s.startAngle + (s.endAngle - s.startAngle) * t;
              return pieOuter(s2, rx, ry, conf.h);
            };
          })
          .on('start', d => drowingStart(d))
          .on('end', d => drowingEnd(d));

    slices.select(`#${id}-slice-${s.index}`)
          .append('path')
          .attr('class', 'topSlice')
          .attr('id', () => `${id}-${s.index}-top`)
          .style('fill', conf.topColor)
          .transition()
          .delay(d => d.parentIndex === 0 ? duration : 0)
          .duration(d => d.parentIndex === 0 ? duration : duration)
          .attrTween('d', () => {
            const s2 = {};
            Object.assign(s2, s);
            return t => {
              s2.endAngle = s.startAngle + (s.endAngle - s.startAngle) * t;
              return pieTop(s2, rx, ry, conf.ir);
            };
          })
          .on('start', d => drowingStart(d))
          .on('end', d => drowingEnd(d));

    return null;
  });

  slices.exit().remove();

  if (conf.tooltip) {
    const tooltips = select(`#${id}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .attr('class', 'tooltips');

    tooltips.selectAll('.tooltips')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'tooltip')
            .attr('id', d => `${id}-${d.index}-tooltip`)
            .style('opacity', 0)
            .style('font-size', conf.fontSize)
            .style('fill', conf.tooltipColor)
            .style('font-weight', 'bold')
            .style('cursor', 'pointer')
            .text(d => conf.tooltip(d))
            .attr('text-anchor', 'middle')
            .attr('x', d => (rx + rx * conf.ir) / 2 * Math.cos(midAngle(d)))
            .attr('y', d => (ry + ry * conf.ir) / 2 * Math.sin(midAngle(d)))
            .on('click', d => conf.animatedSlices ?
              onClick(id, d, rx, ry, conf.onSliceSelect) : null)
            .on('mouseover', d => {
              select(`#${id}-${d.index}-tooltip`).style('opacity', 1);
            })
            .on('mouseout', d => {
              select(`#${id}-${d.index}-tooltip`).style('opacity', 0.0);
            });

    tooltips.exit().remove();
  }

  if (conf.label) {
    const lines = select(`#${id}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .attr('class', 'lines');

    lines.selectAll('.lines')
          .data(data[data.length - 1].oldEndAngle ? data.slice(0, data.length - 2) : data)
          .enter()
          .append('path')
          .attr('class', 'label-path')
          .attr('id', d => `${id}-${d.index}-path`)
          .style('stroke', conf.linesColor)
          .transition()
          .duration(duration)
          .attrTween('d', d => {
            const d2 = {};
            Object.assign(d2, d);
            return t => {
              d2.endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
              return labelPath(d2, rx, ry, conf.h);
            };
          });

    lines.exit().remove();

    const labels = select(`#${id}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .attr('class', 'labels');

    labels.selectAll('.labels')
          .data(data[data.length - 1].oldEndAngle ? data.slice(0, data.length - 2) : data)
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('id', d => `${id}-${d.index}-text`)
          .style('font-size', conf.fontSize)
          .style('fill', conf.labelColor)
          .text(conf.label)
          .transition()
          .duration(duration)
          .attrTween('transform', d => {
            const d2 = {};
            Object.assign(d2, d);
            return t => {
              d2.endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
              const labelPathLength = 1 + conf.h / rx / 2;
              return `translate(${(rx + 16) * (midAngle(d2) >
                    3 / 2 * Math.PI || midAngle(d2) < Math.PI / 2 ? 1 : -1)}, 
                    ${ry * Math.sin(midAngle(d2)) * labelPathLength + d2.data.labelMargin + 3})`;
            };
          })
          .styleTween('text-anchor', d => {
            const d2 = {};
            Object.assign(d2, d);
            return t => {
              d2.endAngle = d.startAngle + (d.endAngle - d.startAngle) * t;
              return midAngle(d2) > 3 / 2 * Math.PI || midAngle(d2) < Math.PI / 2 ? 'start' : 'end';
            };
          });

    labels.exit().remove();
  }
};

module.exports = piechart3D;
