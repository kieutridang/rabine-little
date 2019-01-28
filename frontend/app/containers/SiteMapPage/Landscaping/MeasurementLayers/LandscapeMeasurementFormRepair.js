import React from 'react';
import PropTypes from 'prop-types';

import FormRow from '../../SidebarStyledComponents/FormRow';
import FormColumn from '../../SidebarStyledComponents/FormColumn';
import FormLabel from '../../SidebarStyledComponents/FormLabel';
import { FormSelect, FormattedDollarInput, ErrorMessage, FormInput } from '../../SidebarStyledComponents/FormInput';
import FormRowContent from '../../SidebarStyledComponents/FormRowContent';
import { FormButton } from '../../SidebarStyledComponents/FormButton';
import { repairTypes, typeOfRepair } from './options';
import { StyledColorPicker } from '../../Popup/styled/StyledColorPicker';
import { createColorCircles } from '../../Popup/styled/StyledColorCircle';

const LandscapeMeasurementFormRepair = ({
  areaSqFeet,
  perimeterFeet,
  handleChangeValue,
  formValues,
  handleSubmit,
  layers,
  zoneLayers,
  formError,
  deletePolygon,
  scalePolygon,
  editPolygon,
  subtractPolygon,
  layerType,
  featureId,
  handleChangeColor,
}) => (
  <React.Fragment>
    <FormRow lrMargin>
      <FormColumn hasMargin>
        <FormLabel>REPAIR NAME</FormLabel>
        <FormSelect
          name="repairType"
          onChange={handleChangeValue}
          value={formValues.repairType.value}
        >
          <option value={''}>Select Type</option>
          { repairTypes.map((repair) => <option key={repair.id} value={repair.name}> {repair.name} </option>) }
        </FormSelect>
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
          { layers.map((layer) => <option key={layer._id} value={layer._id}> {layer.name} </option>)}
        </FormSelect>
      </FormColumn>
      <FormColumn hasMargin >
        <FormLabel>TYPE OF REPAIR</FormLabel>
        <FormSelect
          name="typeOfRepair"
          onChange={handleChangeValue}
          value={formValues.typeOfRepair.value}
        >
          <option value=""> Select Repair Type</option>
          { typeOfRepair.map((type) => <option key={type.name} value={type.name}> {type.name} </option>)}
        </FormSelect>
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn hasMargin>
        <FormLabel>COST</FormLabel>
        <FormattedDollarInput
          name="repairCost"
          onChange={handleChangeValue}
          value={formValues.repairCost.value}
        />
      </FormColumn>
      <FormColumn hasMargin>
        <FormLabel>ZONE</FormLabel>
        <FormSelect
          name="zoneId"
          onChange={handleChangeValue}
          value={formValues.zoneId.value}
        >
          <option value=""> Select Zone </option>
          { zoneLayers.map((layer) => <option key={layer._id} value={layer._id}> {layer.name} </option>) }
        </FormSelect>
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
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


LandscapeMeasurementFormRepair.propTypes = {
  areaSqFeet: PropTypes.string,
  perimeterFeet: PropTypes.string,
  handleChangeValue: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  zoneLayers: PropTypes.array.isRequired,
  formError: PropTypes.string,
  deletePolygon: PropTypes.func.isRequired,
  scalePolygon: PropTypes.func.isRequired,
  editPolygon: PropTypes.func.isRequired,
  subtractPolygon: PropTypes.func.isRequired,
  layerType: PropTypes.string,
  featureId: PropTypes.string,
  handleChangeColor: PropTypes.func.isRequired,
};

export default LandscapeMeasurementFormRepair;
