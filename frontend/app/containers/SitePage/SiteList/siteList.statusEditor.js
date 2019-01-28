import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { statusOptions } from '../../Common/Options';

class SiteListStatusEditor extends Component {
  constructor(props) {
    super(props);

    const { value } = this.props;
    this.state = {
      status: value,
    };
  }

  getValue = () => this.state.status;

  getOptionText = (statusValue) => {
    const index = statusOptions.findIndex((status) => status.value === statusValue);
    return statusOptions[index] ? statusOptions[index].text : '';
  }

  isPopup = () => true;

  handleChange = (status) => () => {
    this.setState({ status }, () => { this.props.api.stopEditing(); });
  }

  render() {
    const { status } = this.state;
    const listLength = statusOptions.length;
    const itemHeight = 40;
    const listHeight = listLength * 40;

    return (
      <div className="ag-rich-select">
        <div className="ag-rich-select-value">{this.getOptionText(status)}</div>
        <div className="ag-rich-select-list">
          <div className="ag-virtual-list-viewport">
            <div className="ag-virtual-list-container" style={{ height: `${listHeight}px` }}>
              {
                statusOptions.map(({ text, value }, index) => (
                  <div key={value} className="ag-virtual-list-item" style={{ top: `${index * itemHeight}px` }}>
                    <div className="ag-rich-select-row" role="presentation" onClick={this.handleChange(value)}>{text}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SiteListStatusEditor.propTypes = {
  value: PropTypes.string,
  api: PropTypes.any,
};

export default SiteListStatusEditor;
