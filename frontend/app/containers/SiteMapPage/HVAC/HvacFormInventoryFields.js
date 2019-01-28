import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'components/Date/RabineDatePicker';
import moment from 'moment';

import Helper from './Helper';
import FormRow from '../SidebarStyledComponents/FormRow';
import FormColumn from '../SidebarStyledComponents/FormColumn';
import FormLabel from '../SidebarStyledComponents/FormLabel';
import { FormInput, FormSelect } from '../SidebarStyledComponents/FormInput';
import { FormDatePickerWrapper } from '../SidebarStyledComponents/FormDatePicker';
import { unitTypes } from './opts';

const InventoryFields = ({
  handleChangeValue,
  handleTouchValue,
  handleChangeManufactureDate,
  formValues,
}) => (
  <Helper>
    <FormRow lrMargin>
      <FormColumn>
        <FormLabel>UNIT NUMBER</FormLabel>
        <FormInput
          type="text"
          name="unitNumber"
          placeholder="Enter Unit Number"
          onChange={handleChangeValue}
          onFocus={handleTouchValue}
          value={formValues.unitNumber.value}
        />
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn>
        <FormLabel>TYPE OF UNIT</FormLabel>
        <FormSelect
          name="unitType"
          onChange={handleChangeValue}
          value={formValues.unitType.value}
          onFocus={handleTouchValue}
        >
          <option value={''}>Select Unit Type</option>
          { unitTypes.map((unit) => <option key={unit.id} value={JSON.stringify(unit)}> {unit.value} </option>) }
        </FormSelect>
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn>
        <FormLabel>MODEL NUMBER</FormLabel>
        <FormInput
          type="number"
          name="modelNumber"
          placeholder="Enter Model Number"
          value={formValues.modelNumber.value}
          onChange={handleChangeValue}
          onFocus={handleTouchValue}
        />
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn>
        <FormLabel>SERIAL NUMBER</FormLabel>
        <FormInput
          type="number"
          name="serialNumber"
          placeholder="Enter Serial Number"
          value={formValues.serialNumber.value}
          onChange={handleChangeValue}
          onFocus={handleTouchValue}
        />
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn>
        <FormLabel>MANUFACTURE DATE</FormLabel>
        <FormDatePickerWrapper>
          <DatePicker
            date={formValues.manufactureDate.value ? moment(formValues.manufactureDate.value) : null}
            id="manufactureDate"
            displayFormat="YYYY-MM-DD"
            onDateChange={handleChangeManufactureDate}
            onFocus={handleTouchValue}
            required
          />
        </FormDatePickerWrapper>
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn>
        <FormLabel>UNIT TONNAGE</FormLabel>
        <FormInput
          type="number"
          name="unitTonnage"
          placeholder="Enter Unit Number"
          onChange={handleChangeValue}
          value={formValues.unitTonnage.value}
          onFocus={handleTouchValue}
        />
      </FormColumn>
    </FormRow>
  </Helper>
);

InventoryFields.propTypes = {
  handleChangeValue: PropTypes.func,
  handleTouchValue: PropTypes.func,
  formValues: PropTypes.object,
  handleChangeManufactureDate: PropTypes.func,
};

export default InventoryFields;
