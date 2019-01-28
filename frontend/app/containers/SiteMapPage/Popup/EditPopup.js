import React from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import 'rc-color-picker/assets/index.css';
import { Tab, TabList, TabPanel } from 'react-tabs';
import find from 'lodash/find';
import { push as SideBarMenu } from 'react-burger-menu';

// app
import Tabs from './styled/StyledTabWrapper';
import EditPopupTabZone from './EditPopupTabZone';
import EditPopupTabRepair from './EditPopupTabRepair';
import { toFeet } from '../../../utils/number/numberUtils';
import SideBarStyles from './styled/SideBarStyles';

const getZonePolygons = (layers, features) => {
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

const getRepairLayers = (layers) => layers
  .filter((layer) => layer.name && !layer.name.includes('Zone'))
  .map((layer) => ({ _id: layer._id, name: layer.name }));

const EditPopup = (props) => {
  const {
    closeEditPopup,

    layers = [],
    features = [],
    featureId,

    deletePolygon,
    subtractPolygon,
    scalePolygon,
    editPolygon,

    readableArea,
    readableDistance,
    isShared = false,

    layerType,
    saveEditData,
  } = props;

  const feature = featureId && find(props.features, (f) => f._id === featureId);

  const areaSqFeet = toFeet(readableArea.metric).toFixed(2);
  const perimeterFeet = toFeet(readableDistance.metric).toFixed(2);

  const zonePolygons = getZonePolygons(layers, features);
  const repairLayers = getRepairLayers(layers);
  const properties = feature || {};

  const handleCloseEditPopup = () => {
    if (layerType) {
      closeEditPopup(featureId);
    } else {
      closeEditPopup(null);
    }
  };

  const onStateChange = () => {
    handleCloseEditPopup();
  };

  return (
    <SideBarMenu
      right
      isOpen
      customBurgerIcon={false}
      width={300}
      styles={SideBarStyles}
      outerContainerId="outer-container"
      pageWrapId="right-buttons-wrapper"
      onStateChange={onStateChange}
      disableCloseOnEsc
    >
      <Tabs
        hasNoBackground
        hasNoBorder
        defaultIndex={layerType === 'repair' ? 1 : 0}
      >
        <TabList>
          <Tab>NEW ZONE</Tab>
          <Tab>NEW REPAIR</Tab>
        </TabList>

        <TabPanel>
          <EditPopupTabZone
            features={features}
            featureId={featureId}
            layers={layers}
            properties={properties}
            isShared={isShared}
            areaSqFeet={areaSqFeet}
            perimeterFeet={perimeterFeet}
            deletePolygon={deletePolygon}
            scalePolygon={scalePolygon}
            subtractPolygon={subtractPolygon}
            editPolygon={editPolygon}
            saveEditData={saveEditData}
          />
        </TabPanel>

        <TabPanel>
          <EditPopupTabRepair
            features={features}
            featureId={featureId}
            layers={layers}
            properties={properties}

            isShared={isShared}
            areaSqFeet={areaSqFeet}
            perimeterFeet={perimeterFeet}
            deletePolygon={deletePolygon}
            scalePolygon={scalePolygon}
            subtractPolygon={subtractPolygon}
            editPolygon={editPolygon}
            zonePolygons={zonePolygons}
            saveEditData={saveEditData}
            repairLayers={repairLayers}
          />
        </TabPanel>
      </Tabs>
    </SideBarMenu>
  );
};

EditPopup.propTypes = {
  closeEditPopup: PropTypes.func.isRequired,
  layers: PropTypes.array,
  features: PropTypes.array.isRequired,
  featureId: PropTypes.string,
  deletePolygon: PropTypes.func.isRequired,
  subtractPolygon: PropTypes.func.isRequired,
  scalePolygon: PropTypes.func.isRequired,
  editPolygon: PropTypes.func.isRequired,
  saveEditData: PropTypes.func.isRequired,
  readableArea: PropTypes.object,
  readableDistance: PropTypes.object,
  isShared: PropTypes.bool,
  layerType: PropTypes.string,
};

export default EditPopup;
