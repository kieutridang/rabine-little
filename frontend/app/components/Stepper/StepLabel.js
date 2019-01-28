// vendor
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

// app
import StepIcon from './StepIcon';

const StepLabel = (props) => {
  const {
    iconId,
    active,
    alternativeLabel,
    children,
    completed,
    disabled,
    error,
    icon,
    last,
    optional,
    orientation,
    showTitle,
    ...rest
  } = props;

  return (
    <StyledStepLabelWrapper
      orientation={orientation}
      disabled={disabled}
      alternativeLabel={alternativeLabel}
      error={error}
      completed={completed}
      {...rest}
    >
      { /* icon */ }
      {
        <StyledStepIconWrapper
          alternativeLabel={alternativeLabel}
          active={active}
          showTitle={showTitle}
          completed={completed}
          id={iconId}
        >
          <StepIcon
            active={active}
            error={error}
            completed={completed}
            icon={icon}
          />
        </StyledStepIconWrapper>
      }

      { /* label text show only active */}
      {
        <StyledTextWrapper
          active={active}
          showTitle={showTitle}
          id={`text_${iconId}`}
        >
          <StyledTypo
            active={active}
            alternativeLabel={alternativeLabel}
            error={error}
            completed={completed}
          >
            {children}
          </StyledTypo>

          {optional}
        </StyledTextWrapper>
      }
    </StyledStepLabelWrapper>
  );
};

const StyledStepLabelWrapper = styled.span`
  display: flex;
  position: relative;
  align-items: center;
  margin-bottom: 2px;
  transition: all 2s linear;
  ${(props) => props.disabled && css`cursor: default;`}
  ${(props) => props.alternativeLabel && css`flex-direction: column;`}
`;

const StyledStepIconWrapper = styled.span`
  width: 100%;
  outline: none;
  
  ${(props) => props.alternativeLabel && css`padding-right: 0;`}
  ${(props) => activeIconWrapperStyle(props)}
`;

const activeIconWrapperStyle = (props) =>
  css`
      &:hover {
        cursor: pointer;
        svg {
          color: ${(props.active || props.completed) ? '#c91011' : '#a5a5b3'};
          stroke: ${(props.active || props.completed) ? '#c91011' : '#a5a5b3'};
        }
      }
      ${
    props.showTitle &&
    css`
          &:hover~#text_${props.id} {
            display: block;
            position: absolute;
            transform: translate(-40%, -80%);
            margin-left: 0.5em;
            opacity: 1;
            color: ${(props.active || props.completed) ? '#c91011' : '#a5a5b3'};
          }
        `
    }
    `;

const StyledTextWrapper = styled.span`
  ${(props) => activeTextWrapperStyle(props)}
  white-space: nowrap;
`;

const activeTextWrapperStyle = (props) => {
  if (props.active && props.showTitle) {
    return css`
      display: block;
      position: absolute;
      transform: translate(-40%, -80%);
      margin-left: 0.5em;
    `;
  }
  return css`
      display: none;
      opacity: 0;
    `;
};

const StyledTypo = styled.span`
  color: #373737;
  font-size: 11px;
  letter-spacing: 0.8px;
  font-family: 'Source Sans Pro';
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  ${(props) => props.active && css`
    color: #ed2324;
    font-weith: 500;
  `}
  ${(props) => props.alternativeLabel && css`
    text-align: center;
    margin-top: 16px;
  `}
  ${(props) => props.disabled && css`
    color: #ed2324;
    font-weith: 500;
  `}
  ${(props) => props.error && css`
    color: #ed2324;
  `}
`;

StepLabel.propTypes = {
  /**
   * @ignore
   * Sets the step as active. Is passed to child components.
   */
  active: PropTypes.bool,
  /**
   * @ignore
   * Set internally by Stepper when it's supplied with the alternativeLabel property.
   */
  alternativeLabel: PropTypes.bool,
  /**
   * In most cases will simply be a string containing a title for the label.
   */
  children: PropTypes.node,
  /**
   * @ignore
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * Mark the step as disabled, will also disable the button if
   * `StepLabelButton` is a child of `StepLabel`. Is passed to child components.
   */
  disabled: PropTypes.bool,
  /**
   * Mark the step as failed.
   */
  error: PropTypes.bool,
  /**
   * Override the default icon.
   */
  icon: PropTypes.any,
  /**
   * @ignore
   */
  last: PropTypes.bool,
  /**
   * The optional node to display.
   */
  optional: PropTypes.node,
  /**
   * @ignore
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  showTitle: PropTypes.bool,
  iconId: PropTypes.any,
};

StepLabel.defaultProps = {
  active: false,
  alternativeLabel: false,
  completed: false,
  disabled: false,
  error: false,
  last: false,
  orientation: 'horizontal',
  showTitle: false,
};

export default StepLabel;
