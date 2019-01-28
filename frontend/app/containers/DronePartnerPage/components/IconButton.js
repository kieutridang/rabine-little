import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.span`
  padding: 0;
`;

const Text = styled.span`
  font-size: 14px;
  letter-spacing: 0.5px;
  color: #ed2324;
`;

const Icon = styled.span`
  svg {
    width: 1.8rem;
  }
  margin: 0 0.7rem;
`;

const IconButton = ({ icon, children }) => (
  <Wrapper>
    <Icon>{icon}</Icon>
    <Text>{children}</Text>
  </Wrapper>
);

IconButton.propTypes = {
  icon: PropTypes.any,
  children: PropTypes.any,
};

export default IconButton;
