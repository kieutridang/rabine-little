// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// app
import Box from '../Box';

const StyledPercent = styled(Box) `
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  color: #989898;
`;

const ProgressPercentage = ({ percent }) => (
  <StyledPercent>
    {`${percent}%`}
  </StyledPercent>
);

ProgressPercentage.propTypes = {
  percent: PropTypes.number,
};

export default ProgressPercentage;
