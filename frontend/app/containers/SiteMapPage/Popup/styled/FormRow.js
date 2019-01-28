// vendor
import PropTypes from 'prop-types';

// app
import styled from 'styled-components';

const FormRow = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent || 'space-between'};
  align-items: center;
  margin: ${(props) => !props.noMargin && `0.5rem ${props.lrMargin ? '0.75rem' : '0'}`};
`;

FormRow.propTypes = {
  children: PropTypes.node,
};

export default FormRow;
