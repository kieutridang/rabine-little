import React from 'react';
import { push as SideBarMenu } from 'react-burger-menu';
import PropTypes from 'prop-types';
import { Tab, TabList, TabPanel } from 'react-tabs';
import cloneDeep from 'lodash/cloneDeep';

import LandscapeMeasurementFormRepair from './LandscapeMeasurementFormRepair';
import LandscapeMeasurementFormZone from './LandscapeMeasurementFormZone';
import SideBarStyles from '../../SidebarStyledComponents/SideBarStyles';
import Tabs from '../../SidebarStyledComponents/StyledTabWrapper';
import { toFeet } from '../../../../utils/number/numberUtils';
import { MEASUREMENT_LAYER_LANDSCAPE_REPAIR, MEASUREMENT_LAYER_LANDSCAPE_ZONE } from '../../constants';
import { repairTypes } from './options';
import { options } from '../../Popup/options';

class LandscapeMeasurementLayerSidebar extends React.Component {

  state = initialState;

  componentWillMount() {
    if (this.props.feature.type === 'repair') {
      const {
        repairType,
        layerId,
        typeOfRepair,
        zoneId,
        repairCost,
        patchNumber,
        color,
      } = cloneDeep(this.props.feature);

      this.setState({
        formRepair: {
          repairType: { value: repairType || '', valid: true },
          layerId: { value: layerId, valid: true },
          typeOfRepair: { value: typeOfRepair || '', valid: true },
          zoneId: { value: zoneId, valid: true },
          repairCost: { value: repairCost || '', valid: true },
          patchNumber: { value: patchNumber || '', valid: true },
          color: { value: color || '', valid: true },
        },
        formRepairLoaded: true,
      });
    } else if (this.props.feature.type === 'zone') {
      const { zoneName, layerId, zoneType } = cloneDeep(this.props.feature);
      this.setState({
        formZone: {
          layerId: { value: layerId || '', valid: true },
          zoneName: { value: zoneName || '', valid: true },
          zoneType: { value: zoneType || '', valid: true },
        },
        formZoneLoaded: true,
      });
    }
  }

  onStateChange = () => {
    this.handleCloseEditPopup();
  };

  handleCloseEditPopup = () => {
    const { closeEditPopup } = this.props;
    closeEditPopup(null);
  };

  handleChangeZoneValue = (e) => {
    const clonedForm = cloneDeep(this.state.formZone);
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    clonedForm[fieldName].value = fieldValue;
    if (fieldName !== 'zoneSubType') {
      clonedForm[fieldName].valid = this.checkFieldValidity(fieldValue);
    }

    this.setState({ formZone: clonedForm });
  }

