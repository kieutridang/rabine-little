import React from 'react';
import PropTypes from 'prop-types';
import { arrayMove } from 'react-sortable-hoc';

import PavementIcon from '../../../../images/icons/section_title_pavement.png';
import AttachedPolygons from '../AttachedPolygons';
import MeasurementLayer from '../MeasurementLayer';
import { MEASUREMENT_LAYER_ROOFING } from '../../constants';

import {
    Section,
    SectionIcon,
    SectionTitle,
    SectionLoader,
} from '../elements';

const RoofingControls = ({
  ...props,
  showRoofing,
  isRoofingMeasurementLayersCollapsed,
  layers,
  features,
  toggleSection,
  toggleItem,
  SortableList,
  readOnly,
  isSourceImagesCollapsed = true,
  renderAreaList,
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

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const { data = [] } = layers;
    const reordered = arrayMove(data, oldIndex, newIndex);
    const reorderedLayers = reordered.map((layer, index) => ({
      ...layer,
      index,
    }));

    props.reorderLayers({ reordered: reorderedLayers }, 'roofingMeasurementLayers');
  };

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
        onSortEnd={onSortEnd}
        useDragHandle={!readOnly}
        shouldCancelStart={() => readOnly}
        readOnly={readOnly}
      />
    );
  };

  const renderLayer = (layer, index) => (
    <MeasurementLayer
      {...props}
      // reorderFeatures={props.reorderFeatures}
      features={features}
      show={showRoofing}
      layer={layer}
      index={index}
      key={index}
      type={MEASUREMENT_LAYER_ROOFING}
    />
  );

  return (
    <Section>
      <SectionTitle
        onClick={toggleSection('showRoofing')}
        level={1}
      >
        <SectionIcon
          show={showRoofing}
          isCollapsed={showRoofing}
          level={1}
          icon={PavementIcon}
          onClick={toggleItem('Roofing', !showRoofing, 'Roofing')}
        />
          ROOFING
        </SectionTitle>
      {showRoofing && (
      <div>

        <Section>
          <SectionTitle onClick={toggleSection('isSourceImagesCollapsed')}>
            <SectionIcon isCollapsed={isSourceImagesCollapsed} level={2} />
            Media
          </SectionTitle>
          {isSourceImagesCollapsed && renderAreaList && renderAreaList()}
        </Section>

        <Section>
          <SectionTitle onClick={toggleSection('isRoofingMeasurementLayersCollapsed')}>
            <SectionIcon
              isCollapsed={isRoofingMeasurementLayersCollapsed}
              level={2}
            />
                Measurement Layers
                {renderLayersCount()}
          </SectionTitle>
          {isRoofingMeasurementLayersCollapsed && renderLayers()}
        </Section>
      </div>
        )}
    </Section>
  );
};

RoofingControls.propTypes = {
  showRoofing: PropTypes.bool.isRequired,
  isRoofingMeasurementLayersCollapsed: PropTypes.bool.isRequired,
  layers: PropTypes.object.isRequired,
  features: PropTypes.object.isRequired,
  readOnly: PropTypes.bool.isRequired,
  toggleSection: PropTypes.func.isRequired,
  toggleItem: PropTypes.func.isRequired,
  SortableList: PropTypes.any.isRequired,
  reorderFeatures: PropTypes.func,
  onLayerItemClick: PropTypes.func,
  onLayerItemMouseOver: PropTypes.func,
  onLayerItemMouseLeave: PropTypes.func,
  isSourceImagesCollapsed: PropTypes.bool,
  renderAreaList: PropTypes.func,
  reorderLayers: PropTypes.func.isRequired,
};

RoofingControls.defaultProps = {
  showRoofing: true,
  isRoofingMeasurementLayersCollapsed: true,
  readOnly: false,
  isSourceImagesCollapsed: true,
};

export default RoofingControls;
