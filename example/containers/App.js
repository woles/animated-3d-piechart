import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NumericInput from 'react-numeric-input';

import * as actionCreators from '../actions/chart';

import Chart from '../components/Chart';
import Table from '../components/Table';

class App extends React.Component {
  static propTypes = {
    config: React.PropTypes.object,
    data: React.PropTypes.array.isRequired,
    actions: React.PropTypes.shape({
      changeChartSize: React.PropTypes.func.isRequired,
      changeHeight: React.PropTypes.func.isRequired,
      changeRadius: React.PropTypes.func.isRequired,
      changeAngle: React.PropTypes.func.isRequired,
      changeDuration: React.PropTypes.func.isRequired,
      changeFontSize: React.PropTypes.func.isRequired,
      toggleAnimation: React.PropTypes.func.isRequired,
      toggleSliceSelect: React.PropTypes.func.isRequired,
      toggleLabel: React.PropTypes.func.isRequired,
      toggleLabelColor: React.PropTypes.func.isRequired,
      toggleTooltip: React.PropTypes.func.isRequired,
    }).isRequired
  };

  state = {
    color: 'red'
  }

  changeColor = color => {
    this.setState({ color: color });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" tabIndex="0">
                3d-pie
              </a>
            </div>
          </div>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div style={{ height: 450 }}>
                <Chart data={this.props.data} config={this.props.config}/>
              </div>
            </div>
            <div className="col-lg-3">
              <h2>Config:</h2>
              <div className="form-row">
                <label>Height:</label>
                <span style={{ float: 'right', marginRight: 50 }}>
                  <NumericInput min={0}
                              max={200}
                              value={this.props.config.h}
                              onChange={this.props.actions.changeHeight}
                  />px
                </span>
              </div>
              <div className="form-row">
                <label>Inner radius:</label>
                <span style={{ float: 'right', marginRight: 50 }}>
                  <NumericInput min={0}
                                max={100}
                                value={this.props.config.ir}
                                onChange={this.props.actions.changeRadius}
                  />%
                </span>
              </div>
              <div className="form-row">
                <label>Angle:</label>
                <span style={{ float: 'right', marginRight: 50 }}>
                  <NumericInput min={0}
                                max={90}
                                value={this.props.config.angle}
                                onChange={this.props.actions.changeAngle}
                  />deg
                </span>
              </div>
              <div className="form-row">
                <label>Duration:</label>
                <span style={{ float: 'right', marginRight: 50 }}>
                  <NumericInput min={0}
                                max={5000}
                                value={this.props.config.animationDuration}
                                onChange={this.props.actions.changeDuration}
                  />ms
                </span>
              </div>
              <div className="form-row">
                <label>Font size:</label>
                <span style={{ float: 'right', marginRight: 50 }}>
                  <NumericInput min={0}
                                max={50}
                                value={this.props.config.fontSize}
                                onChange={this.props.actions.changeFontSize}
                  />px
                </span>
              </div>
              <div className="form-row">
                <label>Chart size:</label>
                <span style={{float: 'right', marginRight: 50}}>
                  <NumericInput min={0}
                                max={100}
                                value={this.props.config.size}
                                onChange={this.props.actions.changeChartSize}
                  />%
                </span>
              </div>
              <div className="form-row">
                <label>Animated slices:</label>
                <input type="checkbox"
                       checked={this.props.config.animatedSlices}
                       onChange={this.props.actions.toggleAnimation}
                       style={{ float: 'right', marginRight: 50 }}
                />
              </div>
              <div className="form-row">
                <label>Slice select function(console.log()):</label>
                <input type="checkbox"
                       checked={this.props.config.onSliceSelect}
                       onChange={this.props.actions.toggleSliceSelect}
                       style={{ float: 'right', marginRight: 50 }}
                />
              </div>
              <div className="form-row">
                <label>Label function(return %):</label>
                <input type="checkbox"
                       checked={this.props.config.label}
                       onChange={this.props.actions.toggleLabel}
                       style={{ float: 'right', marginRight: 50 }}
                />
              </div>
              <div className="form-row">
                <label>Label color(value &lt; 20 ? red : black):</label>
                <input type="checkbox"
                       checked={this.props.config.labelColor !== 'black'}
                       onChange={this.props.actions.toggleLabelColor}
                       style={{ float: 'right', marginRight: 50 }}
                />
              </div>
              <div className="form-row">
                <label>Tooltip(value.toFixed(2)):</label>
                <input type="checkbox"
                       checked={this.props.config.tooltip}
                       onChange={this.props.actions.toggleTooltip}
                       style={{ float: 'right', marginRight: 50 }}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <h2>Data:</h2>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="table-index">#</th>
                    <th>Label</th>
                    <th>Value</th>
                    <th>Color</th>
                  </tr>
                </thead>
                <Table data={this.props.data}/>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {};


function mapStateToProps(state) {
  return {
    config: state.chart,
    data: state.data
  };
}


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    actions: bindActionCreators(actionCreators, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export { App as AppNotConnected };
