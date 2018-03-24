// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Box from '../Box/index';

const ContentWrapper = ({ children, tag = 'div' }) => (
  <Box
    fill
    tag={tag}
  >
    { children }
  </Box>
);

ContentWrapper.propTypes = {
  children: PropTypes.any,
  tag: PropTypes.string,
};

export default ContentWrapper;
