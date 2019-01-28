import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledSquareFeet = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0;
  width: 30%;
  background-color: #f9f9f9;
  border: solid 1px #e1e1e1;
  padding: 0.5rem 1rem;
`;

const StyledSquareFeetColumn = styled.div`
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;

  &:last-child {
    text-align: right;
  }
`;

const SquareFeet = ({ boundary }) => (
  <StyledSquareFeet>
    <StyledSquareFeetColumn>
      Boundary SQFT:
    </StyledSquareFeetColumn>

    <StyledSquareFeetColumn>
      { boundary } SF
    </StyledSquareFeetColumn>
  </StyledSquareFeet>
  );

SquareFeet.propTypes = {
  boundary: PropTypes.string,
};

SquareFeet.defaultProps = {
  boundary: '0',
};

export default SquareFeet;
