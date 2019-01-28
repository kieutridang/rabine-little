// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { currencyFormat2Number } from '../../../utils/number/numberUtils';
import StyledSiteRepairInput from './StyledSiteRepairInput';

class SiteRepairsInput extends Component {
  state = {
    value: this.props.value || '',
  };

  componentWillReceiveProps(nextProps) {
    if (this.props && nextProps && this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });

    const { onChange } = this.props;
    if (onChange) {
      onChange();
    }
  }

  handleBlur = (e) => {
    const value = e.target.value;
    const unitPrice = currencyFormat2Number(value);

    const { onBlur, id, params, value: oldValue } = this.props;
    const { siteId, qty } = params;
    if (onBlur && unitPrice !== oldValue) {
      onBlur({ featureId: id, unitPrice, siteId, qty });
    }
  }

  render() {
    const { id, disabled } = this.props;
    const { value } = this.state;
    const numberMask = createNumberMask({
      prefix: '$ ',
      suffix: '',
      allowDecimal: true,
    });

    return (
      <MaskedInput
        placeholder="Enter unit price"
        id={`unit_price_${id}`}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        value={value}
        disabled={disabled}
        mask={numberMask}
        render={(ref, props) => (<StyledSiteRepairInput innerRef={ref} {...props} />)}
      />
    );
  }
}

SiteRepairsInput.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  params: PropTypes.object,
  disabled: PropTypes.bool,
};

export default SiteRepairsInput;
