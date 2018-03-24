// vendor
import React from 'react';
import PropTypes from 'prop-types';
import StyledButton, { StyledLabel, StyledLinkButton } from './StyledButton';

const Button = (props) => {
  const {
    title,
    href,
    label,
    onClick,
    type,
    disabled,
    color,
    fill,
    ...rest
  } = props;

  const Tag = href ? StyledLinkButton : StyledButton;

  return (
    <Tag
      aria-label={title}
      color={color}
      onClick={onClick}
      disabled={disabled}
      type={!href ? type : undefined}
      href={href}
      fill={fill}
      {...rest}
    >
      <StyledLabel>
        { label }
      </StyledLabel>
    </Tag>
  );
};

Button.propTypes = {
  title: PropTypes.string,
  href: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  fill: PropTypes.bool,
};

export default Button;
