import styled from 'styled-components';
import ColorPicker from 'rc-color-picker';

export const StyledColorPicker = styled(ColorPicker)`
  margin-left: 0.4rem;
  user-select: none;

  display: flex !important;
  align-items: center;
  justify-content: center;

  .rc-color-picker-trigger {
    width: 3.0rem;
    height: 1.3rem;
    border: 1px solid hsl(0, 0%, 30%);
    box-shadow: 0 0 0 2px hsl(0, 0%, 0%) inset;
  }
`;
