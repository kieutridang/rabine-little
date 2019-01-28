import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Input,
    InputWrap,
 } from '../OverviewStep/Inputs/styled';

import {
    RepairContainer,
    InputContainer,
    TableFilterContainer,
    Subtitle,
} from './styled';

import {
    CustomCheckboxInput,
    MetadataInfo,
} from '../Styled';


const repairStep = ({
    handleChangeCheckbox,
    checkboxInputValues,
    handleChangeText,
    inputValues,
}) => (
  <RepairContainer>
    <InputContainer>
      <Form>
        <InputWrap>
          <label htmlFor="text5">
            <span> Text 1 </span>
            <Input
              name="text5"
              id="text5"
              type="text"
              placeholder={'Repair Map'}
              onChange={handleChangeText}
              value={inputValues.text5}
            />
          </label>
        </InputWrap>
      </Form>
    </InputContainer>
    <TableFilterContainer>
      <Subtitle>Table Fields</Subtitle>
      <MetadataInfo>
        <span>
          <CustomCheckboxInput
            type="checkbox"
            name="repair"
            onChange={handleChangeCheckbox}
            checked={checkboxInputValues.repair}
          />
        </span>
        <span> = </span>
        <span> Repair scope </span>
      </MetadataInfo>
      <MetadataInfo>
        <span>
          <CustomCheckboxInput
            type="checkbox"
            name="type"
            onChange={handleChangeCheckbox}
            checked={checkboxInputValues.type}
          />
        </span>
        <span> = </span>
        <span> type of repair </span>
      </MetadataInfo>
      <MetadataInfo>
        <span>
          <CustomCheckboxInput
            type="checkbox"
            name="qty"
            onChange={handleChangeCheckbox}
            checked={checkboxInputValues.qty}
          />
        </span>
        <span> = </span>
        <span> qty </span>
      </MetadataInfo>
      <MetadataInfo>
        <span>
          <CustomCheckboxInput
            type="checkbox"
            name="units"
            onChange={handleChangeCheckbox}
            checked={checkboxInputValues.units}
          />
        </span>
        <span> = </span>
        <span> units </span>
      </MetadataInfo>
      <MetadataInfo>
        <span>
          <CustomCheckboxInput
            type="checkbox"
            name="unitPrice"
            onChange={handleChangeCheckbox}
            checked={checkboxInputValues.unitPrice}
          />
        </span>
        <span> = </span>
        <span> unit price </span>
      </MetadataInfo>
      <MetadataInfo>
        <span>
          <CustomCheckboxInput
            type="checkbox"
            name="total"
            onChange={handleChangeCheckbox}
            checked={checkboxInputValues.total}
          />
        </span>
        <span> = </span>
        <span>Total </span>
      </MetadataInfo>
      <MetadataInfo>
        <span>
          <CustomCheckboxInput
            type="checkbox"
            name="zone"
            onChange={handleChangeCheckbox}
            checked={checkboxInputValues.zone}
          />
        </span>
        <span> = </span>
        <span> zone </span>
      </MetadataInfo>
    </TableFilterContainer>
  </RepairContainer>
    );

repairStep.propTypes = {
  handleChangeCheckbox: PropTypes.func,
  checkboxInputValues: PropTypes.any,
  handleChangeText: PropTypes.func,
  inputValues: PropTypes.any,
};

export default repairStep;
