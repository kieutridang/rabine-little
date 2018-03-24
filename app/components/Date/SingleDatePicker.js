// vendor
import React from 'react';
import PropTypes from 'prop-types';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';

// app
import './singleDatePicker.css';
import StyledDateWrapper from './StyledDateWrapper';
import Label from '../Label';

class RabineSingleDatePicker extends React.Component {
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
  }

  handleFocusChange = ({ focused }) => {
    this.setState({ focused });

    if (this.props.onFocusChange && typeof this.props.onFocusChange === 'function') {
      this.props.onFocusChange({ focused });
    }
  }

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
      block,
      screenReaderInputMessage,
      showClearDate,
      margin,
      width,
      height,
      label,
      labelPosition,
      textAlign,
    } = this.props;

    return (
      <StyledDateWrapper
        block={block}
        margin={margin}
        width={width}
        height={height}
        labelPosition={labelPosition}
        textAlign={textAlign}
      >
        {label && <Label labelPosition={labelPosition}>{label}</Label>}
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
          block={block}
          screenReaderInputMessage={screenReaderInputMessage}
          showClearDate={showClearDate}
          isOutsideRange={() => false}
          numberOfMonths={1}
        />
      </StyledDateWrapper>
    );
  }
}

RabineSingleDatePicker.propTypes = {
  id: PropTypes.string,
  date: PropTypes.any,
  onDateChange: PropTypes.func,
  onFocusChange: PropTypes.func,
  displayFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  block: PropTypes.bool,
  screenReaderInputMessage: PropTypes.string,
  showClearDate: PropTypes.bool,
  margin: PropTypes.object,
  width: PropTypes.string,
  height: PropTypes.string,
  label: PropTypes.string,
  labelPosition: PropTypes.string,
  textAlign: PropTypes.string,
};

export default RabineSingleDatePicker;

