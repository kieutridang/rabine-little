import React from 'react';
import PropTypes from 'prop-types';

import PavementIcon from '../../../../images/icons/section_title_pavement.png';
import AttachedPolygons from '../AttachedPolygons';
import MeasurementLayer from '../MeasurementLayer';
import { MEASUREMENT_LAYER_LANDSCAPE } from '../../constants';

import {
  Section,
  SectionIcon,
  SectionTitle,
  SectionLoader,
} from '../elements';

const LandscapeControls = ({
  ...props,
  layers,
  features,
  toggleSection,
  toggleItem,
  readOnly,
  landscapeInventoryItems,
  showLandscape,
  isLandscapeCollapsed,
  isLandscapeInventoryItemsCollapsed,
  isLandscapeMeasurementLayersCollapsed,
  isSourceImagesCollapsed = true,
  SortableList,
  renderAreaList,
  onInventoryItemGroupClick,
  onInventoryItemGroupMouseOver,
  onInventoryItemGroupMouseLeave,
}) => {
  const renderLayersCount = () => {
    const { data = [], isLoading } = layers;
    const count = (
      <span style={{ marginLeft: '0.4rem' }}>
        ({data.length})
      </span>
    );
    return isLoading ? null : count;
  };
  const renderLandscapeInventoryItemsCount = () => {
    const { data = [], isLoading } = landscapeInventoryItems;
    const count = (
      <span style={{ marginLeft: '0.4rem' }}>
        ({data.length})
      </span>
    );
    return isLoading ? null : count;
  };

  const renderLandscapeInventoryItems = () => {
    const { isLoading, data = [] } = landscapeInventoryItems;
    const zones = features.data.filter((f) => f.title && f.title.includes('Zone'));

    if (isLoading) {
      return <SectionLoader>Fetching Inventory Items...</SectionLoader>;
    }

    if (!isLoading && (data.length === 0)) {
      return <SectionLoader>No Inventory Items found.</SectionLoader>;
    }

    return (
      <AttachedPolygons
        layerId={'LANDSCAPE_INVENTORY_ITEM'}
        features={data}
        readOnly={readOnly}
        onLayerItemClick={onInventoryItemGroupClick}
        onLayerItemMouseOver={onInventoryItemGroupMouseOver}
        onLayerItemMouseLeave={onInventoryItemGroupMouseLeave}
        reorderFeatures={() => null}
        zones={zones}
      />
    );
  };

  const renderLayer = (layer, index) => (
    <MeasurementLayer
      {...props}
      features={features}
      show={showLandscape}
      layer={layer}
      index={index}
      key={index}
      type={MEASUREMENT_LAYER_LANDSCAPE}
    />
  );

  const renderLayers = () => {
    const { data, isLoading } = layers;
    if (isLoading) {
      return <SectionLoader>Fetching layers…</SectionLoader>;
    }

    if (!isLoading && data.length === 0) {
      return <SectionLoader>No layers found.</SectionLoader>;
    }

    const items = data.map(renderLayer);
    const layerless = features.data.filter((f) => {
      const isZoneDuplicate =
        f.title && f.title.includes('Zone') && f.title.includes('(duplicated)');
      return !f.layerId || isZoneDuplicate;
    });

    const polygons = layerless.length > 0 ? (
      <AttachedPolygons
        layerId={null}
        features={layerless}
        reorderFeatures={props.reorderFeatures}
        onLayerItemClick={props.onLayerItemClick}
        onLayerItemMouseOver={props.onLayerItemMouseOver}
        onLayerItemMouseLeave={props.onLayerItemMouseLeave}
        readOnly={readOnly}
      />
    ) : null;

    return (
      <SortableList
        items={items}
        polygons={polygons}
        onSortEnd={this.onSortEnd}
        useDragHandle={!readOnly}
        shouldCancelStart={() => readOnly}
        readOnly={readOnly}
      />
    );
  };

  return (
    <Section>
      <SectionTitle
        level={1}
        onClick={toggleSection('isLandscapeCollapsed')}
      >
        <SectionIcon
          show={showLandscape}
          level={1}
          icon={PavementIcon}
          isCollapsed={isLandscapeCollapsed}
          onClick={toggleItem('Landscape', !showLandscape, 'Landscape')}
        />
        Landscape
        </SectionTitle>
      {isLandscapeCollapsed && (
        <div>
          <Section>
            <SectionTitle onClick={toggleSection('isSourceImagesCollapsed')}>
              <SectionIcon isCollapsed={isSourceImagesCollapsed} level={2} />
              Media
            </SectionTitle>
            {isSourceImagesCollapsed && renderAreaList && renderAreaList()}
          </Section>

          <Section>
            <SectionTitle
              onClick={toggleSection('isLandscapeInventoryItemsCollapsed')}
            >
              <SectionIcon
                level={2}
                isCollapsed={isLandscapeInventoryItemsCollapsed}
              />
                Inventory Items
                {renderLandscapeInventoryItemsCount()}
            </SectionTitle>
            {isLandscapeInventoryItemsCollapsed && renderLandscapeInventoryItems()}

          </Section>

          <Section>
            <SectionTitle
              onClick={toggleSection('isLandscapeMeasurementLayersCollapsed')}
            >
              <SectionIcon
                level={2}
                isCollapsed={isLandscapeMeasurementLayersCollapsed}
              />
                Measurement Layers
                {renderLayersCount()}
            </SectionTitle>
            {isLandscapeMeasurementLayersCollapsed && renderLayers()}
          </Section>
        </div>
      )}
    </Section>
  );
};

LandscapeControls.propTypes = {
  layers: PropTypes.object.isRequired,
  features: PropTypes.object.isRequired,
  showLandscape: PropTypes.bool.isRequired,
  isLandscapeCollapsed: PropTypes.bool.isRequired,
  isLandscapeInventoryItemsCollapsed: PropTypes.bool.isRequired,
  isLandscapeMeasurementLayersCollapsed: PropTypes.bool.isRequired,
  isSourceImagesCollapsed: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  toggleSection: PropTypes.func.isRequired,
  toggleItem: PropTypes.func.isRequired,
  landscapeInventoryItems: PropTypes.object,
  SortableList: PropTypes.any.isRequired,
  reorderFeatures: PropTypes.func,
  onLayerItemClick: PropTypes.func,
  onLayerItemMouseOver: PropTypes.func,
  onLayerItemMouseLeave: PropTypes.func,
  renderAreaList: PropTypes.func,
  onInventoryItemGroupClick: PropTypes.func.isRequired,
  onInventoryItemGroupMouseOver: PropTypes.func.isRequired,
  onInventoryItemGroupMouseLeave: PropTypes.func.isRequired,
};

export default LandscapeControls;
