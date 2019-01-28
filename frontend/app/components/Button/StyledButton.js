import styled, { css } from 'styled-components';

const StyledButton = styled.button`
  box-sizing: border-box;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  margin: 0 13px;
  &:last-child {
    margin: 0 0 0 13px;
  }
  font-size: 14px;
  background-color: transparent;
  overflow: visible;
  border-radius: 3px;
  &:hover {
    box-shadow: 2px 2px 0px #ccc;
  }
  &:focus {
    outline: none;
  }
  
  width: ${(props) => props.width ? props.width : '10.3125rem'};
  height: ${(props) => props.height ? props.height : '2.5rem'};
  ${(props) => props.color && colorStyle(props.color)}
  ${(props) => props.disabled && disabledStyle}
  ${(props) => props.fill && fillStyle}
`;

const fillStyle = css`
  margin: 0;
  width: 100%;
  min-width: 100%;
`;

const disabledStyle = `
  opacity: 0.3;
  cursor: default;
`;

const COLOR_STYLES = {
  primary: () => primaryStyle,
  secondary: () => secondaryStyle,
};

const primaryStyle = css`
  background-color: ${(props) => props.noBackground ? 'none' : '#ed2324'};
  border: solid 1px #ff5253;
  color: ${(props) => props.noBackground ? '#ff5253' : '#ffffff'};
`;

const secondaryStyle = css`
  background-color: ${(props) => props.noBackground ? 'none' : '#e6e8eb'};
  border: solid 1px #e6e8eb;
  color: #bbb8b8;
`;

const colorStyle = (color) => COLOR_STYLES[color];

export const StyledLinkButton = StyledButton.withComponent('a');

export const StyledLabel = styled.span`
  text-transform: capitalize;
  font-size: 14px;
  font: inherit;
  letter-spacing: 1.2px;
  text-align: center;
`;

export const StyledButtonIcon = styled.div`
  margin-right: 0.5rem;
  margin-bottom: 0.2rem;
  text-align: center;
  vertical-align: middle;
  height: 100%;
`;

export default StyledButton;
