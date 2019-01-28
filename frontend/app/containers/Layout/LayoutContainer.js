// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Box from '../../components/Box';

const LayoutContainer = ({ direction, children }) => (
  <Box
    fill="all"
    direction={direction}
    background={{
      color: '#f4f6f7',
    }}
  >
    {children}
  </Box>
);

LayoutContainer.propTypes = {
  direction: PropTypes.oneOf(['row', 'column']),
  children: PropTypes.any,
};

export default LayoutContainer;
