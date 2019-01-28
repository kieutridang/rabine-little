// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

// app

const StyledSvgIcon = styled.svg`
  user-select: none;
  font-size: 24;
  width: 1em;
  height: 1em;
  display: inline-block;
  flex-shrink: 0;
  fill: currentColor;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;

  ${(props) => iconColor(props)}
`;

const iconColor = (props) => {
  if (props.active) {
    return css`
      color: #ed2324;
      stroke: #ed2324;
    `;
  }
  if (props.color) {
    return css`
      color: ${props.color};
      stroke: ${props.color};
    `;
  }

  return css`color: inherit;`;
};

const SvgIcon = (props) => {
  const {
    children,
    color,
    active,
    titleAccess,
    viewBox,
    ...rest
  } = props;

  return (
    <StyledSvgIcon
      active={active}
      color={color}
      viewBox={viewBox}
      aria-hidden={titleAccess ? 'false' : 'true'}
      {...rest}
    >
      {titleAccess ? <title>{titleAccess}</title> : null}
      {children}
    </StyledSvgIcon>
  );
};

SvgIcon.propTypes = {
  /**
   * Node passed into the SVG element.
   */
  children: PropTypes.node.isRequired,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   * You can use the `nativeColor` property to apply a color attribute to the SVG element.
   */
  color: PropTypes.string,
  /**
   * Provides a human-readable title for the element that contains it.
   * https://www.w3.org/TR/SVG-access/#Equivalent
   */
  titleAccess: PropTypes.string,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   */
  viewBox: PropTypes.string,
  active: PropTypes.bool,
};

SvgIcon.defaultProps = {
  color: '#d4d4db',
  viewBox: '0 0 24 24',
};

export default SvgIcon;
