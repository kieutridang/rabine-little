// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// app
import Box from '../Box';

const StyledFileName = styled(Box) `
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  color: #323232;
`;

const ProgressFileName = ({ fileName }) => (
  <StyledFileName>
    {fileName}
  </StyledFileName>
);

ProgressFileName.propTypes = {
  fileName: PropTypes.string,
};

export default ProgressFileName;
