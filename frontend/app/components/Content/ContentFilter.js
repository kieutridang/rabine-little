// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Box from '../Box/index';

const ContentFilter = ({ justifyContent, children, alignItems, height }) => (
  <Box
    fill="horizontal"
    maxHeight={height || '4.5rem'}
    height={height || '4.5rem'}
    overflow={height === '0' ? 'hidden' : 'none'}
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
    {children}
  </Box>
);

ContentFilter.propTypes = {
  children: PropTypes.any,
  justifyContent: PropTypes.any,
  alignItems: PropTypes.any,
  height: PropTypes.string,
};

export default ContentFilter;
