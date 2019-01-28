// vendor
import React from 'react';
import PropTypes from 'prop-types';
import StepTextIcon from './StepTextIcon';

// app

const StepIcon = (props) => {
  const {
    completed,
    icon: Icon,
    active,
    error,
  } = props;

  if (typeof Icon === 'number' || typeof Icon === 'string') {
    if (error) {
      return (
        <StepTextIcon
          active={active}
          text={Icon}
        />
      );
    }
    if (completed) {
      return (
        <StepTextIcon
          active={active}
          text={Icon}
        />
      );
    }
    return (
      <StepTextIcon
        active={active}
        text={Icon}
      />
    );
  }

  return <Icon completed={active || completed} />;
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
  icon: PropTypes.any,
};

StepIcon.defaultProps = {
  active: false,
  completed: false,
  error: false,
};

export default StepIcon;
