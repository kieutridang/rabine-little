// vendor
import React from 'react';
import PropTypes from 'prop-types';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';

// app
import './dateRangeStyles.css';
import StyledDateWrapper from './StyledDateWrapper';
import Label from '../Label';

class RabineDateRangePicker extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      startDate: props.startDate || null,
      endDate: props.endDate || null,
      focusedInput: null,
    };
  }

  handleDatesChange = ({ startDate, endDate }) => {
    this.setState({ startDate, endDate });

    if (this.props.onDatesChange && typeof this.props.onDatesChange === 'function') {
      this.props.onDatesChange({ startDate, endDate });
    }
  }

  handleFocusChange = (focusedInput) => {
    this.setState({ focusedInput });

    if (this.props.onFocusChange && typeof this.props.onFocusChange === 'function') {
      this.props.onFocusChange(focusedInput);
    }
  }

  render() {
    const {
      startDate,
      endDate,
      focusedInput,
    } = this.state;

    const {
      startDateId,
      endDateId,
      displayFormat,
      startDatePlaceholderText,
      endDatePlaceholderText,
      disabled,
      required,
      readOnly,
      block,
      screenReaderInputMessage,
      showClearDates,
      margin,
      width,
      height,
      label,
      labelPosition,
    } = this.props;

    return (
      <StyledDateWrapper
        block={block}
        margin={margin}
        width={width}
        height={height}
        labelPosition={labelPosition}
      >
        {label && <Label labelPosition={labelPosition}>{label}</Label>}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          startDateId={startDateId}
          endDateId={endDateId}
          onDatesChange={this.handleDatesChange}
          focusedInput={focusedInput}
          onFocusChange={this.handleFocusChange}
          displayFormat={displayFormat}
          showDefaultInputIcon
          startDatePlaceholderText={startDatePlaceholderText}
          endDatePlaceholderText={endDatePlaceholderText}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          block={block}
          screenReaderInputMessage={screenReaderInputMessage}
          showClearDates={showClearDates}
          isOutsideRange={() => false}
        />
      </StyledDateWrapper>
    );
  }
}

RabineDateRangePicker.propTypes = {
  startDateId: PropTypes.string,
  endDateId: PropTypes.string,
  onDatesChange: PropTypes.func,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  onFocusChange: PropTypes.func,
  displayFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  startDatePlaceholderText: PropTypes.string,
  endDatePlaceholderText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  block: PropTypes.bool,
  screenReaderInputMessage: PropTypes.string,
  showClearDates: PropTypes.bool,
  margin: PropTypes.object,
  width: PropTypes.string,
  height: PropTypes.string,
  label: PropTypes.string,
  labelPosition: PropTypes.string,
};

export default RabineDateRangePicker;
