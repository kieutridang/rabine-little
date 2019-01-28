import React from 'react';
import PropTypes from 'prop-types';
import { statusOptions } from '../../Common/Options';

const OrderListStatusRenderer = ({ data: { status } }) => {
  const statusIndex = statusOptions.findIndex((obj) => obj.value === status);
  return (<div>{statusIndex !== -1 ? statusOptions[statusIndex].text : status}</div>);
};

OrderListStatusRenderer.propTypes = {
  data: PropTypes.object,
};

export default OrderListStatusRenderer;
