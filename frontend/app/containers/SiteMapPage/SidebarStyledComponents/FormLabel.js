import styled from 'styled-components';

const FormLabel = styled.span`
  font-size: ${(props) => props.fontSize || '0.7rem'};
  letter-spacing: 0.4px;
  font-weight: ${(props) => props.info || '600'};
  text-align: left;
  color: ${(props) => props.info && 'hsla(0, 0%, 100%, 0.7)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.labelColumn && '0.5rem'};
`;

export default FormLabel;
