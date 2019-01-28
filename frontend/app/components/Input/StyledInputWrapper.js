// vendor
import styled, { css } from 'styled-components';

// app
import { marginStyle } from '../../utils/styles/boxModel';

const StyledInputWrapper = styled.div`
  position: relative;
  font-weight: normal;
  font-style: normal;
  display: flex;
  flex-direction: ${(props) => props.labelPosition === 'row' ? 'row' : 'column'};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  
  ${(props) => sizeStyle(props.size)}
  ${(props) => props.margin && marginStyle(props.margin)}
`;

const sizeStyle = (size) => {
  if (size === 'mini') {
    return css`font-size: 0.625rem;`;
  }
  if (size === 'small') {
    return css`font-size: 0.75rem;`;
  }
  if (size === 'large') {
    return css`font-size: 1.25rem;`;
  }
  if (size === 'big') {
    return css`font-size: 1.5rem;`;
  }
  if (size === 'huge') {
    return css`font-size: 1.75rem;`;
  }
  if (size === 'massive') {
    return css`font-size: 2rem;`;
  }
  return css`
    font-size: 0.875rem;
  `;
};

export const StyledIconWrapper = styled.div`
  position: relative;
  font-weight: 400;
  font-style: normal;
  display: inline-flex;

  ${(props) => props.disabled && disabledStyle}
  ${(props) => props.error && errorStyle}
  ${(props) => props.fluid && fluidStyle}
  ${(props) => props.focus && focusStyle}
  ${(props) => props.placeholder && placeholderStyle}

  & > input {
    ${(props) => props.icon && 'padding-left: 2.67142857em!important;'}
  }
`;

const disabledStyle = css`
  &:readonly,
  &:disabled {
    opacity: .45;
  }
`;

const errorStyle = css`
  & > input {
    background-color: #FFF6F6;
    border-color: #E0B4B4;
    color: #9F3A38;
    box-shadow: none;
  }

  & > input::-webkit-input-placeholder {
    color: #e7bdbc;
  }
  & > input::-moz-placeholder {
    color: #e7bdbc;
  }
  & > input:-ms-input-placeholder {
    color: #e7bdbc !important;
  }

  & > input:focus::-webkit-input-placeholder {
    color: #da9796;
  }
  & > input:focus::-moz-placeholder {
    color: #da9796;
  }
  & > input:focus:-ms-input-placeholder {
    color: #da9796 !important;
  }
`;

const fluidStyle = css`
  display: flex;

  & > input {
    width: 0px !important;
  }
`;

const focusStyle = css`
  & > input,
  & > input:focus {
    border-color: #85B7D9;
    background: #FFFFFF;
    color: rgba(0, 0, 0, 0.8);
    box-shadow: none;
  }
  & > input::-webkit-input-placeholder,
  & > input:focus::-webkit-input-placeholder {
    color: rgba(115, 115, 115, 0.87);
  }
  & > input::-moz-placeholder,
  & > input:focus::-moz-placeholder {
    color: rgba(115, 115, 115, 0.87);
  }
  & > input:-ms-input-placeholder,
  & > input:focus:-ms-input-placeholder {
    color: rgba(115, 115, 115, 0.87);
  }
`;

const placeholderStyle = css`
  & > input::-webkit-input-placeholder {
    color: #b3bac0;
  }
  & > input::-moz-placeholder {
    color: #b3bac0;
  }
  & > input:-ms-input-placeholder {
    color: #b3bac0;
  }
`;

export default StyledInputWrapper;
