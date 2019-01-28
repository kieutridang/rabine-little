import styled from 'styled-components';

const StyledLabel = styled.label`
  /* display: inline-block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: #ACAEB0; */
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.4px;
  text-align: left;
  color: #707277;
  display: flex;
  margin-bottom: 8px;
  ${(props) => props.labelPosition === 'row' ? 'margin-right: 1rem;' : 'margin-bottom: .5rem;'}
`;

export default StyledLabel;
