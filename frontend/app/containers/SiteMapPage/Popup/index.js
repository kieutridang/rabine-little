import React from 'react';
import PropTypes from 'prop-types';
import EditPopup from './EditPopup';
import RepairInfoPopup from './RepairInfoPopup';
import ZoneInfoPopup from './ZoneInfoPopup';
import RepairInfoSideMenu from '../SideMenu/RepairInfoSideMenu';
import ZoneInfoSideMenu from '../SideMenu/ZoneInfoSideMenu';
import {
  MEASUREMENT_LAYER_ROOFING,
  MEASUREMENT_LAYER_LANDSCAPE,
  MEASUREMENT_LAYER_ROOFING_REPAIR,
  MEASUREMENT_LAYER_ROOFING_ZONE,
  ROOFING_NAME,
  MEASUREMENT_LAYER_LANDSCAPE_REPAIR,
  MEASUREMENT_LAYER_LANDSCAPE_ZONE,
  LANDSCAPING_NAME,
} from '../constants';
import RoofingMeasurementLayerSidebar from '../Roofing/MeasurementLayers/RoofingMeasurementSidebar';
import RoofingRepairInfo from '../Roofing/MeasurementLayers/RoofingRepairInfo';
import ZoneRepairInfo from '../Roofing/MeasurementLayers/RoofingZoneInfo';
import LandscapeMeasurementLayerSidebar from '../Landscaping/MeasurementLayers/LandscapeMeasurementLayerSidebar';
import LandscapeRepairInfo from '../Landscaping/MeasurementLayers/LandscapeRepairInfo';
import LandscapeZoneInfo from '../Landscaping/MeasurementLayers/LandscapeZoneInfo';

export const PopupRenderer = {
  zoneInfo: ({ showAsSideBar, ...rest }) => showAsSideBar ? <ZoneInfoSideMenu {...rest} /> : <ZoneInfoPopup {...rest} />,
  repairInfo: ({ showAsSideBar, ...rest }) => showAsSideBar ? <RepairInfoSideMenu {...rest} /> : <RepairInfoPopup {...rest} />,
  edit: (props) => <EditPopup {...props} />,
  [MEASUREMENT_LAYER_ROOFING_REPAIR]: (props) => <RoofingRepairInfo {...props} />,
  [MEASUREMENT_LAYER_ROOFING_ZONE]: (props) => <ZoneRepairInfo {...props} />,
  [MEASUREMENT_LAYER_ROOFING]: (props) => <RoofingMeasurementLayerSidebar {...props} outerContainerId="outer-container" pageWrapId="right-buttons-wrapper" />,
  [MEASUREMENT_LAYER_LANDSCAPE]: (props) => <LandscapeMeasurementLayerSidebar {...props} outerContainerId="outer-container" pageWrapId="right-buttons-wrapper" />,
  [MEASUREMENT_LAYER_LANDSCAPE_REPAIR]: (props) => <LandscapeRepairInfo {...props} />,
  [MEASUREMENT_LAYER_LANDSCAPE_ZONE]: (props) => <LandscapeZoneInfo {...props} />,
};

PopupRenderer.repairInfo.propTypes = {
  showAsSideBar: PropTypes.bool,
};

PopupRenderer.zoneInfo.propTypes = {
  showAsSideBar: PropTypes.bool,
};

export const popupSelector = (layerType, action) => {
  if (layerType && layerType.includes(ROOFING_NAME)) {
    if (action && action === ACTION_EDIT) {
      return MEASUREMENT_LAYER_ROOFING;
    }
    return layerType;
  }

  if (layerType && layerType.includes(LANDSCAPING_NAME)) {
    if (action && action === ACTION_EDIT) {
      return MEASUREMENT_LAYER_LANDSCAPE;
    }
    return layerType;
  }

  if (!layerType) return POPUP_EDIT;
  if (action && action === ACTION_EDIT) return POPUP_EDIT;
  if (!action || action === ACTION_INFO) {
    return layerType === LAYER_ZONE ? POPUP_ZONE_INFO : POPUP_REPAIR_INFO;
  }

  return DEFAULT;
};

export const ACTION_EDIT = 'edit';
export const ACTION_INFO = 'info';

export const POPUP_ZONE_INFO = 'zoneInfo';
export const POPUP_REPAIR_INFO = 'repairInfo';
export const POPUP_EDIT = 'edit';
export const DEFAULT = 'default';

export const LAYER_ZONE = 'zone';
export const LAYER_REPAIR = 'repair';
