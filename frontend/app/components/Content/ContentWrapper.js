// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Box from '../Box/index';

const ContentWrapper = ({ children, tag = 'div', height, ...rest }) => (
  <Box
    fill="all"
    height={height}
    tag={tag}
    {...rest}
  >
    { children }
  </Box>
);

ContentWrapper.propTypes = {
  children: PropTypes.any,
  tag: PropTypes.string,
  height: PropTypes.string,
};

export default ContentWrapper;
