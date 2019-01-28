import React from 'react';
import PropTypes from 'prop-types';

import {
  Item,
  ItemHeader,
  ItemNameInput,
  ItemDeleteButton,
  ItemPolygonsCount,
  SectionIcon,
} from './elements';

import AttachedPolygons from './AttachedPolygons';
import { MEASUREMENT_LAYER_LANDSCAPE, MEASUREMENT_LAYER_ROOFING, MEASUREMENT_LAYER_PAVEMENT } from '../constants';

const MeasurementLayer = (props) => {
  const {
    layer,
    features,

    readOnly,
    onLayerChange,
    toggleLayer,
    deleteLayer,
    reorderFeatures,
    onLayerItemClick,
    onLayerItemMouseOver,
    onLayerItemMouseLeave,
    show,
    type,

    isPCIMap,
    togglePCIMap,
  } = props;
  const layerId = typeof layer._id === 'string' ? layer._id : layer._id.str;
  const isLayerActive = layer.isActive === 'undefined' ? true : layer.isActive;
  const layerFeatures = features.data.filter((f) => f.layerId === layerId);

  const zoneAddedLayerFeatures = layerFeatures.map((item) => {
    const newItem = item;
    features.data.forEach((f) => {
      if (f.title && f.title.includes('Zone') && f._id === item.zoneId) {
        const arrTitle = f.title.split(' ');
        newItem.zoneNumber = arrTitle[1] === 'Zone' ? '0' : arrTitle[1];
      }
    });
    return newItem;
  });

  const handleToggleLayer = () => {
    if (show) toggleLayer(layerId, layer.isActive, type);
  };

  const handleTogglePCIMap = () => {
    if (show) togglePCIMap(layerId, layer.isActive, type);
  };

  return (
    <Item key={layerId} className={`grayscale ${isLayerActive && 'active'}`}>
      <ItemHeader>
        <SectionIcon
          show={show && isLayerActive}
          level={3}
          onClick={isPCIMap ? handleTogglePCIMap : handleToggleLayer}
        />
        <ItemNameInput
          type="text"
          name="name"
          autoFocus
          defaultValue={isPCIMap ? 'PCI Map' : layer.name}
          placeholder="Untitled layer"
          readOnly={readOnly}
          onBlur={!isPCIMap && onLayerChange(layerId, layer.featureType)}
        />
        {!readOnly && !isPCIMap && <ItemDeleteButton onClick={deleteLayer(layerId, type)}>&times;</ItemDeleteButton>}
        {layerFeatures.length > 0 && <ItemPolygonsCount>{layerFeatures.length}</ItemPolygonsCount>}
      </ItemHeader>
      {show && isLayerActive && (
        <AttachedPolygons
          layer={layer}
          layerId={layerId}
          features={zoneAddedLayerFeatures}
          reorderFeatures={reorderFeatures}
          onLayerItemClick={onLayerItemClick}
          onLayerItemMouseOver={onLayerItemMouseOver}
          onLayerItemMouseLeave={onLayerItemMouseLeave}
          readOnly={readOnly}
          isPCIMap={isPCIMap}
        />
      )}
    </Item>
  );
};

MeasurementLayer.propTypes = {
  layer: PropTypes.object.isRequired,
  features: PropTypes.object.isRequired,

  reorderFeatures: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  onLayerChange: PropTypes.func.isRequired,
  toggleLayer: PropTypes.func.isRequired,
  deleteLayer: PropTypes.func.isRequired,
  onLayerItemClick: PropTypes.func.isRequired,
  onLayerItemMouseOver: PropTypes.func.isRequired,
  onLayerItemMouseLeave: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  type: PropTypes.oneOf([MEASUREMENT_LAYER_LANDSCAPE, MEASUREMENT_LAYER_PAVEMENT, MEASUREMENT_LAYER_ROOFING]),
  isPCIMap: PropTypes.bool,
  togglePCIMap: PropTypes.func,
};

export default MeasurementLayer;
