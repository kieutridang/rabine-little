// vendor
import styled, { css } from 'styled-components';

// app
import { marginStyle } from '../../utils/styles/boxModel';

const BaseStyles = css`
  ${(props) => (props.margin && marginStyle(props.margin)) || 'margin: 0 13px;'}
  ${(props) => (props.width && `width: ${props.width}`) || 'width: 220px;'}
  ${(props) => (props.fluid && 'width: 100%')}
`;

export const FormGroup = styled.div`
  ${BaseStyles}
`;

export const FormCheck = styled.div`
  position: relative;
  display: block;
  padding-left: 1.25rem;

  ${BaseStyles}
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  margin-bottom: 1rem;

  ${BaseStyles}
`;

