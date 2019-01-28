import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SiteListNameRenderer = ({ data: { id, name } }) => (
  <Link to={`sites/${id}/design`}>{name}</Link>
);

SiteListNameRenderer.propTypes = {
  data: PropTypes.object,
};

export default SiteListNameRenderer;
