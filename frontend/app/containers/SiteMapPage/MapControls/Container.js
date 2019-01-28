import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import shp from 'shpjs';
import ObjectID from 'bson-objectid';

import 'leaflet/dist/images/layers-2x.png';
import 'leaflet/dist/images/layers.png';

import 'leaflet-measure-path';
import 'leaflet-measure-path/leaflet-measure-path.css';

import MapControls from './MapControls';
import { isProperFeature } from '../utils';
import { layerOptions } from '../opts';

import {
  DELETE_LAYER_CONFIRMATION_MESSAGE,
  MEASUREMENT_LAYER_ROOFING,
  MEASUREMENT_LAYER_PAVEMENT,
  LANDSCAPING_NAME,
  ROOFING_NAME,
  PAVEMENT_NAME,
  MEASUREMENT_LAYER_LANDSCAPE,
 } from '../constants';

class MapControlsComponent extends React.Component {
  componentWillReceiveProps() {
    const { featureId } = this.props.route.match.params;
    if (!this.loadedFromUrl &&
      featureId &&
      this.props.PMControl &&
      this.props.features
    ) {
      const feature = this.props.features.data.find((f) => f && f._id === featureId); // eslint-disable-line

      if (feature) {
        const { _id: polygonId, layerId } = feature;

        this.toggleLayer(layerId, false);

        setTimeout(() => {
          this.showPopupByPolygonId(polygonId);
        }, 500);

        this.loadedFromUrl = true;
      }
    }
  }

  onLayerChange = (layerId, type) => (e) => {
    const payload = {};
    payload[e.currentTarget.name] = e.currentTarget.value;
    console.log('>..update measurement layer', payload); // eslint-disable-line

    if (layerId) {
      if (type === 'ROOFING') {
        this.props.updateRoofingMeasurementLayerById(layerId, payload);
      } else if (type && type.includes('LANDSCAPE')) {
        this.props.updateLandscapeMeasurementLayerById(layerId, payload);
      } else {
        this.props.updateLayerById(layerId, payload);
      }
    }
  };

  onChangeSectionItem = (sectionItem, checked) => {
    const { id, type, areaName } = sectionItem;

    if (type === 'Ortho') {
      this.props.toggleOrtho();
    } else if (type === 'Pavement') {
      this.props.togglePavement();
    } else if (type === 'VideoArea') {
      this.props.openAreaVideos(areaName);
    } else if (type === 'HVAC') {
      this.props.toggleHVAC();
    } else if (type === 'Landscape') {
      this.props.toggleLandscape();
    } else if (type === 'Roofing') {
      this.props.toggleRoofing();
    } else {
      const { selectedAreas = {} } = this.props;

      if (checked) {
        selectedAreas[id] = true;
      } else {
        selectedAreas[id] = false;
      }

      this.props.getAreaPhotos(selectedAreas);
    }
  };

  onLayerItemClick = (polygonId) => (e) => {
    console.log('>..on polygon click', polygonId); // eslint-disable-line
    e.preventDefault();

    this.showPopupByPolygonId(polygonId);
  };

  onLayerItemMouseOver = (polygonId) => () => {
    this.props.highlightPolygon(polygonId);
  };

  onLayerItemMouseLeave = (polygonId) => () => {
    this.props.resetPolygon(polygonId);
  };

  onInventoryItemGroupMouseOver = (identifiers) => () => {
    this.props.highlightInventoryItemsGroup(identifiers);
  };

  onInventoryItemGroupMouseLeave = (identifiers) => () => {
    this.props.resetInventoryItemsGroup(identifiers);
  };

  onInventoryItemGroupClick = (identifiers) => () => {
    console.log(identifiers);
  };

  getLayerState = (layerId) => {
    const layer = this.props.layers.data.find((i) => i._id === layerId);

    if (layer) {
      return layer.isActive;
    }

    return null;
  };

