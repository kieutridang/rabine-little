// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledRejectedFiles = styled.div`
  margin: 0 10px;
  color: #ed2324;
  font-size: 12px;
  font-weight: 200;
  word-wrap: break;
`;

const DropzoneMessage = ({ message }) => (
  <StyledRejectedFiles>
    <span>{message}</span>
  </StyledRejectedFiles>
);

DropzoneMessage.propTypes = {
  message: PropTypes.string,
};

export default DropzoneMessage;
