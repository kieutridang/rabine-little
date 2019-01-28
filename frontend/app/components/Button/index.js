// vendor
import React from 'react';
import PropTypes from 'prop-types';
import FilterIcon from '../../../app/images/icons/filter.svg';
import StyledButton, { StyledLabel, StyledLinkButton, StyledButtonIcon } from './StyledButton';
import Box from '../Box';

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
    icon,
    ...rest
  } = props;

  const Tag = href ? StyledLinkButton : StyledButton;
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onClick) {
      onClick();
    }
  };

  return (
    <Tag
      aria-label={title}
      color={color}
      onClick={handleClick}
      disabled={disabled}
      type={!href ? type : undefined}
      href={href}
      fill={fill}
      {...rest}
    >
      <Box direction="row" alignItems="center" justifyContent="center">
        {
          icon &&
          <StyledButtonIcon>{Icons[icon]}</StyledButtonIcon>
        }
        <StyledLabel>{ label }</StyledLabel>
      </Box>
    </Tag>
  );
};

const Icons = {
  filter: (<FilterIcon width="14px" height="14px" />),
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
  icon: PropTypes.string,
};

export default Button;
