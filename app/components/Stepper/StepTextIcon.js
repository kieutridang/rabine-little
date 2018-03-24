import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SvgIcon from '../Icon/SvgIcon';

const StyledText = styled.text`
  display: block;
  fill: #373737;
  font-size: 14px;
  color: white;
`;

const StepTextIcon = (props) => {
  const {
    text,
    active,
    color,
  } = props;

  return (
    <SvgIcon
      color={color}
      active={active}
    >
      <circle cx="12" cy="12" r="12" />
      <StyledText
        x="12"
        y="16"
        textAnchor="middle"
      >
        {text}
      </StyledText>
    </SvgIcon>
  );
};

StepTextIcon.propTypes = {
  text: PropTypes.any,
  active: PropTypes.bool,
  color: PropTypes.string,
};

export default StepTextIcon;
