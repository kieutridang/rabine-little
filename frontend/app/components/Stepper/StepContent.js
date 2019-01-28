// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Collapse from '../Transitions/Collapse';

const StyledStepContent = styled.div`
  margin-left: 8px;
  padding-top: 15px;
  padding-left: 20px;
  padding-right: 8px;
  ${(props) => styledBorderLeft(props)}
`;

const styledBorderLeft = (props) => css`
    border-left: solid 1px ${props.active ? '#ed2324' : '#d4d4db'};
  `;

const StepContent = (props) => {
  const {
    active,
    alternativeLabel,
    children,
    completed,
    last,
    optional,
    orientation,
    transition: Transition,
    transitionDuration,
    ...rest
  } = props;

  return (
    <StyledStepContent
      last={last}
      {...rest}
    >
      <Transition
        in={active}
        timeout={transitionDuration}
        unmountOnExit
      >
        {children}
      </Transition>
    </StyledStepContent>
  );
};

StepContent.propTypes = {
  /**
   * @ignore
   * Expands the content.
   */
  active: PropTypes.bool,
  /**
   * @ignore
   * Set internally by Step when it's supplied with the alternativeLabel property.
   */
  alternativeLabel: PropTypes.bool,
  /**
   * Step content.
   */
  children: PropTypes.node,
  /**
   * @ignore
   */
  completed: PropTypes.bool,
  /**
   * @ignore
   */
  last: PropTypes.bool,
  /**
   * @ignore
   * Set internally by Step when it's supplied with the optional property.
   */
  optional: PropTypes.bool,
  /**
   * @ignore
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * Collapse component.
   */
  transition: PropTypes.func,
  /**
   * Adjust the duration of the content expand transition.
   * Passed as a property to the transition component.
   *
   * Set to 'auto' to automatically calculate transition time based on height.
   */
  transitionDuration: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    PropTypes.oneOf(['auto']),
  ]),
};

StepContent.defaultProps = {
  transition: Collapse,
  transitionDuration: 'auto',
};

export default StepContent;
