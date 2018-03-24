// vendor
import styled from 'styled-components';

// app
import { marginStyle } from '../../utils/styles/boxModel';

const StyledTextAreaWrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => props.labelPosition === 'row' ? 'row' : 'column'};
  ${(props) => props.margin && marginStyle(props.margin)}
`;

export default StyledTextAreaWrapper;
