// vendor
import styled from 'styled-components';

const FormColumn = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;

  &:first-of-type {
    margin-right: ${(props) => props.hasMargin && '0.75rem'};
  }

  &:larst-of-type {
    margin-left: ${(props) => props.hasMargin && '0.75rem'};
  }
`;

export default FormColumn;
