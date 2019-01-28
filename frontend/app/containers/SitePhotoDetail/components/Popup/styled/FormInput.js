import styled from 'styled-components';

const input = `
  display: block;
  width: 100%;

  padding: 0.45rem 0.9rem;
  background: hsla(0, 0%, 0%, 0.0);
  border: 1px solid hsla(220, 3%, 80%, 1.0);
  border-radius: 4px;
  color: hsla(223, 3%, 45%, 0.7);
  line-height: 1.5;
  font-size: 0.75rem;

  &:focus {
    outline: none;
    color: hsla(223, 3%, 45%, 1.0);
    border-color: hsla(220, 3%, 80%, 1.0);
  }

  &[disabled] {
    color: hsla(220, 3%, 80%, 0.75);
  }
`;

export const FormInput = styled.input`
  ${input}

  &:focus {
    & + div {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scaleY(1);
    }
  }
`;

export const FormSelect = styled.select`
  box-shadow: none;
  appearance: none;
  ${input}
`;

export const ErrorMessage = styled.span`
    width: 100%;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: 0.5px;
    margin: 3px 0;
    text-transform: none;
    color: #EA272E;
    text-align: ${(props) => props.align || 'right'};
    ${(props) => props.surfaceType && 'position: absolute; top: 60px; width: 160px; left: -15px;'};
    ${(props) => props.repairType && 'position: absolute; top: 60px; width: 160px; left: -15px;'};
`;
