import React from 'react';
import PropTypes from 'prop-types';
import { statusOptions } from '../../Common/Options';

const SiteListStatusRenderer = ({ data: { status } }) => {
  const statusIndex = statusOptions.findIndex((obj) => obj.value === status);
  return (<div>{statusIndex !== -1 ? statusOptions[statusIndex].text : status}</div>);
};

SiteListStatusRenderer.propTypes = {
  data: PropTypes.object,
};

export default SiteListStatusRenderer;
