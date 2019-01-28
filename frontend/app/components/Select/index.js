// vendor
import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

// app
import { StyledSelect } from './SelectWrapper';
import { ErrorMessage } from '../../containers/ClientPage/StyledComponents';

class ExtendedSelect extends React.Component {
  handleChange = (value) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  handleBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  };

  render() {
    const {
      name,
      value,
      options,
      touched,
      error,
      placeholder,
    } = this.props;

    return (
      <StyledSelect>
        <Select
          id={name}
          name={name}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={value}
          options={options}
          placeholder={placeholder}
        />
        {!!error && touched && (<ErrorMessage>{error}</ErrorMessage>)}
      </StyledSelect>
    );
  }
}

ExtendedSelect.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  options: PropTypes.array,
  touched: PropTypes.object,
  error: PropTypes.object,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

export default ExtendedSelect;
