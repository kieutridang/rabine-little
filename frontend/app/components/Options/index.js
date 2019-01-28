import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const StyledOptions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000000000;

  margin-top: 0.1rem;

  max-height: 270px;
  overflow-y: auto;

  background: hsla(0, 0%, 100%, 0.97);
  -webkit-backdrop-filter: saturate(150%) blur(5px);
  border-radius: 0 0 4px 4px;
  box-shadow: 0 0 4px hsla(0, 0%, 20%, 0.18);

  opacity: 0;
  visibility: hidden;
  transform: translateY(4px) scaleY(0.97);
  transform-origin: 50% 0;

  transition: all 120ms ease;

  &.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scaleY(1);
  }
`;

export const StyledOption = styled.div`
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  transition: all 120ms ease;
  font-size: 0.9325rem;
  color: black;
  z-index: 1000000000;

  &:hover {
    background: hsla(0, 0%, 96%, 1.0);
    opacity: 0.8;
  }

  &.active {
    background: hsla(4, 70%, 52%, 1.0);
  }

  & + div {
    border-top: 1px solid hsla(0, 0%, 95%, 1.0);
  }
`;

const Options = ({ value, getOptions, onSelectOption }) => {
  const renderOptions = () =>
    getOptions(value).map((option) => (
      <StyledOption
        key={`${option.value}`}
        className={value === option.value && 'active'}
        onClick={() => onSelectOption(option.value)}
        tabindex="0"
      >
        {option.text || option.value}
      </StyledOption>
    ));
  return (
    <StyledOptions>
      {renderOptions()}
    </StyledOptions>
  );
};

Options.propTypes = {
  value: PropTypes.string,
  getOptions: PropTypes.func,
  onSelectOption: PropTypes.func,
};

export default Options;
