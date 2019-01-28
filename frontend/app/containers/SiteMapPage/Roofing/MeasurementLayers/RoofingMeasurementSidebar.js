import React from 'react';
import { push as SideBarMenu } from 'react-burger-menu';
import PropTypes from 'prop-types';
import { Tab, TabList, TabPanel } from 'react-tabs';
import cloneDeep from 'lodash/cloneDeep';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

import RoofingMeasurementFormZone from './RoofingMeasurementFormZone';
import RoofingMeasurementFormRepair from './RoofingMeasurementFormRepair';
import SideBarStyles from '../../SidebarStyledComponents/SideBarStyles';
import Tabs from '../../SidebarStyledComponents/StyledTabWrapper';
import { toFeet } from '../../../../utils/number/numberUtils';
import { MEASUREMENT_LAYER_ROOFING_ZONE, MEASUREMENT_LAYER_ROOFING_REPAIR } from '../../constants';
import { options } from '../../Popup/options';

const ZoneRequiredFields = ['zoneName', 'layerId'];
const RepairRequiredFields = ['repairType'];

class RoofingMeasurementLayerSidebar extends React.Component {
  state = initialState;

  componentWillMount() {
    if (this.props.feature.type === 'repair') {
      const {
        layerId,
        defectType,
        repairCost,
        repairType,
        typeOfRepair,
        patchNumber,
        zoneId,
        title,
        color,
      } = cloneDeep(this.props.feature);

      this.setState({
        formRepair: {
          layerId: { value: layerId || '', valid: true },
          defectType: { value: defectType || '', valid: true },
          repairCost: { value: repairCost || '', valid: true },
          repairType: { value: title || repairType || '', valid: true },
          typeOfRepair: { value: typeOfRepair || '', valid: true },
          patchNumber: { value: patchNumber || '', valid: true },
          zoneId: { value: zoneId || '', valid: true },
          color: { value: color || '#FF7077', valid: true },
        },
        formRepairLoaded: true,
      });
    } else if (this.props.feature.type === 'zone') {
      const { layerId, zoneName, zoneSubType, zoneType, rating } = cloneDeep(this.props.feature);

      this.setState({
        formZone: {
          layerId: { value: layerId || '', valid: true },
          zoneName: { value: zoneName || '', valid: true },
          zoneSubType: { value: zoneSubType || '', valid: true },
          zoneType: { value: zoneType || '', valid: true },
          rating: { value: rating || '', valid: true },
        },
        formZoneLoaded: true,
      });
    }
  }

  onStateChange = () => {
    this.handleCloseEditPopup();
  };

  getZonePolygons = (layers, features) => {
    const zones = [...features].filter((f) =>
      f.title && f.title.includes('Zone') && !f.title.includes('(duplicated)')
    ).map((feature, index) => ({
      ...feature,
      index: typeof feature.index === 'undefined' ? index : feature.index,
    }));

    const sorted = sortBy(zones, 'index');
    const groupedByLayers = groupBy(sorted, (f) => {
      const layer = find(layers, (one) => one._id === f.layerId);
      const layerName = layer && layer.name ? layer.name : '';
      return layerName;
    });

    const list = Object.keys(groupedByLayers).map((layerName) => {
      const group = groupedByLayers[layerName];
      const groupedByZones = groupBy(group, (f) => f.title);
      const mapped = Object.keys(groupedByZones).map((groupTitle) => {
        const grouped = groupedByZones[groupTitle];
        return {
          groupTitle,
          grouped,
        };
      });

      return {
        layerName,
        list: mapped,
      };
    });

    return list;
  };

  handleCloseEditPopup = () => {
    const { closeEditPopup, layerType /* featureId */ } = this.props;
    if (layerType) {
      closeEditPopup(null);
    }
  };

  handleChangeZoneValue = (e) => {
    const clonedForm = cloneDeep(this.state.formZone);
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    clonedForm[fieldName].value = fieldValue;

    if (fieldName !== 'zoneSubType') {
      clonedForm[fieldName].valid = this.checkRequiredFieldValidity(fieldName, fieldValue, ZoneRequiredFields);
    }

    this.setState({ formZone: clonedForm });
  };

