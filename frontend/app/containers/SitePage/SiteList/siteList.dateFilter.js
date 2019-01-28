import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import RabineSingleDatePicker from '../../../components/Date/SingleDatePicker';

class SiteListDateFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
    };

    this.valueGetter = this.props.valueGetter;
  }

  onDateChanged = (value) => {
    const { displayFormat, filterChangedCallback } = this.props;
    const date = value ? moment(value).format(displayFormat) : '';

    this.setState({ date }, () => { filterChangedCallback(); });
  }

  getModel() {
    const { date } = this.state;
    return { values: date ? [date] : [] };
  }

  setModel(model) {
    const date = model ? model.value : '';
    this.setState({ date });
  }

  doesFilterPass = (params) => {
    const { date } = this.state;
    if (!date) return true;

    const { displayFormat } = this.props;
    const nodeValue = this.valueGetter(params.node);
    const nodeDate = moment(nodeValue).format(displayFormat);
    const filterDate = moment(date).format(displayFormat);

    return nodeDate === filterDate;
  }

  isFilterActive = () => this.state.date !== null && this.state.date !== undefined && this.state.date !== '';

  afterGuiAttached() {
    this.focus();
  }

  focus() {
    setTimeout(() => {
      const container = findDOMNode(this.datePicker);
      if (container) {
        container.focus();
      }
    });
  }

  handleRef = (ref) => { this.datePicker = ref; };

  render() {
    const { displayFormat } = this.props;
    const { date } = this.state;

    const dateValue = date ? moment(date) : null;
    return (
      <div>
        <RabineSingleDatePicker
          displayFormat={displayFormat}
          placeholder="Select date"
          onDateChange={this.onDateChanged}
          date={dateValue}
          noMargin
          ref={this.handleRef}
          showClearDate
        />
      </div>
    );
  }
}

SiteListDateFilter.propTypes = {
  displayFormat: PropTypes.string,
  valueGetter: PropTypes.func,
  filterChangedCallback: PropTypes.func,
};

SiteListDateFilter.defaultProps = {
  displayFormat: 'MMM DD, YYYY',
};

export default SiteListDateFilter;
