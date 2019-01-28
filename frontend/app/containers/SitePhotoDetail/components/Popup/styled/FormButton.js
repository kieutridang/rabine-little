import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

export const FormButton = styled.button`
  width: 5.125rem;
  height: ${(props) => props.height || '1.5rem'};
  text-align: center;

  background-color: hsla(360, 85%, 53%, 1.0);
  border-radius: 4px;
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

export const FormIconButton = styled(IconButton)`
  color: hsla(0, 0%, 100%, 1.0) !important;
  opacity: 0.7;
  margin-left: 0.75rem !important;
  &:hover {
    opacity: 1.0;
    background-color: hsla(0, 0%, 0%, 1.0) !important;
  }
`;

