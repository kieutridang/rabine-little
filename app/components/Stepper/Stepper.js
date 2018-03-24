// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

// app
import StepConnector from './StepConnector';

const StyledWrapper = styled.div`
    display: flex;
    padding: 0;
    place-content: flex-end space-between;

    ${(props) => props.alternativeLabel && alternativeLabelStyle(props.alternativeLabel)}
    ${(props) => props.orientation && orientationStyle(props.orientation)}
`;

const alternativeLabelStyle = (alternativeLabel) => {
  if (alternativeLabel) {
    return css`
      align-items: flex-start;
    `;
  }

  return undefined;
};

const orientationStyle = (orientation) => {
  if (orientation === 'vertical') {
    return css`
      flex-direction: column;
      align-items: stretch;
    `;
  } else if (orientation === 'horizontal') {
    return css`
      flex-direction: row;
      align-items: center;
    `;
  }

  return undefined;
};

// Stepper has at least 2 Steps
const Stepper = (props) => {
  const {
    activeStep,
    alternativeLabel,
    children,
    connector: connectorProp,
    nonLinear,
    orientation,
    ...rest
  } = props;

  // get all step inside of stepper
  const childrenArray = React.Children.toArray(children);
  const steps = childrenArray.map((step, index) => {
    const controlProps = {
      iconId: `icon_${index}`,
      index,
      orientation,
      active: false,
      completed: false,
      disabled: false,
      last: index + 1 === childrenArray.length,
      alternativeLabel,
      connector: connectorProp,
    };

    // check active step
    if (activeStep === index) {
      controlProps.active = true;
    } else if (!nonLinear && activeStep > index) {
      controlProps.completed = true;
    } else if (!nonLinear && activeStep < index) {
      controlProps.disabled = true;
    }

    // create connector with orientation in [veritcal, horizontal]
    const additionalConnectorProps = {
      active: (controlProps.active || controlProps.completed),
      orientation,
    };
    const connector = React.isValidElement(connectorProp)
      ? React.cloneElement(connectorProp, { ...additionalConnectorProps })
      : null;

    return [
      !alternativeLabel
      && connector
      && index > 0
      && React.cloneElement(connector, { key: index }), // eslint-disable-line react/no-array-index-key
      React.cloneElement(step, { ...step.props, ...controlProps }),
    ];
  });

  return (
    <StyledWrapper
      orientation={orientation}
      alternativeLabel={alternativeLabel}
      {...rest}
    >
      {steps}
    </StyledWrapper>
  );
};

Stepper.propTypes = {
  /**
   * Set the active step (zero based index).
   */
  activeStep: PropTypes.number,
  /**
   * If set to 'true' and orientation is horizontal,
   * then the step label will be positioned under the icon.
   */
  alternativeLabel: PropTypes.bool,
  /**
   * Two or more `<Step />` components.
   */
  children: PropTypes.node.isRequired,
  /**
   * A component to be placed between each step.
   */
  connector: PropTypes.element,
  /**
   * If set the `Stepper` will not assist in controlling steps for linear flow.
   */
  nonLinear: PropTypes.bool,
  /**
   * The stepper orientation (layout flow direction).
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
};

Stepper.defaultProps = {
  activeStep: 0,
  alternativeLabel: false,
  connector: <StepConnector />,
  nonLinear: false,
  orientation: 'horizontal',
};

export default Stepper;