  toggleLayer = (layerId, status, type) => {
    switch (type) {
      case MEASUREMENT_LAYER_PAVEMENT:
        this.props.toggleLayerStatus(layerId, status);
        break;
      case MEASUREMENT_LAYER_ROOFING:
        this.props.toggleRoofingMeasurementLayerStatus(layerId, status);
        break;
      case MEASUREMENT_LAYER_LANDSCAPE:
        this.props.toggleLandscapeMeasurementLayerStatus(layerId, status);
        break;
      default:
        break;
    }
  };

  toggleConditionLayer = (layerId, status) => {
    this.props.toggleConditionLayerStatus(layerId, status);
  }

  deleteLayer = (layerId, type) => () => {
    const isConfirmed = window.confirm(DELETE_LAYER_CONFIRMATION_MESSAGE); // eslint-disable-line

    if (isConfirmed) {
      if (type.includes(MEASUREMENT_LAYER_ROOFING)) {
        this.props.deleteRoofingMeasurementLayerById(layerId);
      } else {
        this.props.deleteLayerById(layerId);
      }
    }
  };

  createLayer = (e) => {
    e.preventDefault();
    const { subNavigationItemSelected } = this.props;
    let index = 1;
    const newLayer = {
      _id: ObjectID.generate(),
      index,
      name: '',
    };

    switch (subNavigationItemSelected) {
      case PAVEMENT_NAME:
        index = this.props.layers.data.length + 1;
        newLayer.index = index;
        this.props.createLayer(newLayer);
        break;
      case LANDSCAPING_NAME:
        index = this.props.landscapeMeasurementLayers.data.length + 1;
        newLayer.index = index;
        this.props.createLandscapeMeasurementLayer(newLayer);
        break;
      case ROOFING_NAME:
        index = this.props.roofingMeasurementLayers.data.length + 1;
        newLayer.index = index;
        this.props.createRoofingMeasurementLayer(newLayer);
        break;
      default:
        break;
    }
  };

  showPopupByPolygonId = (polygonId) => { // eslint-disable-line
    if (this.props.activePopupId === polygonId) return;

    const { readOnly } = this.props;
    const { map } = this.props.PMControl.context;
    const popup = this.props.popups.filter((i) => i.featureId === polygonId)[0];

    const latlng = [popup.center.lat, popup.center.lng];
    map.setView(latlng, map.getZoom(), { padding: [300, 500] });
    if (readOnly) {
      this.props.openSideMenuSharedMap(polygonId);
      this.props.getSiteRepairPhotos({ repairId: popup._id });
    } else if (popup) {
      this.props.openPopup(polygonId);
    }
  };

  convertFeatureToLayer = ({ feature, layerContainer, activeMeasurementLayersIds }) => {
    if (!isProperFeature(feature)) return;

    const isPolyline = feature.geometry && feature.geometry.type && feature.geometry.type === 'LineString';
    layerOptions.showMeasurements = !this.props.readOnly && isPolyline;
    const geometryLayer = L.GeoJSON.geometryToLayer(feature.geometry, layerOptions);
    const { layerId } = feature.properties;
    geometryLayer.properties = feature.properties;

    if (feature.properties.color && geometryLayer.setStyle) {
      geometryLayer.setStyle({ color: feature.properties.color });
    }

    const isVisible = !layerId || activeMeasurementLayersIds.indexOf(layerId) !== -1;

    if (isVisible) {
      const editOpts = {
        draggable: false,
        snappable: true,
        allowSelfIntersection: true,
        preventVertexEdit: false,
        preventMarkerRemoval: false,
      };

      geometryLayer.pm.enable(editOpts);
      geometryLayer.on('pm:update', this.onLayerUpdated);

      layerContainer.addLayer(geometryLayer);

      geometryLayer.on({
        click: () => {
          if (!geometryLayer.pm.enabled() && !this.props.isDrawing && !this.props.isGlobalEditing) {
            this.props.openPopup(feature.properties._id);
          } else if (this.props.isGlobalEditing) {
            if (geometryLayer.properties._id !== this.props.layerEditingId) { // eslint-disable-line
              this.setState({ layerEditingId: geometryLayer.properties._id }); // eslint-disable-line
            }
            geometryLayer.pm.enable();
            layerContainer.eachLayer((layer) => {
              if (layer !== geometryLayer) {
                layer.pm.disable();
              }
            });
          }
        },
      });
    }
  };

