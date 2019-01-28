import React from 'react';
import PropTypes from 'prop-types';

import { CustomCheckboxInput, MetadataInfo } from '../../Styled';

const TableFilter = ({
    handleChangeCheckbox,
    checkboxInputValues,
}) => (
  <div>
    <MetadataInfo>
      <span>
        <CustomCheckboxInput
          type="checkbox"
          onChange={handleChangeCheckbox}
          name="name"
          checked={checkboxInputValues.name}
        />
      </span>
      <span> = </span>
      <span>ZONE NAME</span>
    </MetadataInfo>
    <MetadataInfo>
      <span>
        <CustomCheckboxInput
          type="checkbox"
          onChange={handleChangeCheckbox}
          name="area"
          checked={checkboxInputValues.area}
        />
      </span>
      <span> = </span>
      <span>TOTAL SF</span>
    </MetadataInfo>
    <MetadataInfo>
      <span>
        <CustomCheckboxInput
          type="checkbox"
          onChange={handleChangeCheckbox}
          name="pci"
          checked={checkboxInputValues.pci}
        />
      </span>
      <span> = </span>
      <span>PCI</span>
    </MetadataInfo>
    <MetadataInfo>
      <span>
        <CustomCheckboxInput
          type="checkbox"
          onChange={handleChangeCheckbox}
          name="surfaceType"
          checked={checkboxInputValues.surfaceType}
        />
      </span>
      <span> = </span>
      <span>SURFACE TYPE</span>
    </MetadataInfo>
    <MetadataInfo>
      <span>
        <CustomCheckboxInput
          type="checkbox"
          onChange={handleChangeCheckbox}
          name="trafficType"
          checked={checkboxInputValues.trafficType}
        />
      </span>
      <span> = </span>
      <span>TRAFFIC TYPE </span>
    </MetadataInfo>
  </div>
    );

TableFilter.propTypes = {
  handleChangeCheckbox: PropTypes.func,
  checkboxInputValues: PropTypes.any,
};

export default TableFilter;
