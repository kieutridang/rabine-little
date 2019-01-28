import React from 'react';
import PropTypes from 'prop-types';

import Helper from './Helper';
import FormRow from '../SidebarStyledComponents/FormRow';
import FormColumn from '../SidebarStyledComponents/FormColumn';
import FormLabel from '../SidebarStyledComponents/FormLabel';
import { FormInput, FormattedDollarInput, FormattedPercentageInput } from '../SidebarStyledComponents/FormInput';

const InventoryCostFields = ({
  handleChangeValue,
  formValues,
  handleTouchValue,
}) => (
  <Helper>
    <FormRow lrMargin>
      <FormColumn hasMargin>
        <FormLabel>DRIG INSTALL COST</FormLabel>
        <FormattedDollarInput
          name="drigInstallCost"
          placeholder="Enter Cost"
          onChange={handleChangeValue}
          value={formValues.drigInstallCost.value}
          onFocus={handleTouchValue}
        />
      </FormColumn>
      <FormColumn hasMargin>
        <FormLabel>CURRENT UNIT COST</FormLabel>
        <FormattedDollarInput
          name="currentUnitCost"
          placeholder="Enter Cost"
          onChange={handleChangeValue}
          value={formValues.currentUnitCost.value}
          onFocus={handleTouchValue}
        />
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn>
        <FormLabel>PER UNIT BUDGET SCORE (PUB SCORE)</FormLabel>
        <FormattedPercentageInput
          name="pubScore"
          placeholder="Enter PUB Score"
          onChange={handleChangeValue}
          value={formValues.pubScore.value}
          onFocus={handleTouchValue}
        />
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn>
        <FormLabel>INVOICE</FormLabel>
        <FormInput
          type="text"
          name="invoice"
          placeholder="Select Invoice"
          onChange={handleChangeValue}
          value={formValues.invoice.value}
          onFocus={handleTouchValue}
        />
      </FormColumn>
    </FormRow>
  </Helper>
);


InventoryCostFields.propTypes = {
  handleChangeValue: PropTypes.func,
  handleTouchValue: PropTypes.func,
  formValues: PropTypes.object,
};

export default InventoryCostFields;
