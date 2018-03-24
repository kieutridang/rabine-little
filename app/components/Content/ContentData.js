// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Box from '../Box/index';

const ContentData = ({ children }) => (
  <Box
    fill
    padding={{
      horizontal: '50px',
    }}
  >
    { children }
  </Box>
);

ContentData.propTypes = {
  children: PropTypes.any,
};

export default ContentData;
