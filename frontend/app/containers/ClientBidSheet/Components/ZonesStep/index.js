import React from 'react';
import PropTypes from 'prop-types';
import {
    ZoneContainer,
    TextInputsContainer,
    TableFilterContainer,
    Subtitle,
} from './styled';

import TextInputs from './TextInputs';
import TableFilter from './TableFilter';

const zonesStep = ({
    handleChangeText,
    inputValues,
    handleChangeCheckbox,
    checkboxInputValues,
}) => (
  <ZoneContainer>
    <TextInputsContainer>
      <TextInputs
        handleChangeText={handleChangeText}
        inputValues={inputValues}
      />
    </TextInputsContainer>
    <TableFilterContainer>
      <Subtitle >table fields</Subtitle>
      <TableFilter
        handleChangeCheckbox={handleChangeCheckbox}
        checkboxInputValues={checkboxInputValues}
      />
    </TableFilterContainer>
  </ZoneContainer>
    );

zonesStep.propTypes = {
  handleChangeCheckbox: PropTypes.func,
  checkboxInputValues: PropTypes.any,
  handleChangeText: PropTypes.func,
  inputValues: PropTypes.any,
};

export default zonesStep;
