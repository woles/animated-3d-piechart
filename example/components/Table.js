import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NumericInput from 'react-numeric-input';

import ColorPicker from '../components/ColorPicker';

import * as actionCreators from '../actions/data';

class Table extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    actions: React.PropTypes.shape({
      addRow: React.PropTypes.func.isRequired,
      deleteRow: React.PropTypes.func.isRequired,
      changeColor: React.PropTypes.func.isRequired,
      changeLabel: React.PropTypes.func.isRequired,
      changeValue: React.PropTypes.func.isRequired
    }).isRequired
  };

  changeLabel = (id, event) => {
    this.props.actions.changeLabel(id, event.target.value);
  }

  changeValue = (id, value) => {
    this.props.actions.changeValue(id, value);
  }

  changeColor = (id, value) => {
    this.props.actions.changeColor(id, value);
  }

  render() {
    return (
      <tbody>
        {this.props.data.map(d => {
          return (
            <tr key={this.props.data.indexOf(d)}>
              <th className="table-index">{this.props.data.indexOf(d)}</th>
              <th>
                <input type="text" value={d.label} onChange={this.changeLabel.bind(this, this.props.data.indexOf(d))}/>
              </th>
              <th>
                <NumericInput value={Number(d.value).toFixed(2)}
                              min={0}
                              onChange={this.changeValue.bind(this, this.props.data.indexOf(d))}
                />
              </th>
              <th style={{ }}>
                <ColorPicker style={{ float: 'left' }} color={d.color} onChange={this.changeColor.bind(this, this.props.data.indexOf(d))}/>
              </th>
              <th>
                {d.color}
              </th>
            </tr>
          );
        })}
        <tr>
          <th>
          </th>
          <th>
            <button onClick={this.props.actions.addRow}>Add row</button>
          </th>
          <th>
            <button onClick={this.props.actions.deleteRow}>Delete row</button>
          </th>
        </tr>
      </tbody>
    );
  }
}

function mapStateToProps() {
  return {};
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
)(Table);

