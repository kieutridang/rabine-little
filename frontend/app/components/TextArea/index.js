// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import StyledTextArea from './StyledTextArea';
import StyledTextAreaWrapper from './StyledTextAreaWrapper';
import Label from '../Label';

class TextArea extends React.Component {
  handleRef = (ref) => { this.ref = ref; };
  focus = () => this.ref.focus();

  handleChange = (event) => {
    const value = event.target.value;

    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(value);
    }
  }

  handleInput = (event) => {
    const value = event.target.value;

    if (this.props.onInput && typeof this.props.onInput === 'function') {
      this.props.onInput(value);
    }
  }

  render() {
    const {
      onChange,
      onInput,
      rows,
      value,
      placeholder,
      backgroundColor,
      margin,
      padding,
      border,
      label,
      labelPosition,
      ...rest
    } = this.props;

    return (
      <StyledTextAreaWrapper
        labelPosition={labelPosition}
      >
        {label && <Label labelPosition={labelPosition}>{label}</Label>}
        <StyledTextArea
          ref={this.handleRef}
          onChange={this.handleChange}
          onInput={this.handleInput}
          rows={rows}
          value={value}
          placeholder={placeholder}
          backgroundColor={backgroundColor}
          {...rest}
        />
      </StyledTextAreaWrapper>
    );
  }
}

TextArea.propTypes = {
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  rows: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  placeholder: PropTypes.string,
  backgroundColor: PropTypes.string,
  margin: PropTypes.object,
  padding: PropTypes.object,
  border: PropTypes.object,
  label: PropTypes.string,
  labelPosition: PropTypes.oneOf(['row', 'column']),
};

TextArea.defaultProps = {
  rows: 2,
  backgroundColor: '#fbfbfb',
  labelPosition: 'column',
};

export default TextArea;
