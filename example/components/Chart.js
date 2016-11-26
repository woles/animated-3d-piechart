import React from 'react';

import piechart3D from '../../src';

function generateId() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let id = '';
  for (let i = 2; i >= 0; i -= 1) {
    id += (alphabet[(Math.random() * alphabet.length).toFixed(0)]);
  }
  return id;
}

class Chart extends React.Component {

  static propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    config: React.PropTypes.object
  };


  constructor(props) {
    super(props);
    this.chartId = generateId();
  }

  componentDidMount() {
    piechart3D.draw(this.chartId, this.props.data, this.props.config);
  }

  componentDidUpdate() {
    piechart3D.update(this.chartId, this.props.data, this.props.config);
  }

  render() {
    return (
      <figure id={this.chartId} style={{ height: '100%', width: '100%' }}/>
    );
  }
}

module.exports = Chart;
