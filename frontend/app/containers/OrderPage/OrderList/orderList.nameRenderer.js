import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const OrderListNameRenderer = ({ data: { _id, siteId, name } }) => (
  <Link to={`sites/${siteId}/orders/${_id}/detail`}>{name}</Link>
 );

OrderListNameRenderer.propTypes = {
  data: PropTypes.object,
};

export default OrderListNameRenderer;
