import React from 'react';
import PropTypes from 'prop-types';

import FormRow from '../../SidebarStyledComponents/FormRow';
import FormColumn from '../../SidebarStyledComponents/FormColumn';
import FormLabel from '../../SidebarStyledComponents/FormLabel';
import { FormSelect, ErrorMessage } from '../../SidebarStyledComponents/FormInput';
import FormRowContent from '../../SidebarStyledComponents/FormRowContent';
import { FormButton } from '../../SidebarStyledComponents/FormButton';
import { ZoneTypes } from './options';
import { options as ZoneNameOptions } from '../../Popup/options';

const LandscapeMeasurementFormZone = ({
  areaSqFeet,
  perimeterFeet,
  handleChangeValue,
  formValues,
  handleSubmit,
  layers,
  formError,
  deletePolygon,
  scalePolygon,
  editPolygon,
  subtractPolygon,
  layerType,
  featureId,
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
        <FormLabel>CATEGORY</FormLabel>
        <FormSelect
          name="zoneType"
          onChange={handleChangeValue}
          value={formValues.zoneType.value}
        >
          <option value={''}>Select Type</option>
          { ZoneTypes.map((zone) => <option key={zone.id} value={zone.name}> {zone.name} </option>) }
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


LandscapeMeasurementFormZone.propTypes = {
  areaSqFeet: PropTypes.string,
  perimeterFeet: PropTypes.string,
  handleChangeValue: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  formError: PropTypes.string,
  deletePolygon: PropTypes.func.isRequired,
  scalePolygon: PropTypes.func.isRequired,
  editPolygon: PropTypes.func.isRequired,
  subtractPolygon: PropTypes.func.isRequired,
  featureId: PropTypes.string,
  layerType: PropTypes.string,
};

export default LandscapeMeasurementFormZone;
