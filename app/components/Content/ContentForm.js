// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Box from '../Box/index';

const ContentForm = ({ justifyContent, alignItems, children }) => (
  <Box
    direction="row"
    justifyContent={justifyContent}
    alignItems={alignItems}
  >
    {children}
  </Box>
);

ContentForm.propTypes = {
  children: PropTypes.any,
  justifyContent: PropTypes.string,
  alignItems: PropTypes.string,
};

ContentForm.defaultProps = {
  justifyContent: 'between',
  alignItems: 'center',
};

export default ContentForm;
