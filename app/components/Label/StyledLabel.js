import styled from 'styled-components';

const StyledLabel = styled.label`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: #ACAEB0;

  ${(props) => props.labelPosition === 'row' ? 'margin-right: 1rem;' : 'margin-bottom: .5rem;'}
`;

export default StyledLabel;
