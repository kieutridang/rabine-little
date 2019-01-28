// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// app
import Box from '../../components/Box';

const StyledMetricNumber = styled.span`
  font-size: 1.75rem;
  font-weight: bold;
  letter-spacing: 0.7px;
  text-align: left;
  color: #545558;
`;

const StyledMetricText = styled.span`
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 0.7px;
  text-align: left;
  color: #6a6e73;
`;

const Metric = ({ number, text }) => (
  <Box
    width="15rem"
    height="6.125rem"
    alignItems="center"
    background={{
      color: '#ffffff',
    }}
    border={{
      color: '#d9dce3',
    }}
    padding={{
      top: '0.625rem',
    }}
  >
    <Box
      fill="horizontal"
      height="2.5rem"
      padding={{
        left: '2rem',
      }}
      margin={{
        bottom: '0.25rem',
      }}
    >
      <StyledMetricNumber>{number}</StyledMetricNumber>
    </Box>

    <Box
      fill="horizontal"
      height="1rem"
      padding={{
        left: '2rem',
      }}
    >
      <StyledMetricText>{text}</StyledMetricText>
    </Box>
  </Box>
);

Metric.propTypes = {
  number: PropTypes.string,
  text: PropTypes.string,
};

export default Metric;
