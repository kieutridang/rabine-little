// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const StyledConnector = styled.div`
  flex: 1 1 auto;
  ${(props) => props.orientation && orientationConnectorStyle(props.orientation)}
  ${(props) => props.alternativeLabel && css`
    position: absolute;
    top: 12px;
    left: calc(50% + 20px)
    right: calc(-50% + 20px)
  `}
`;

const orientationConnectorStyle = (orientation) => {
  if (orientation === 'vertical') {
    return css`
      margin-left: 8px;
      padding: 0 0 8px;
    `;
  }
  return undefined;
};

const StyledLine = styled.span`
  display: block;
  border-color: ${(props) => props.active ? '#ed2324;' : '#d4d4db;'};
  ${(props) => props.orientation && orientationLineStyle(props.orientation)}
`;

const orientationLineStyle = (orientation) => {
  if (orientation === 'horizontal') {
    return css`
      border-top-style: solid;
      border-top-width: 1px;
    `;
  } else if (orientation === 'vertical') {
    return css`
      border-left-style: solid;
      border-left-width: 1px;
      min-height: 24px;
    `;
  }
  return undefined;
};

const StepConnector = (props) => {
  const {
    alternativeLabel,
    orientation,
    active,
    ...rest
  } = props;

  return (
    <StyledConnector
      orientation={orientation}
      alternativeLabel={alternativeLabel}
      {...rest}
    >
      <StyledLine
        active={active}
        orientation={orientation}
      />
    </StyledConnector>
  );
};

StepConnector.propTypes = {
  /**
   * @ignore
   * Set internally by Step when it's supplied with the alternativeLabel property.
   */
  alternativeLabel: PropTypes.bool,
  /**
   * @ignore
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  active: PropTypes.bool,
};

StepConnector.defaultProps = {
  alternativeLabel: false,
  orientation: 'horizontal',
  active: false,
};

export default StepConnector;
