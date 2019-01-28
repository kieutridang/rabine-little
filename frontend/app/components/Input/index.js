/* eslint no-unused-vars: 0 */
// vendor
import React from 'react';
import PropTypes from 'prop-types';

// app
import { SIZES } from '../../utils/styles/ui';
import StyledInput from './StyledInput';
import StyledInputWrapper, { StyledIconWrapper } from './StyledInputWrapper';
import StyledLeftIcon from './StyledIcon';
import Label from '../Label';

const Input = (props) => {
  const {
    id,
    name,
    value,
    disabled,
    error,
    fluid,
    focus,
    icon,
    iconPosition,
    label,
    labelPosition,
    loading,
    size,
    type,
    placeholder,
    margin,
    onChange,
    onBlur,
    onEnter,
    width,
    height,
  } = props;

  const handleChange = (e) => {
    const val = e.target.value;
    if (onChange && typeof onChange === 'function') {
      onChange(e);
    }
  };

  const handleBlur = (e) => {
    const val = e.target.value;
    if (onBlur && typeof onBlur === 'function') {
      onBlur(e);
    }
  };

  const handleOnKeyDown = (e) => {
    if (disabled) return;
    const val = e.target.value;
    switch (e.keyCode) {
      case 13: // enter
        if (onEnter && typeof onEnter === 'function') {
          e.preventDefault();
          e.stopPropagation();
          onEnter(val, e);
        }
        break;
      default:
    }
  };

  let inputRef = null;
  const handleRef = (ref) => { inputRef = ref; };

  return (
    <StyledInputWrapper
      size={size}
      margin={margin}
      labelPosition={labelPosition}
      width={width}
      height={height}
    >
      {label && <Label labelPosition={labelPosition}>{label}</Label>}
      <StyledIconWrapper
        disabled={disabled}
        error={error}
        fluid={fluid}
        focus={focus}
        loading={loading}
        iconPosition={iconPosition}
        icon={icon}
      >
        {
          icon &&
          <StyledLeftIcon icon={icon} />
        }
        <StyledInput
          id={id}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleOnKeyDown}
          ref={handleRef}
          {...disabled && 'disabled'}
        />
      </StyledIconWrapper>
    </StyledInputWrapper>
  );
};

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  fluid: PropTypes.bool,
  focus: PropTypes.bool,
  icon: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.object,
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.node,
          PropTypes.object,
        ]),
      ),
    ]),
  ]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  labelPosition: PropTypes.oneOf(['row', 'column']),
  label: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.object,
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.node,
          PropTypes.object,
        ]),
      ),
    ]),
  ]),
  loading: PropTypes.bool,
  size: PropTypes.oneOf(SIZES),
  type: PropTypes.string,
  placeholder: PropTypes.string,
  margin: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onEnter: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  labelPosition: 'column',
};

export default Input;
