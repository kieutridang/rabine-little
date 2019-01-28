import React from 'react';
import PropTypes from 'prop-types';

const SiteListPlanRenderer = ({ data: { dronePlanName } }) => (
  <div>{ dronePlanName }</div>
);

SiteListPlanRenderer.propTypes = {
  data: PropTypes.object,
};

export default SiteListPlanRenderer;
