import styled from 'styled-components';

export const FormButton = styled.button`
  width: ${(props) => props.fullWidth ? '100%' : '5.125rem'};
  height: ${(props) => props.height || '1.5rem'};
  text-align: center;
  margin-top: 1rem;
  background-color: hsla(360, 85%, 53%, 1.0);
  border-radius: 2px;
  color: white;
  cursor: pointer;

  font-size: 0.75rem;
  font-weight: bold;

  transition: all 120ms ease;

  &.primary {
    background-color: hsla(360, 85%, 53%, 1.0);
  }

  &.secondary {
    background-color: hsla(220, 3%, 58%, 1.0);
  }

  &:hover {
    opacity: 0.7;
  }

  margin-right: 0.75rem;

  &:last-of-type {
    margin-right: 0;
  }
`;

