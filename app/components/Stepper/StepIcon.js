// vendor
import React from 'react';
import PropTypes from 'prop-types';
import StepTextIcon from './StepTextIcon';
import SvgCompleteIcon from '../Icon/SvgCompleteIcon';

// app

const StepIcon = (props) => {
  const {
    completed,
    icon,
    active,
    error,
  } = props;

  if (typeof icon === 'number' || typeof icon === 'string') {
    if (error) {
      return (
        <StepTextIcon
          active={active}
          text={icon}
        />
      );
    }
    if (completed) {
      return (
        <StepTextIcon
          active={active}
          text={icon}
        />
      );
    }
    return (
      <StepTextIcon
        active={active}
        text={icon}
      />
    );
  }

  return <SvgCompleteIcon completed={active || completed} />;
};

StepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * Mark the step as failed.
   */
  error: PropTypes.bool,
  /**
   * The icon displayed by the step label.
   */
  icon: PropTypes.node,
};

StepIcon.defaultProps = {
  active: false,
  completed: false,
  error: false,
};

export default StepIcon;
