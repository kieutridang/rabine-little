import React from 'react';
import PropTypes from 'prop-types';
import StyledBox from './StyledBox';

const Box = (props) => {
  const {
    title,
    children,
    onClick,
    ...rest
  } = props;

  return (
    <StyledBox
      aria-label={title}
      onClick={onClick}
      {...rest}
    >
      { children }
    </StyledBox>
  );
};

Box.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  onClick: PropTypes.func,
};

Box.defaultProps = {
  direction: 'column',
  margin: 'none',
  padding: 'none',
  responsive: true,
  tag: 'div',
};

export default Box;
