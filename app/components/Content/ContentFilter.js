// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Box from '../Box/index';

const ContentFilter = ({ justifyContent, children, alignItems }) => (
  <Box
    fill="horizontal"
    height="73px"
    justifyContent={justifyContent || 'initial'}
    alignItems={alignItems || 'initial'}
    direction="row"
    border={{
      side: 'bottom',
      color: '#dde0e2',
    }}
    background={{
      color: '#ffffff',
    }}
    padding={{
      horizontal: '50px',
    }}
  >
    { children }
  </Box>
);

ContentFilter.propTypes = {
  children: PropTypes.any,
  justifyContent: PropTypes.any,
  alignItems: PropTypes.any,
};

export default ContentFilter;
