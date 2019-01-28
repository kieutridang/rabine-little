import React from 'react';
import styled from 'styled-components';

// app
import DocIcon from '../../images/icons/doc.svg';
import Box from '../Box';

const StyledDocImage = styled(Box) `
  color: #b2b5b6;
  fill: #b2b5b6;
`;

const ProgressImage = () => (
  <StyledDocImage alignItems="center" justifyContent="center" margin={{ right: '11px' }}>
    <DocIcon />
  </StyledDocImage>
);

export default ProgressImage;
