// vendor
import React from 'react';
import PropTypes from 'prop-types';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';

// app
import './singleDatePicker.css';

class RabineDatePicker extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      date: props.date || null,
      focused: false,
    };
  }

  handleDateChange = (date) => {
    this.setState({ date });

    if (this.props.onDateChange && typeof this.props.onDateChange === 'function') {
      this.props.onDateChange(date);
    }
  };

  handleFocusChange = ({ focused }) => {
    this.setState({ focused });

    if (this.props.onFocusChange && typeof this.props.onFocusChange === 'function') {
      this.props.onFocusChange({ focused });
    }
  };

  render() {
    const {
      date,
      focused,
    } = this.state;

    const {
      id,
      displayFormat,
      placeholder,
      disabled,
      required,
      readOnly,
      screenReaderInputMessage,
      showClearDate,
    } = this.props;

    return (
      <SingleDatePicker
        id={id}
        date={date}
        focused={focused}
        onDateChange={this.handleDateChange}
        onFocusChange={this.handleFocusChange}
        displayFormat={displayFormat}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        showDefaultInputIcon
        block
        screenReaderInputMessage={screenReaderInputMessage}
        showClearDate={showClearDate}
        isOutsideRange={() => false}
        numberOfMonths={1}
      />
    );
  }
}

RabineDatePicker.propTypes = {
  id: PropTypes.string,
  date: PropTypes.any,
  onDateChange: PropTypes.func,
  onFocusChange: PropTypes.func,
  displayFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  screenReaderInputMessage: PropTypes.string,
  showClearDate: PropTypes.bool,
};

RabineDatePicker.defaultProps = {
  block: true,
  displayFormat: 'YYYY-MM-DD',
};

export default RabineDatePicker;

