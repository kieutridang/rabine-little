import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '../Icon/SvgIcon';

const SvgCompleteIcon = (props) => {
  const {
    defaultColor,
    completed,
  } = props;

  return (
    <SvgIcon
      color={defaultColor}
      active={completed}
    >
      <circle cx="12" cy="12" r="11" strokeWidth="1" fill="white" />
      <circle cx="12" cy="12" r="8" strokeWidth="1" />
    </SvgIcon>
  );
};

SvgCompleteIcon.propTypes = {
  defaultColor: PropTypes.string,
  completed: PropTypes.bool,
};

export default SvgCompleteIcon;
