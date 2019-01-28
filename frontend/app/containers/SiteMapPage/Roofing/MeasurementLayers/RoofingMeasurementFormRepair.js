import React from 'react';
import PropTypes from 'prop-types';

import FormRow from '../../SidebarStyledComponents/FormRow';
import FormColumn from '../../SidebarStyledComponents/FormColumn';
import FormLabel from '../../SidebarStyledComponents/FormLabel';
import { FormSelect, FormattedDollarInput, ErrorMessage, FormInput } from '../../SidebarStyledComponents/FormInput';
import FormRowContent from '../../SidebarStyledComponents/FormRowContent';
import { FormButton } from '../../SidebarStyledComponents/FormButton';
import { RepairTypeOptions, TypeOfRepairOptions, DefectTypeOptions } from './options';
import { StyledColorPicker } from '../../Popup/styled/StyledColorPicker';
import { createColorCircles } from '../../Popup/styled/StyledColorCircle';
import Options from '../../../../components/Options';


const getRepairTypeOptions = (title) => {
  const input = title.trim().toLowerCase();
  const filtered = !input ? [] :
    RepairTypeOptions.filter(({ value }) => value && input && value.toLowerCase().includes(input));

  const sorted = filtered.sort((a, b) => a.value > b.value);
  return sorted;
};

const renderZonePolygonOptGroup = ({ layerName, list }) =>
  list.map((item) => {
    const options = item.grouped.map((zone, index) =>
      <option key={zone._id} value={zone._id}>{zone.title}.0{index + 1}</option>
    );
    const label = `${layerName} - ${item.groupTitle}`;
    return (
      <optgroup label={label}>
        {options}
      </optgroup>
    );
  });

const RoofingMeasurementFormRepair = ({
  areaSqFeet,
  perimeterFeet,
  handleChangeValue,
  formValues,
  handleSubmit,
  layers,
  formError,
  layerType,
  featureId,
  deletePolygon,
  editPolygon,
  scalePolygon,
  subtractPolygon,
  handleChangeRepairTypeValue,
  zonePolygons,
  handleChangeColor,
}) => (
  <React.Fragment>
    <FormRow lrMargin>
      <FormColumn hasMargin>
        <FormLabel>REPAIR TYPE</FormLabel>
        <FormInput
          name="repairType"
          onChange={handleChangeValue}
          value={formValues.repairType.value}
          placeholder="Enter Repair Type"
        />
        <Options
          value={formValues.repairType.value}
          getOptions={getRepairTypeOptions}
          onSelectOption={handleChangeRepairTypeValue}
        />
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormLabel fontSize="0.75rem">Color:</FormLabel>
      <FormRowContent>
        { createColorCircles(handleChangeColor, formValues.color.value) }
        {
          <StyledColorPicker
            color={formValues.color.value}
            onChange={handleChangeColor}
            enableAlpha={false}
          />
        }
      </FormRowContent>
    </FormRow>
    <FormRow lrMargin>
      <FormLabel fontSize="0.75rem">Area:</FormLabel>
      <FormRowContent noMargin>{areaSqFeet} SF</FormRowContent>
    </FormRow>
    <FormRow lrMargin>
      <FormLabel fontSize="0.75rem">Perimeter:</FormLabel>
      <FormRowContent noMargin>{perimeterFeet} FT</FormRowContent>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn hasMargin>
        <FormLabel>YEAR</FormLabel>
        <FormSelect
          name="layerId"
          onChange={handleChangeValue}
          value={formValues.layerId.value}
        >
          <option value=""> Select Year </option>
          { layers.map((layer) => <option key={JSON.stringify(layer)} value={layer._id}> {layer.name} </option>)}
        </FormSelect>
      </FormColumn>
      <FormColumn hasMargin >
        <FormLabel>TYPE OF REPAIR</FormLabel>
        <FormSelect
          name="typeOfRepair"
          onChange={handleChangeValue}
          value={formValues.typeOfRepair.value}
        >
          <option value=""> Select Repair Type </option>
          { TypeOfRepairOptions.map((type) => <option key={type.value} value={type.value}> {type.value} </option>)}
        </FormSelect>
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn hasMargin>
        <FormLabel>DEFECT TYPE</FormLabel>
        <FormSelect
          name="defectType"
          onChange={handleChangeValue}
          value={formValues.defectType.value}
        >
          <option value="">Select Defect</option>
          { DefectTypeOptions.map((defect) => <option value={defect.value} key={defect.value} > {defect.value} </option>)}
        </FormSelect>
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn hasMargin>
        <FormLabel>COST</FormLabel>
        <FormattedDollarInput
          name="repairCost"
          placeholder="Enter Cost"
          onChange={handleChangeValue}
          value={formValues.repairCost.value}
        />
      </FormColumn>
      <FormColumn hasMargin>
        <FormLabel>PATCH NUMBER</FormLabel>
        <FormInput
          name="patchNumber"
          onChange={handleChangeValue}
          value={formValues.patchNumber.value}
          placeholder="Enter Patch Number (Optional)"
        />
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      {
          zonePolygons.length === 0 && <span>No zones found…</span>
        }
      {
          zonePolygons.length > 0 &&
          (
            <FormColumn>
              <FormLabel labelColumn>ZONE</FormLabel>
              <FormSelect
                name="zoneId"
                value={formValues.zoneId.value}
                onChange={handleChangeValue}
              >
                <option>Choose a zone</option>
                {zonePolygons.map(renderZonePolygonOptGroup)}
              </FormSelect>
            </FormColumn>
          )
        }
    </FormRow>
    <ErrorMessage>{ formError }</ErrorMessage>
    <FormRow lrMargin>
      <FormButton fullWidth height="2.5rem" onClick={subtractPolygon(featureId, layerType)} className="secondary"> Subtract </FormButton>
      <FormButton fullWidth height="2.5rem" onClick={editPolygon(featureId, layerType)} className="secondary"> Edit </FormButton>
      <FormButton fullWidth height="2.5rem" onClick={scalePolygon(featureId, layerType)} className="secondary"> Scale </FormButton>
      <FormButton fullWidth height="2.5rem" onClick={deletePolygon(featureId, layerType)} className="secondary"> Delete </FormButton>
      <FormButton fullWidth height="2.5rem" onClick={handleSubmit}> Save </FormButton>
    </FormRow>
  </React.Fragment>
);


RoofingMeasurementFormRepair.propTypes = {
  areaSqFeet: PropTypes.string,
  perimeterFeet: PropTypes.string,
  handleChangeValue: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  formError: PropTypes.string,
  layerType: PropTypes.string,
  featureId: PropTypes.string.isRequired,
  deletePolygon: PropTypes.func.isRequired,
  editPolygon: PropTypes.func.isRequired,
  scalePolygon: PropTypes.func.isRequired,
  subtractPolygon: PropTypes.func.isRequired,
  handleChangeRepairTypeValue: PropTypes.func.isRequired,
  zonePolygons: PropTypes.array,
  handleChangeColor: PropTypes.func.isRequired,
};

export default RoofingMeasurementFormRepair;