  handleShapesImport = (e) => {
    const { files } = e.currentTarget;
    const reader = new FileReader();
    const file = files[0];

    reader.onloadend = ({ target }) => shp(target.result).then((geojson) => {
      const layer = L.geoJSON(geojson);
      const layers = layer._layers; // eslint-disable-line

      if (!layers || layers.length === 0) window.alert('No layers were found.'); // eslint-disable-line

      const keys = Object.keys(layers);

      keys.forEach((key) => {
        this.props.handleCreate(layers[key]);
      });

      window.alert(`Succeesfully imported ${keys.length} layers.`); // eslint-disable-line
    });

    reader.readAsArrayBuffer(file);
  };

  reorderLayers = (payload, layerType) => {
    this.props.updateLayersOrder(payload, layerType);
  };

  reorderFeatures = (payload) => {
    this.props.updateFeaturesOrder(payload);
  };

  render() {
    const {
      changes,
      layers,
      areas,
      features,
      hvacs,
      landscapeInventoryItems,
      landscapeMeasurementLayers,
      landscapeMeasurementFeatures,
      roofingMeasurementLayers,
      roofingMeasurementFeatures,

      activeTab,
      switchTab,
      resync,
      loadMoreChanges,

      readOnly,
      selectedAreas,
      showOrtho,
      showPavement,
      showHVAC,
      showLandscape,
      showRoofing,

      subNavigationItemSelected,

      addAreaPhotoRepair,
      deleteAreaPhotoRepair,
      getAreaPhotoRepairs,
      areaPhotoRepairs,
      groupedPCIFeatures,
      conditionLayerPCIMap,
      togglePciRange,
    } = this.props;

    return (
      <MapControls
        changes={changes}
        layers={layers}
        features={features}
        areas={areas}
        hvacs={hvacs}
        landscapeInventoryItems={landscapeInventoryItems}
        landscapeMeasurementFeatures={landscapeMeasurementFeatures}
        landscapeMeasurementLayers={landscapeMeasurementLayers}
        roofingMeasurementLayers={roofingMeasurementLayers}
        roofingMeasurementFeatures={roofingMeasurementFeatures}

        addAreaPhotoRepair={addAreaPhotoRepair}
        deleteAreaPhotoRepair={deleteAreaPhotoRepair}
        getAreaPhotoRepairs={getAreaPhotoRepairs}
        areaPhotoRepairs={areaPhotoRepairs}

        activeTab={activeTab}
        switchTab={switchTab}
        resync={resync}
        loadMoreChanges={loadMoreChanges}

        selectedAreas={selectedAreas}
        showOrtho={showOrtho}
        showPavement={showPavement}
        showHVAC={showHVAC}
        showLandscape={showLandscape}
        showRoofing={showRoofing}
        readOnly={readOnly}
        reorderLayers={this.reorderLayers}
        reorderFeatures={this.reorderFeatures}
        onLayerChange={this.onLayerChange}
        onLayerItemClick={this.onLayerItemClick}
        onLayerItemMouseOver={this.onLayerItemMouseOver}
        onLayerItemMouseLeave={this.onLayerItemMouseLeave}
        createLayer={this.createLayer}
        toggleLayer={this.toggleLayer}
        deleteLayer={this.deleteLayer}
        handleShapesImport={this.handleShapesImport}
        onChangeSectionItem={this.onChangeSectionItem}

        subNavigationItemSelected={subNavigationItemSelected}
        toggleConditionLayer={this.toggleConditionLayer}
        groupedPCIFeatures={groupedPCIFeatures}
        conditionLayerPCIMap={conditionLayerPCIMap}
        togglePciRange={togglePciRange}

        onInventoryItemGroupClick={this.onInventoryItemGroupClick}
        onInventoryItemGroupMouseOver={this.onInventoryItemGroupMouseOver}
        onInventoryItemGroupMouseLeave={this.onInventoryItemGroupMouseLeave}
      />
    );
  }
}

