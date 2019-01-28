import React from 'react';
import PropTypes from 'prop-types';

import {
  Item,
  ItemHeader,
  ItemNameInput,
  SectionIcon,
} from './elements';

import AttachedPolygons from './AttachedPolygons';

const ConditionLayer = (props) => {
  const {
    layer,
    show,
    readOnly,
    features,
    onLayerItemClick,
    onLayerItemMouseOver,
    onLayerItemMouseLeave,
    toggleConditionLayer,
    togglePciRange,
  } = props;

  const handleToggleLayer = () => {
    toggleConditionLayer(layer.title, !layer.isActive);
  };

  return (
    <Item key={layer.title} className={`grayscale ${layer.isActive && 'active'}`}>
      <ItemHeader>
        <SectionIcon
          show={show && layer.isActive}
          level={3}
          onClick={handleToggleLayer}
        />
        <ItemNameInput
          type="text"
          name="name"
          defaultValue={layer.title}
          placeholder="Untitled layer"
          disabled
          readOnly={readOnly}
        />
      </ItemHeader>
      {show && layer.isActive && (
        <AttachedPolygons
          layer={layer}
          layerId={layer.title}
          features={features}
          isCondition
          onLayerItemClick={onLayerItemClick}
          onLayerItemMouseOver={onLayerItemMouseOver}
          onLayerItemMouseLeave={onLayerItemMouseLeave}
          togglePciRange={togglePciRange}
        />
      )}
    </Item>
  );
};

ConditionLayer.propTypes = {
  layer: PropTypes.object.isRequired,
  features: PropTypes.object.isRequired,
  readOnly: PropTypes.bool.isRequired,
  onLayerItemClick: PropTypes.func.isRequired,
  onLayerItemMouseOver: PropTypes.func.isRequired,
  onLayerItemMouseLeave: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  toggleConditionLayer: PropTypes.func.isRequired,
  togglePciRange: PropTypes.func.isRequired,
};

export default ConditionLayer;
