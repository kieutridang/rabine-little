import React from 'react';
import PropTypes from 'prop-types';

import FormRow from '../../SidebarStyledComponents/FormRow';
import FormColumn from '../../SidebarStyledComponents/FormColumn';
import FormLabel from '../../SidebarStyledComponents/FormLabel';
import { FormSelect, ErrorMessage } from '../../SidebarStyledComponents/FormInput';
import FormRowContent from '../../SidebarStyledComponents/FormRowContent';
import { FormButton } from '../../SidebarStyledComponents/FormButton';
import { ZoneTypeOptions, roofRatingOptions } from './options';
import { options as ZoneNameOptions } from '../../Popup/options';

const RoofingMeasurementFormZone = ({
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
}) => (
  <React.Fragment>
    <FormRow lrMargin>
      <FormColumn hasMargin>
        <FormLabel>ZONE MAP</FormLabel>
        <FormSelect
          name="layerId"
          onChange={handleChangeValue}
          value={formValues.layerId.value}
        >
          <option value={''}>Choose a Zone Map</option>
          { layers.map((layer) => <option key={layer._id} value={layer._id}> {layer.name}</option>)}
        </FormSelect>
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn hasMargin>
        <FormLabel>ZONE NAME</FormLabel>
        <FormSelect
          name="zoneName"
          onChange={handleChangeValue}
          value={formValues.zoneName.value}
        >
          { ZoneNameOptions.map((item) => <option key={item.value} value={item.value}>{item.value}</option>)}
        </FormSelect>
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormColumn hasMargin>
        <FormLabel>ZONE TYPE</FormLabel>
        <FormSelect
          name="zoneType"
          onChange={handleChangeValue}
          value={formValues.zoneType.value}
        >
          <option value={null}>Select Type</option>
          { ZoneTypeOptions.map((unit) => <option key={unit.value} value={unit.value}> {unit.value} </option>) }
        </FormSelect>
      </FormColumn>
    </FormRow>
    { formValues.zoneType.value &&
    ZoneTypeOptions.find((type) => type.value === formValues.zoneType.value) &&
    (ZoneTypeOptions.find((type) => type.value === formValues.zoneType.value)).subset.length > 0 && (
      <FormRow lrMargin>
        <FormColumn hasMargin>
          <FormLabel>ZONE SUB TYPE</FormLabel>
          <FormSelect
            name="zoneSubType"
            onChange={handleChangeValue}
            value={formValues.zoneSubType.value}
          >
            <option value={''}>Select Sub Type</option>
            { (ZoneTypeOptions.find((type) => type.value === formValues.zoneType.value)).subset.map((subset) => <option key={subset.value} value={subset.value}> {subset.value} </option>) }
          </FormSelect>
        </FormColumn>
      </FormRow>
    )}
    <FormRow lrMargin>
      <FormColumn hasMargin>
        <FormLabel>ROOF RATING</FormLabel>
        <FormSelect
          name="rating"
          onChange={handleChangeValue}
          value={formValues.rating.value}
        >
          <option value="">Select a Rating</option>
          { roofRatingOptions.map((rate) => <option key={rate} value={rate}>{rate}</option>) }
        </FormSelect>
      </FormColumn>
    </FormRow>
    <FormRow lrMargin>
      <FormLabel fontSize="0.75rem">Area:</FormLabel>
      <FormRowContent noMargin>{areaSqFeet} SF</FormRowContent>
    </FormRow>
    <FormRow lrMargin>
      <FormLabel fontSize="0.75rem">Perimeter:</FormLabel>
      <FormRowContent noMargin>{perimeterFeet} FT</FormRowContent>
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


RoofingMeasurementFormZone.propTypes = {
  areaSqFeet: PropTypes.string,
  perimeterFeet: PropTypes.string,
  handleChangeValue: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  formError: PropTypes.string,
  layerType: PropTypes.any,
  featureId: PropTypes.string,
  deletePolygon: PropTypes.func,
  editPolygon: PropTypes.func.isRequired,
  scalePolygon: PropTypes.func.isRequired,
  subtractPolygon: PropTypes.func.isRequired,
};

export default RoofingMeasurementFormZone;