MapControlsComponent.propTypes = {
  PMControl: PropTypes.object,

  selectedAreas: PropTypes.object,
  showOrtho: PropTypes.bool,
  showPavement: PropTypes.bool,
  showHVAC: PropTypes.bool.isRequired,
  showLandscape: PropTypes.bool.isRequired,
  showRoofing: PropTypes.bool.isRequired,

  isDrawing: PropTypes.bool,
  isGlobalEditing: PropTypes.bool,

  popups: PropTypes.array.isRequired,

  changes: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired,
  areas: PropTypes.object.isRequired,
  features: PropTypes.object.isRequired,
  hvacs: PropTypes.object.isRequired,
  landscapeInventoryItems: PropTypes.object.isRequired,
  landscapeMeasurementLayers: PropTypes.object.isRequired,
  landscapeMeasurementFeatures: PropTypes.object.isRequired,
  roofingMeasurementLayers: PropTypes.object.isRequired,
  roofingMeasurementFeatures: PropTypes.object.isRequired,

  activeTab: PropTypes.string.isRequired,
  switchTab: PropTypes.func.isRequired,
  resync: PropTypes.func.isRequired,
  loadMoreChanges: PropTypes.func.isRequired,
  updateFeaturesOrder: PropTypes.func.isRequired,

  createLayer: PropTypes.func.isRequired,
  createLandscapeMeasurementLayer: PropTypes.func.isRequired,
  updateLandscapeMeasurementLayerById: PropTypes.func.isRequired,
  toggleLandscapeMeasurementLayerStatus: PropTypes.func.isRequired,
  createRoofingMeasurementLayer: PropTypes.func.isRequired,
  updateRoofingMeasurementLayerById: PropTypes.func.isRequired,
  toggleRoofingMeasurementLayerStatus: PropTypes.func.isRequired,
  deleteRoofingMeasurementLayerById: PropTypes.func.isRequired,
  updateLayersOrder: PropTypes.func.isRequired,
  updateLayerById: PropTypes.func.isRequired,
  toggleLayerStatus: PropTypes.func.isRequired,
  deleteLayerById: PropTypes.func.isRequired,

  toggleOrtho: PropTypes.func.isRequired,
  togglePavement: PropTypes.func.isRequired,
  toggleHVAC: PropTypes.func.isRequired,
  toggleLandscape: PropTypes.func.isRequired,
  toggleRoofing: PropTypes.func.isRequired,
  getAreaPhotos: PropTypes.func,

  handleCreate: PropTypes.func.isRequired,

  highlightPolygon: PropTypes.func.isRequired,
  resetPolygon: PropTypes.func.isRequired,

  openPopup: PropTypes.func,
  openSideMenuSharedMap: PropTypes.func,
  activePopupId: PropTypes.string,

  route: PropTypes.object,
  readOnly: PropTypes.bool,
  openAreaVideos: PropTypes.func,
  getSiteRepairPhotos: PropTypes.func,

  subNavigationItemSelected: PropTypes.string.isRequired,

  addAreaPhotoRepair: PropTypes.func,
  deleteAreaPhotoRepair: PropTypes.func,
  getAreaPhotoRepairs: PropTypes.func,
  areaPhotoRepairs: PropTypes.func,

  toggleConditionLayerStatus: PropTypes.func.isRequired,
  conditionLayerPCIMap: PropTypes.object.isRequired,
  groupedPCIFeatures: PropTypes.object,
  togglePciRange: PropTypes.func.isRequired,

  highlightInventoryItemsGroup: PropTypes.func.isRequired,
  resetInventoryItemsGroup: PropTypes.func.isRequired,
};

export default MapControlsComponent;
