import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const MOMENT_FORMAT = { MMM_DD_YYYY: 'MMM DD, YYYY' };

const SiteListDateRenderer = ({ data: { deadline } }) => {
  const formattedDeadline = deadline ? moment(deadline).format(MOMENT_FORMAT.MMM_DD_YYYY).toString() : '';
  return (<div>{ formattedDeadline }</div>);
};

SiteListDateRenderer.propTypes = {
  data: PropTypes.object,
};

export default SiteListDateRenderer;
