import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledOptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledOption = styled.div`
  width: 100%;
  border-bottom: solid 1px hsla(0, 0%, 24%, 0.1);
`;

const StyledOptionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;

  span {
    font-size: 11px;
    font-weight: 400;
  }
`;

const StyledOptionYear = styled.div`
  font-size: 11px;
  font-weight: 400;
`;

class RepairNameSelectOption extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    isFocused: PropTypes.bool,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    option: PropTypes.object,
    children: PropTypes.node,
  };

  handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }

  handleMouseEnter = (event) => {
    this.props.onFocus(this.props.option, event);
  }

  handleMouseMove = (event) => {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  }

  render() {
    const { className, option, children } = this.props;
    const { value, display } = option;
    return (
      <StyledOption
        className={className}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={value}
        role="presentation"
      >
        {
          display &&
          (
            <StyledOptionWrapper>
              <StyledOptionTitle>
                {children} <span>({display.zone})</span>
              </StyledOptionTitle>
              <StyledOptionYear>
                ({display.year})
              </StyledOptionYear>
            </StyledOptionWrapper>
          )
        }
      </StyledOption>
    );
  }
}

export default RepairNameSelectOption;
