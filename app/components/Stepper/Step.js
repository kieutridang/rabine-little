// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const StyledStepWrapper = styled.div`
  ${(props) => props.orientation && orientationStyle(props.orientation)}
  ${(props) => props.alternativeLabel && alternativeLabelStyle(props.alternativeLabel)}
`;

const orientationStyle = (orientation) => {
  if (orientation === 'horizontal') {
    return css`
      &:first-child {
        padding-left:0;
      }
      &:last-child {
        padding-right: 0;
      }
    `;
  }

  return undefined;
};

const alternativeLabelStyle = (alternativeLabel) => {
  if (alternativeLabel) {
    return css`
      flex: 1;
      position: relative;
    `;
  }

  return undefined;
};

const Step = (props) => {
  const {
    iconId,
    active,
    alternativeLabel,
    children,
    completed,
    connector,
    disabled,
    icon,
    last,
    orientation,
    ...rest
  } = props;
  return (
    <StyledStepWrapper
      orientation={orientation}
      alternativeLabel={alternativeLabel}
      {...rest}
    >
      { /* render children: Label, Content */ }
      {
        React.Children.map(children, (child) =>
          React.cloneElement(child, {
            ...child.props,
            iconId,
            active,
            alternativeLabel,
            completed,
            disabled,
            icon,
            last,
            orientation,
          }),
        )
      }

      { /* render connector */}
      {
        connector
        && alternativeLabel
        && !last
        && React.cloneElement(connector, { orientation, alternativeLabel })
      }
    </StyledStepWrapper>
  );
};

Step.propTypes = {
  /**
   * Sets the step as active. Is passed to child components.
   */
  active: PropTypes.bool,
  /**
   * @ignore
   * Set internally by Stepper when it's supplied with the alternativeLabel property.
   */
  alternativeLabel: PropTypes.bool,
  /**
   * Should be `Step` sub-components such as `StepLabel`, `StepContent`.
   */
  children: PropTypes.node,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * @ignore
   * Passed down from Stepper if alternativeLabel is also set.
   */
  connector: PropTypes.element,
  /**
   * Mark the step as disabled, will also disable the button if
   * `StepButton` is a child of `Step`. Is passed to child components.
   */
  disabled: PropTypes.bool,
  /**
   * @ignore
   */
  last: PropTypes.bool,
  /**
   * @ignore
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * @ignore
   * custom icon
   */
  icon: PropTypes.any,
  iconId: PropTypes.any,
};

Step.defaultProps = {
  active: false,
  completed: false,
  disabled: false,
};

export default Step;
