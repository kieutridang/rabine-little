import React from 'react';
import PropTypes from 'prop-types';

import Box from '../Box';

const ContentData = ({
                       children,
                       margin = { bottom: '7rem' },
                     }) => (
                       <Box
                         fill="all"
                         overflow="visible"
                         padding={{ horizontal: '50px' }}
                         margin={margin}
                       >
                         {children}
                       </Box>
                      );

ContentData.propTypes = {
  children: PropTypes.any,
  margin: PropTypes.any,
};

export default ContentData;
