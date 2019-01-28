// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import Box from '../Box/index';

const ContentHeader = ({
  direction,
  alignItems,
  justifyContent,
  height,
  backgroundColor,
  padding,
  horizontalPadding,
  children,
  border = { side: 'bottom', color: '#dde0e2' },
  background = { color: backgroundColor || '#ffffff' },
}) => (
  <Box
    fill="horizontal"
    height={height || '90px'}
    justifyContent={justifyContent || 'between'}
    alignItems={alignItems || 'center'}
    direction={direction || 'row'}
    border={border}
    background={background}
    padding={{
      ...(padding || { horizontal: horizontalPadding || '50px' }),
    }}
  >
    {children}
  </Box>
);

ContentHeader.propTypes = {
  background: PropTypes.any,
  children: PropTypes.any,
  border: PropTypes.any,
  direction: PropTypes.any,
  justifyContent: PropTypes.any,
  alignItems: PropTypes.any,
  height: PropTypes.string,
  backgroundColor: PropTypes.string,
  horizontalPadding: PropTypes.string,
  padding: PropTypes.object,
};

export default ContentHeader;
