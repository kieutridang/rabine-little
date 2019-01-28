import styled from 'styled-components';

export const StyledForm = styled.form`
  font-size: 1.0rem;
`;

export const FormTitle = styled.div`
  padding-bottom: 1rem;
  color: hsla(0, 0%, 100%, 1.0);
  letter-spacing: 0.4px;
  border-bottom: ${(props) => !props.noBottomBorder && 'solid 1px hsla(0, 0%, 100%, 0.2)'};
  font-size: 1rem;
`;

