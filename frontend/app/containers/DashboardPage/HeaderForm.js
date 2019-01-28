import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledForm = styled.form`
  
`;

const HeaderForm = ({ onSubmit, children }) => (
  <StyledForm onSubmit={onSubmit}>
    { children }
  </StyledForm>
);

HeaderForm.propTypes = {
  onSubmit: PropTypes.func,
  children: PropTypes.node,
};

export default HeaderForm;