  handleSubmitFormZone = () => {
    const { saveEditData, featureId } = this.props;
    const { formZoneLoaded } = this.state;
    const clonedForm = cloneDeep(this.state.formZone);
    const isValid = this.checkFormValidity(clonedForm);

    if (isValid) {
      const values = this.convertFormToSingleValue(clonedForm);
      values.title = values.zoneName;

      if (values.zoneName) {
        const mappedOption = options.find((option) => option.value === values.zoneName);

        if (mappedOption) {
          values.color = mappedOption.color;
        }
      }
      saveEditData('zone', featureId, values, MEASUREMENT_LAYER_ROOFING_ZONE);

      if (!formZoneLoaded) {
        this.setState(initialState);
      }
    } else {
      this.setState({ formZoneError: 'Please fill all required fields (Map, Name).' });
    }
  };

  handleChangeRepairColor = (e) => {
    const clonedForm = cloneDeep(this.state.formRepair);
    clonedForm.color.value = e.color;
    this.setState({ formRepair: clonedForm });
  }

  handleChangeRepairValue = (e) => {
    const clonedForm = cloneDeep(this.state.formRepair);
    const fieldName = e.target.name;
    let fieldValue;

    if (e.target.rawValue) {
      fieldValue = e.target.rawValue.substr(1);
    } else {
      fieldValue = e.target.value;
    }

    clonedForm[fieldName].value = fieldValue;
    if (fieldName !== 'patchNumber') {
      clonedForm[fieldName].valid = this.checkRequiredFieldValidity(fieldName, fieldValue, RepairRequiredFields);
    }

    this.setState({ formRepair: clonedForm });
  };

  handleChangeRepairTypeValue = (value) => {
    const clonedForm = cloneDeep(this.state.formRepair);
    clonedForm.repairType.value = value;

    this.setState({ formRepair: clonedForm });
  };

  handleSubmitFormRepair = () => {
    const { saveEditData, featureId } = this.props;
    const { formRepairLoaded } = this.state;
    const clonedForm = cloneDeep(this.state.formRepair);
    const isValid = this.checkFormValidity(clonedForm);

    if (isValid) {
      const values = this.convertFormToSingleValue(clonedForm);
      values.title = values.repairType;
      saveEditData('repair', featureId, values, MEASUREMENT_LAYER_ROOFING_REPAIR);
      if (!formRepairLoaded) {
        this.setState(initialState);
      }
    } else {
      this.setState({ formRepairError: 'Please fill all required fields. (Type)' });
    }
  };

  checkRequiredFieldValidity = (fieldName, fieldValue, requiredFieldNames) => {
    if (requiredFieldNames.indexOf(fieldName) >= 0) {
      return fieldValue.trim() !== '';
    }

    return true;
  };

  checkFormValidity = (form) => {
    let isValid = true;
    Object.keys(form).forEach((field) => {
      isValid = form[field].valid && isValid;
    });
    return isValid;
  };

  convertFormToSingleValue = (form) => {
    const newObject = {};
    Object.keys(form).forEach((field) => {
      newObject[field] = form[field].value;
    });

    return newObject;
  };

  layersToZoneAndYears = (layers) => {
    const zoneLayers = [];
    const repairLayers = [];
    layers.forEach((layer) => {
      if (layer.name.includes('Zone')) {
        zoneLayers.push(layer);
      } else {
        repairLayers.push(layer);
      }
    });

    return { zoneLayers, repairLayers };
  };

