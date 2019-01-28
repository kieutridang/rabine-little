import React from 'react';
import PropTypes from 'prop-types';
import { dollarFormatter } from '../../../utils/number/numberUtils';

const SiteListCostRenderer = ({ data: { cost } }) => {
  const formattedCost = cost ? `$${dollarFormatter(Number(cost), 0)}` : '';
  return (<div>{ formattedCost }</div>);
};

SiteListCostRenderer.propTypes = {
  data: PropTypes.object,
};

export default SiteListCostRenderer;
