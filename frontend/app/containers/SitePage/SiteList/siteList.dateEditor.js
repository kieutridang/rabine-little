import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

// app
import RabineSingleDatePicker from '../../../components/Date/SingleDatePicker';

class SiteListDateEditor extends Component {
  constructor(props) {
    super(props);

    const { value } = this.props;
    this.state = {
      date: moment(value),
    };
  }

  onDateChage = (value) => {
    this.setState({ date: value }, () => this.props.api.stopEditing());
  };

  getValue = () => this.state.date;

  isPopup = () => true;

  render() {
    const { displayFormat } = this.props;
    const { date } = this.state;

    return (
      <div>
        <RabineSingleDatePicker
          displayFormat={displayFormat}
          placeholder="Select date"
          onDateChange={this.onDateChage}
          date={date}
          noMargin
        />
      </div>
    );
  }
}

SiteListDateEditor.propTypes = {
  displayFormat: PropTypes.string,
  api: PropTypes.any,
  value: PropTypes.string,
};

SiteListDateEditor.defaultProps = {
  displayFormat: 'MMM DD, YYYY',
};

export default SiteListDateEditor;