  render() {
    const {
      formZone,
      formRepair,
      formZoneError,
      formRepairError,
    } = this.state;

    const {
      pageWrapId,
      outerContainerId,
      readableArea,
      readableDistance,
      features,
      layers,
      layerType,
      feature,
      deletePolygon,
      scalePolygon,
      editPolygon,
      subtractPolygon,
    } = this.props;

    const areaSqFeet = toFeet(readableArea.metric).toFixed(2);
    const perimeterFeet = toFeet(readableDistance.metric).toFixed(2);
    const { zoneLayers, repairLayers } = this.layersToZoneAndYears(layers);
    const zonePolygons = this.getZonePolygons(layers, features);

    return (
      <SideBarMenu
        right
        isOpen
        customBurgerIcon={false}
        width={300}
        styles={SideBarStyles}
        outerContainerId={outerContainerId}
        pageWrapId={pageWrapId}
        disableCloseOnEsc
        onStateChange={this.onStateChange}
      >
        <Tabs
          hasNoBackground
          hasNoBorder
          defaultIndex={this.state.formRepairLoaded ? 1 : 0}
        >
          <TabList>
            <Tab>Edit Zone</Tab>
            <Tab>Edit Repair</Tab>
          </TabList>
          <TabPanel>
            <RoofingMeasurementFormZone
              areaSqFeet={areaSqFeet}
              perimeterFeet={perimeterFeet}
              handleChangeValue={this.handleChangeZoneValue}
              formValues={formZone}
              handleSubmit={this.handleSubmitFormZone}
              features={features}
              layers={zoneLayers}
              formError={formZoneError}
              layerType={layerType}
              featureId={feature._id}
              deletePolygon={deletePolygon}
              scalePolygon={scalePolygon}
              subtractPolygon={subtractPolygon}
              editPolygon={editPolygon}
            />
          </TabPanel>
          <TabPanel>
            <RoofingMeasurementFormRepair
              areaSqFeet={areaSqFeet}
              perimeterFeet={perimeterFeet}
              handleChangeValue={this.handleChangeRepairValue}
              formValues={formRepair}
              handleSubmit={this.handleSubmitFormRepair}
              layers={repairLayers}
              formError={formRepairError}
              layerType={layerType}
              featureId={feature._id}
              deletePolygon={deletePolygon}
              scalePolygon={scalePolygon}
              subtractPolygon={subtractPolygon}
              editPolygon={editPolygon}
              handleChangeRepairTypeValue={this.handleChangeRepairTypeValue}
              zonePolygons={zonePolygons}
              handleChangeColor={this.handleChangeRepairColor}
            />
          </TabPanel>
        </Tabs>
      </SideBarMenu>
    );
  }
}

const formZoneState = {
  layerId: {
    value: '',
    error: null,
    valid: false,
  },
  zoneName: {
    value: 'No Zone',
    error: null,
    valid: false,
  },
  zoneType: {
    value: '',
    error: null,
    valid: true,
  },
  zoneSubType: {
    value: null,
    error: null,
    valid: true,
  },
  rating: {
    value: '',
    error: null,
    valid: true,
  },
};

const formRepairState = {
  layerId: {
    value: '',
    error: null,
    valid: true,
  },
  repairType: {
    value: '',
    error: null,
    valid: false,
  },
  typeOfRepair: {
    value: '',
    error: null,
    valid: true,
  },
  defectType: {
    value: '',
    error: null,
    valid: true,
  },
  repairCost: {
    value: '',
    error: null,
    valid: true,
  },
  patchNumber: {
    value: '',
    error: null,
    valid: true,
  },
  zoneId: {
    value: '',
    error: null,
    valid: true,
  },
  color: {
    value: '#FF7077',
    error: null,
    valid: true,
  },
};

const initialState = {
  formZone: formZoneState,
  isFormZoneValid: false,
  formZoneError: null,
  formZoneLoaded: false,

  formRepair: formRepairState,
  isFormRepairValid: false,
  formRepairError: null,
  formRepairLoaded: false,
};

RoofingMeasurementLayerSidebar.propTypes = {
  pageWrapId: PropTypes.string,
  outerContainerId: PropTypes.string,
  layerType: PropTypes.string,
  closeEditPopup: PropTypes.func,
  featureId: PropTypes.string,
  readableArea: PropTypes.object,
  readableDistance: PropTypes.object,
  features: PropTypes.array,
  layers: PropTypes.array,
  saveEditData: PropTypes.func.isRequired,
  feature: PropTypes.object,
  deletePolygon: PropTypes.func.isRequired,
  editPolygon: PropTypes.func.isRequired,
  subtractPolygon: PropTypes.func.isRequired,
  scalePolygon: PropTypes.func.isRequired,
};

export default RoofingMeasurementLayerSidebar;
