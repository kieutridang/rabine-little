import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import RepairNameSelectOption from './RepairNameSelectOption';
import RepairNameSelectValue from './RepairNameSelectValue';

import {
  StyledSelect,
} from './StyledComponents';

class RepairNameSelect extends React.Component {
  static propTypes = {
    options: PropTypes.array,
  };

  constructor(props) {
    super(props);

    const { value, options } = this.props;
    const initialOptions = options && value ? options.filter((option) => option.value === value) : [];
    const initialValue = initialOptions && initialOptions.length ? initialOptions[0] : null;
    this.state = {
      value: initialValue,
    };
  }

  setValue = (option) => {
    this.setState(() => ({ value: option }), () => {
      const { setRepairName, setCheckRepair } = this.props;
      if (setRepairName && setCheckRepair) {
        const value = option && option.value ? option.value : '';
        setRepairName(value);
        setCheckRepair(!!value);
      }
    });
  };

  render() {
    const placeholder = (
      <span>Search Repairs</span>
    );

    const { options } = this.props;
    const { value } = this.state;
    const finalValue = value || this.props.value;

    return (
      <StyledSelect>
        <Select
          value={finalValue}
          options={options}
          onChange={this.setValue}
          placeholder={placeholder}
          optionComponent={RepairNameSelectOption}
          valueComponent={RepairNameSelectValue}
        />
      </StyledSelect>
    );
  }
}

RepairNameSelect.propTypes = {
  setRepairName: PropTypes.func,
  setCheckRepair: PropTypes.func,
  value: PropTypes.string,
};

export default RepairNameSelect;
