// vendor
import styled from 'styled-components';

// app
import { marginStyle } from '../../utils/styles/boxModel';

const StyledDateWrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => props.labelPosition === 'row' ? 'row' : 'column'};
  
  width: ${(props) => (props.width && `${props.width}`)};
  height: ${(props) => (props.width && `${props.width}`)};
  ${(props) => props.margin && marginStyle(props.margin)}
  ${(props) => props.block && 'width: 100%;'}
  ${(props) => props.textAlign && `text-align: ${props.textAlign}`}
  ${(props) => props.noMargin && `
    .SingleDatePickerInput__withBorder:last-child,
    .SingleDatePickerInput__withBorder {
      margin: 0 !important;
    }
  `}
`;

export default StyledDateWrapper;
