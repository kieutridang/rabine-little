import React from 'react';
import styled from 'styled-components';

export const preselectedColors = [
  '#FF4242',
  '#299FFF',
  '#FFFF52',
  '#27EB33',
  '#00ffff',
];

export const StyledColorCircle = styled.button`
  position: relative;

  width: 1.1rem;
  height: 1.1rem;
  margin: 0 0.2rem;

  background: ${(props) => props.color};
  appearance: none;
  border: 0;
  border-radius: 50%;
  transition: all 120ms ease;
  cursor: pointer;

  &.active {
    &:after {
      opacity: 1;
    }
  }

  &:after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    z-index: 1;
    border-radius: 50%;
    background: hsla(0, 0%, 100%, 0.88);
    opacity: 0;
    transition: all 100ms ease;
  }
`;

export const createColorCircles = (handleChangeColor, currentColor, isShared) =>
  preselectedColors.filter((preColor) => {
    if (!isShared) return preColor;
    return preColor === currentColor && 'active';
  }).map((preColor) => {
    const onClick = (e) => {
      e.preventDefault();
      handleChangeColor({ color: preColor });
    };

    const className = currentColor === preColor && 'active';
    return <StyledColorCircle key={preColor} color={preColor} onClick={onClick} className={className} />;
  });
