import styled from 'styled-components';

const StyledSiteRepairInput = styled.input`
  width: 9rem;
  height: 1.75rem;
  border-radius: 3px;
  background-color: #f8f8f8;
  border: solid 1px #e7e7e7;
  opacity: ${(props) => props.disabled ? 0.5 : 1};

  letter-spacing: 0.7px;
  text-align: left;
  color: #323232;
  padding: 1rem 0.75rem;
`;

export default StyledSiteRepairInput;

