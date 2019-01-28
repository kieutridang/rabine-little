import styled from 'styled-components';

const FormRowContent = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 0.75rem;
  font-weight: ${(props) => props.info || '600'};
  color: ${(props) => props.info && 'hsla(0, 0%, 100%, 1.0)'};
  max-width: ${(props) => props.maxWidth || 'auto'}
`;

export default FormRowContent;