  handleSubmitFormZone = () => {
    const { saveEditData, featureId } = this.props;
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

      saveEditData('zone', featureId, values, MEASUREMENT_LAYER_LANDSCAPE_ZONE);
      this.setState(initialState);
    } else {
      this.setState({ formZoneError: 'All fields should be filled' });
    }
  }

  handleChangeRepairColor = (e) => {
    const clonedForm = cloneDeep(this.state);
    clonedForm.formRepair.color.value = e.color;
    clonedForm.newRepairColorAdded = true;
    this.setState(clonedForm);
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
    if (
      fieldName !== 'patchNumber' &&
      fieldName !== 'layerId' &&
      fieldName !== 'repairCost' &&
      fieldName !== 'color'
    ) {
      clonedForm[fieldName].valid = this.checkFieldValidity(fieldValue);
    }

    this.setState({ formRepair: clonedForm });
  }

  handleSubmitFormRepair = () => {
    const { saveEditData, featureId } = this.props;
    const { formRepairLoaded, newRepairColorAdded } = this.state;
    const clonedForm = cloneDeep(this.state.formRepair);
    const isValid = this.checkFormValidity(clonedForm);

    if (isValid) {
      const payload = this.convertFormToSingleValue(clonedForm);
      payload.title = payload.repairType;

      if (payload.repairType) {
        const mappedOption = repairTypes.find((option) => option.name === payload.repairType);
        if (mappedOption && (payload.color !== mappedOption.color)) {
          if (!newRepairColorAdded) {
            payload.color = mappedOption.color;
          }
        }
      }

      saveEditData('repair', featureId, payload, MEASUREMENT_LAYER_LANDSCAPE_REPAIR);
      if (!formRepairLoaded) {
        this.setState(initialState);
      }
    } else {
      this.setState({ formRepairError: 'All fields should be filled' });
    }
  }

  checkFieldValidity = (fieldValue) =>
    fieldValue.trim() !== '';

  checkFormValidity = (form) => {
    let isValid = true;
    Object.keys(form).forEach((field) => {
      isValid = form[field].valid && isValid;
    });
    return isValid;
  }

  convertFormToSingleValue = (form) => {
    const newObject = {};
    Object.keys(form).forEach((field) => {
      newObject[field] = form[field].value;
    });

    return newObject;
  }

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
  }

  render() {
    const {
      formZone,
      formRepair,
      formZoneError,
      formRepairError,
      formRepairLoaded,
      formZoneLoaded,
    } = this.state;

    const {
      pageWrapId,
      outerContainerId,
      readableArea,
      readableDistance,
      features,
      layers,
      deletePolygon,
      scalePolygon,
      editPolygon,
      subtractPolygon,
      featureId,
      layerType,
    } = this.props;


    const areaSqFeet = toFeet(readableArea.metric).toFixed(2);
    const perimeterFeet = toFeet(readableDistance.metric).toFixed(2);
    const { zoneLayers, repairLayers } = this.layersToZoneAndYears(layers);

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
        >
          <TabList>
            { !formRepairLoaded && <Tab>New Zone</Tab> }
            { !formZoneLoaded && <Tab>New Repair</Tab> }
          </TabList>
          { !formRepairLoaded &&
            (<TabPanel>
              <LandscapeMeasurementFormZone
                areaSqFeet={areaSqFeet}
                perimeterFeet={perimeterFeet}
                handleChangeValue={this.handleChangeZoneValue}
                formValues={formZone}
                handleSubmit={this.handleSubmitFormZone}
                features={features}
                layers={zoneLayers}
                formError={formZoneError}
                featureId={featureId}
                deletePolygon={deletePolygon}
                scalePolygon={scalePolygon}
                editPolygon={editPolygon}
                subtractPolygon={subtractPolygon}
                layerType={layerType}
              />
            </TabPanel>) }

          { !formZoneLoaded &&
            (<TabPanel>
              <LandscapeMeasurementFormRepair
                areaSqFeet={areaSqFeet}
                perimeterFeet={perimeterFeet}
                handleChangeValue={this.handleChangeRepairValue}
                formValues={formRepair}
                handleSubmit={this.handleSubmitFormRepair}
                layers={repairLayers}
                zoneLayers={zoneLayers}
                formError={formRepairError}
                featureId={featureId}
                deletePolygon={deletePolygon}
                scalePolygon={scalePolygon}
                editPolygon={editPolygon}
                subtractPolygon={subtractPolygon}
                layerType={layerType}
                handleChangeColor={this.handleChangeRepairColor}
              />
            </TabPanel>) }
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
    valid: false,
  },
};

const formRepairState = {
  color: {
    value: '',
    error: null,
    valid: true,
  },
  repairType: {
    value: '',
    error: null,
    valid: false,
  },
  layerId: {
    value: '',
    valid: true,
    error: null,
  },
  typeOfRepair: {
    value: '',
    error: null,
    valid: false,
  },
  repairCost: {
    value: '',
    error: null,
    valid: true,
  },
  zoneId: {
    value: '',
    error: null,
    valid: true,
  },
  patchNumber: {
    value: '',
    error: null,
    valid: true,
  },
};

const initialState = {
  formZone: formZoneState,
  isFormZoneValid: false,
  formZoneError: null,
  formZoneLoaoded: false,
  formRepair: formRepairState,
  isFormRepairValid: false,
  formRepairError: null,
  formRepairLoaded: false,
  newRepairColorAdded: false,
};

LandscapeMeasurementLayerSidebar.propTypes = {
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
  scalePolygon: PropTypes.func.isRequired,
  editPolygon: PropTypes.func.isRequired,
  subtractPolygon: PropTypes.func.isRequired,
};

export default LandscapeMeasurementLayerSidebar;
