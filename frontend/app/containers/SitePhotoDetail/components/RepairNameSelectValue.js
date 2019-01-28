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
`;

const StyledOptionTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  vertical-align: middle;

  span {
    font-size: 11px;
    font-weight: 400;
  }
`;

const RepairNameSelectValue = ({ value }) => value ? (
  <div className="Select-value" title={value.display.title}>
    <span className="Select-value-label">
      <StyledOption>
        <StyledOptionWrapper>
          <StyledOptionTitle>
            {value.display.title} <span>({value.display.zone})</span>
          </StyledOptionTitle>
        </StyledOptionWrapper>
      </StyledOption>
    </span>
  </div>
  ) : null;

RepairNameSelectValue.propTypes = {
  value: PropTypes.object,
};

export default RepairNameSelectValue;
