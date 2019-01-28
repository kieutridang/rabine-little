import styled from 'styled-components';

const FormLabel = styled.span`
  font-size: ${(props) => props.fontSize || '0.7rem'};
  letter-spacing: 0.4px;
  font-weight: ${(props) => props.info || '600'};
  text-align: left;
  color: #707277;
  color: ${(props) => props.info ? 'hsl(0, 0%, 100%, 0.7)' : 'hsla(223, 3%, 45%, 0.7)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.labelColumn && '0.5rem'};
`;

export default FormLabel;
