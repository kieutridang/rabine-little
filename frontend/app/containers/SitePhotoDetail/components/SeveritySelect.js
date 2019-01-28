import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLevel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  margin-top: 0.5rem;
  height: 2.0rem;

  border-radius: 3px;

  background-color: ${(props) => (props.selected ? props.color : 'hsla(0, 0%, 50%, 0.4)')};
  cursor: pointer;
  text-align: center;
  font-size: 15px;
  font-weight: ${(props) => (props.selected ? 800 : 400)};

  color: white;

  &:first-of-type {
    margin-left: 0;
  }
`;

const StyledLevelWrapper = styled.div`
  width: 100%;
`;

const Level = ({ value, color, selected, onSetSeverity }) => {
  const handleSelect = () => {
    onSetSeverity(value);
  };

  return (
    <StyledLevel color={color} selected={selected} onClick={handleSelect}>
      { value }
    </StyledLevel>
  );
};

Level.propTypes = {
  value: PropTypes.string,
  color: PropTypes.string,
  selected: PropTypes.bool,
  onSetSeverity: PropTypes.func,
};

const severityLevel = [
  { values: ['Minimal', 'Good'], color: '#5a9645' },
  { values: ['Moderate', 'Attention'], color: '#d1a94f' },
  { values: ['Severe'], color: '#8d3030' },
];

const SeveritySelect = ({ onSetSeverity, severity }) => (
  <StyledLevelWrapper>
    {
      severityLevel.map((level) => {
        const { values, color } = level;
        const value = values[0];
        const selected = values.includes(severity);

        return (
          <Level
            key={value}
            value={value}
            selected={selected}
            color={color}
            onSetSeverity={onSetSeverity}
          />
        );
      })}
  </StyledLevelWrapper>
);

SeveritySelect.propTypes = {
  severity: PropTypes.string,
  onSetSeverity: PropTypes.func,
};

export default SeveritySelect;
