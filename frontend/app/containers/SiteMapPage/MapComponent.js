import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import ObjectID from 'bson-objectid';
import queryString from 'query-string';

import ACIMapper from 'autocad-colors-index';
import Mousetrap from 'mousetrap';

import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import cloneDeep from 'lodash/cloneDeep';

import intersect from '@turf/intersect';
import difference from '@turf/difference';

import { FeatureGroup, TileLayer } from 'react-leaflet';

import { toast } from 'react-toastify';

import 'leaflet/dist/images/layers-2x.png';
import 'leaflet/dist/images/layers.png';

import 'leaflet-measure-path';
import 'leaflet-measure-path/leaflet-measure-path.css';

import Map from './Map';

import { LeafletPM } from '../../components/LeafletPM';
import LeafletEasyprint from '../../components/leaflet-easyprint';
import { InventoryItems } from '../../components/LeafletInventoryItems';

import MapControlsContainer from './MapControls/Container';
import HVAC from './HVAC';
import LandscapingInventorySidebar from './Landscaping/InventoryItems/Sidebar';

import AreaVideosModal from '../AreaVideos';
import { getPolygonPayload, getSelectedLayers } from './utils';
import { readableDistance } from './utils/geometry';
import PhotoMarker from './PhotoMarker';
import { MapContainer, FeaturesLoader, Toolbar, SideBarButton } from './elements';
import { popupSelector, PopupRenderer, ACTION_EDIT } from './Popup';
import SubNavBar from './SubNavBar';
import {
  LANDSCAPING_NAME,
  PAVEMENT_NAME,
  HVAC_NAME,
  ROOFING_NAME,
  MEASUREMENT_LAYER_ROOFING,
  MEASUREMENT_LAYER_ROOFING_ZONE,
  MEASUREMENT_LAYER_ROOFING_REPAIR,
  MEASUREMENT_LAYER_LANDSCAPE,
  MEASUREMENT_LAYER_LANDSCAPE_ZONE,
  MEASUREMENT_LAYER_LANDSCAPE_REPAIR,
  PCIColors,
} from './constants';
import { layerOptions } from './opts';
import CommentButton from './MapControls/CommentButton';
import SaveScreenshot from './SaveScreenshot';
import ArrowLeft from '../../images/icons/arrow-left.svg';
import keyboardShortcuts from './shortcuts';
import CustomIcon from '../../components/LeafletInventoryItems/plugin/CustomMarkerStyled';
import CanvasMarkersLayer from '../../components/LeafletCanvasMarker/CanvasMarkersLayer';

const InventoryItemsSchema = {
  layer: null,
  isToggled: false,
  itemSelected: null,
};

const initialState = {
  activeTab: 'layers',

  popups: [],
  editPopups: [],
  activePopupId: '',
  activeEditPopupId: '',
  selectedAreas: {},

  showOrtho: true,
  showPavement: false,
  showHVAC: false,
  showLandscape: false,
  showRoofing: false,

  isDrawing: false,
  isEditing: false,
  isGlobalEditing: false,

  layerEditingId: '',
  editingLayerType: null,
  videoPopup: false,
  videoArea: null,
  videoId: null,
  isModalOpen: false,
  selectedToggles: {},

  landscapeInventory: InventoryItemsSchema,
  hvacInventory: InventoryItemsSchema,
  isSavingScreenshot: false,
  screenshotFile: null,
  drawToolsShortcuts: false,

  subNavigationItemSelected: 'PAVEMENT',
};

const LEAFLET_EASYPRINT_CONFIG = {
  title: 'Take a screenshot and save it',
  position: 'topright',
  customSize: {
    width: 800,
    height: 800,
    className: 'a3CssClass',
    name: 'Snap Image',
    tileWait: 1000,
  },
  showSharedRepairInfo: false,
};

const SCREENSHOT_TOAST_ERROR_CONFIG = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
};
class MapComponent extends React.Component {

  constructor(props) {
    super(props);
    this.inputArea = null;
    this.state = initialState;
    this.toastId = null;
    this.arrowSideBar = React.createRef();
  }

  componentWillMount() {
    this.loadControlsState(true);
  }

  componentDidMount() {
    this.getAreaPhotos();
    document.querySelector('.leaflet-right.leaflet-top').id = 'right-buttons-wrapper';
  }

  componentWillReceiveProps(nextProps) {
    const { center, route: { location } } = nextProps;
    const query = queryString.parse(location.search);

    const isPanning = query.areaId && query.pin === '1' && query.lat && query.lng;

    if (this.PMControl && isPanning) {
      const { map } = this.PMControl.context;
      const targetZoom = 22;

      const targetPoint = map.project([query.lat, query.lng], targetZoom).subtract([100, 0]);
      const targetLatLng = map.unproject(targetPoint, targetZoom);

      map.setView(targetLatLng, targetZoom);

      const selectedAreas = { ...this.state.selectedAreas };
      selectedAreas[query.areaId] = true;

      this.setState({
        selectedAreas,
        showOrtho: true,
        showPavement: true,
        showHVAC: true,
        showLandscape: true,
        showRoofing: true,
      });

      this.cycle();

      nextProps.route.history.replace(location.pathname);
    }

    if (center &&
      this.props.center &&
      (this.props.center[0] !== center[0] || this.props.center[1] !== center[1])
    ) {
      this.getAreaPhotos();
    }

    if (nextProps.screenshotError) {
      this.showToastError("Couldn't save the screenshot, verify your internet connection and try again");
      this.props.clearSiteScreenshot();
    }

    if (!this.state.isGlobalEditing) {
      this.cycle();
    }
  }

  onDrawStart = (e) => {
    this.setState(() => ({
      isDrawing: (e.shape === 'Line' || e.shape === 'Poly' || e.shape === 'Cut'),
      workingLayer: e.workingLayer,
      shape: e.shape,
    }));
  };

  onDrawEnd = () => this.setState(() => ({
    isDrawing: false,
    workingLayer: null,
    shape: null,
  }));

  onCreate = (e) => {
    const { layerContainer } = this.PMControl.context;
    layerContainer.addLayer(e.layer);
    this.handleCreateWithLayer(e.layer);
  };

  onCut = (e) => {
    const cuttedLayer = e.cuttedLayer;
    const { subNavigationItemSelected } = this.state;
    const { features } = this.getFeaturesAndLayerTypes(subNavigationItemSelected);
    const featureId = cuttedLayer.properties && cuttedLayer.properties._id;
    const feature = find(features.data, (f) => f._id === featureId);
    const { selectedAreas } = this.state;

    if (feature) {
      const { layerContainer } = this.PMControl.context;
      layerContainer.removeLayer(e.cuttedLayer);

      const newFeatures = e.resultingLayers.map((element) => {
        const geojson = element.toGeoJSON().features[0];

        if (geojson) {
          return {
            ...feature,
            geojson,
            createdAt: null,
            _id: ObjectID.generate(), // eslint-disable-line
            color: feature.color || '#FF7077',
          };
        }
        return null;
      });

      if (subNavigationItemSelected === PAVEMENT_NAME) {
        this.props.cutFeature(featureId, newFeatures, selectedAreas);
        return;
      }

      switch (subNavigationItemSelected) {
        case LANDSCAPING_NAME:
          this.props.deleteLandscapeMeasurementFeatureById(featureId);
          break;
        case ROOFING_NAME:
          this.props.deleteRoofingMeasurementFeatureById(featureId);
          break;
        default:
          break;
      }

      newFeatures.forEach((newFeature) => {
        if (newFeature) {
          switch (subNavigationItemSelected) {
            case LANDSCAPING_NAME:
              this.props.createLandscapeMeasurementFeature(newFeature);
              break;
            case ROOFING_NAME:
              this.props.createRoofingMeasurementFeature(newFeature);
              break;
            default:
              break;
          }
        }
      });
    }
  };

  onGlobalEditToggle = async (e) => {
    const { subNavigationItemSelected } = this.state;
    if (this.state.isGlobalEditing) {
      const { layerContainer } = this.PMControl.context;

      const updateEditedFeatures = async () => {
        const targets = e.target._targets || {};

        const updates = Object.keys(targets).map((key) => async () => {
          const feature = targets[key];
          layerContainer.eachLayer((layer) => {
            if (layer.properties && feature.properties && layer.properties._id === feature.properties._id) {
              this.onLayerUpdated({ target: layer });
            }
          });
        });

        return Promise.all(updates).then(() => {
          this.setState({
            isGlobalEditing: false,
            layerEditingId: '',
            editingLayerType: null,
          });
        });
      };

      await updateEditedFeatures();
    } else {
      this.setState({ isGlobalEditing: true, editingLayerType: subNavigationItemSelected });
    }
  };

  onLayerUpdated = (e) => {
    const { selectedAreas, editingLayerType } = this.state;
    const { features } = this.getFeaturesAndLayerTypes(editingLayerType);
    const { data = [] } = features;
    const layer = e.target;
    const featureId = layer.properties._id;

    const feature = find(data, (f) => f._id === featureId);
    const geojson = layer.toGeoJSON();

    const updated = {
      ...feature,
      geojson,
    };

    const payload = pickBy(updated, identity);

    if (this.state.isGlobalEditing || (feature._id === this.state.layerEditingId)) {
      if (editingLayerType && editingLayerType.includes(ROOFING_NAME)) {
        this.props.updateRoofingMeasurementFeatureById(feature._id, payload);
      } else if (editingLayerType && editingLayerType.includes(LANDSCAPING_NAME)) {
        this.props.updateLandscapeMeasurementFeatureById(feature._id, payload);
      } else {
        updated.updatedAt = new Date().toISOString();
        this.props.updateFeatureById(feature._id, updated, selectedAreas); // eslint-disable-line
      }
    }

    this.closeEditPopup();
    this.closePopup();
  };

  /* ----------------------- INVENTORY ITEMS MARKER METHODS --------------------------------- */
  onMarkerInventoryCreated = (evt, layer) => {
    const { subNavigationItemSelected } = this.state;
    let newState = {};
    if (subNavigationItemSelected === HVAC_NAME) newState = { hvacInventory: { isToggled: true, layer } };
    if (subNavigationItemSelected === LANDSCAPING_NAME) newState = { landscapeInventory: { isToggled: true, layer } };
    this.setState(newState);
  }

  onStartDrawingInventoryItem = (evt, instance) => {
    this.setState({
      isDrawing: (evt.layerType === 'polygon'),
      workingLayer: instance,
      shape: `inventory:${evt.layerType}`,
    });
  }
  /* ----------------------- INVENTORY ITEMS MARKER METHODS (END) --------------------------------- */

  getChanges = () => {
    const { changes } = this.props;
    if (changes.isLoading) return changes;
    const updated = changes.data.map((change) => {
      if (!change.feature) return change;
      const { layerContainer } = this.PMControl.context;

      let isOnMap = false;

      layerContainer.eachLayer((layer) => {
        if (layer.properties && layer.properties._id === (change.feature && change.feature._id)) {
          isOnMap = true;
        }
      });

      const isLayerPresent =
        !!(change.layer && find(this.props.layers.data, (l) =>
          l._id === change.layer._id
        ));

      return {
        ...change,
        layer: {
          ...change.layer,
          isPresent: isLayerPresent,
          restore: () =>
            this.props.createLayer({ ...change.layer, type: 'RESTORE_LAYER' }),
        },
        feature: {
          ...change.feature,
          isOnMap,
          addToMap: () => this.handleCreate({ ...change.feature, type: 'RESTORE_FEATURE' }),
          onClick: () => {
            if (!this.state.activePopupId) {
              this.openPopup(change.feature._id);
            }
          },
          onMouseOver: () => this.highlightPolygon(change.feature._id),
          onMouseLeave: () => this.resetPolygon(change.feature._id),
        },
      };
    });

    return {
      ...changes,
      data: updated,
    };
  }

  getLayerType = (properties) => {
    const { layers, layerId, feature } = properties;
    const { data } = layers;

    const layer = data.find((l) => l._id === layerId);

    if (!layer) return (feature && feature.layerType) || null;

    if (feature && feature.layerType) {
      if (feature.layerType.includes(MEASUREMENT_LAYER_ROOFING)) {
        if (layer.name.includes('Zone')) {
          return MEASUREMENT_LAYER_ROOFING_ZONE;
        }
        return MEASUREMENT_LAYER_ROOFING_REPAIR;
      } else if (feature.layerType.includes(MEASUREMENT_LAYER_LANDSCAPE)) {
        if (layer.name.includes('Zone')) {
          return MEASUREMENT_LAYER_LANDSCAPE_ZONE;
        }
        return MEASUREMENT_LAYER_LANDSCAPE_REPAIR;
      }
    }

    return layer.name.includes('Zone') ? 'zone' : 'repair';
  };

  getFeaturesAndLayerTypes = (layerType) => {
    const {
        features,
        layers,
        roofingMeasurementFeatures,
        roofingMeasurementLayers,
        landscapeMeasurementFeatures,
        landscapeMeasurementLayers,
      } = this.props;

    if (layerType && layerType.includes(ROOFING_NAME)) {
      return { features: roofingMeasurementFeatures, layers: roofingMeasurementLayers };
    }

    if (layerType && layerType.includes(LANDSCAPING_NAME)) {
      return { features: landscapeMeasurementFeatures, layers: landscapeMeasurementLayers };
    }

    return { features, layers };
  }

  getAreaPhotos = (selectedAreas = {}) => {
    const { siteId, token } = this.props.route.match.params;
    const selected =
      !isEmpty(selectedAreas)
      ? selectedAreas
      : this.state.selectedAreas;

    if (!isEmpty(selected)) {
      Object.keys(selected).forEach((areaId) => {
        this.props.getAreaPhotos(siteId, areaId, token);
      });
      this.cycle();
    }
  }

  getProperCoordinates = (c = []) => {
    const isNull = c[0] && c[0][0] && (c[0][0][0] === null || c[0][0][0] === undefined);
    const isInvalid = !c[0] || !c[0][0] || isNull;

    const filteredCoordinates = c.filter((i) => i[0] && i[0][0] !== null);
    const properCoordinates = isInvalid
      ? [[[0, 0]]]
      : filteredCoordinates.map((i) => {
        const isValid = i[0] && i[0][0] !== null;
        if (!isValid) return [[0, 0]];
        return i;
      });
    return properCoordinates;
  }

  handleSaveHVAC = (values) => {
    const { hvacInventory } = this.state;
    const { createHVAC, updateHvacById } = this.props;
    const { map } = this.PMControl.context;
    const data = {};
    Object.keys(values).forEach((value) => {
      if (value === 'unitType') {
        data[value] = JSON.parse(values[value].value);
      } else {
        data[value] = values[value].value || values[value];
      }
    });

    if (hvacInventory.layer) {
      const geojson = hvacInventory.layer.toGeoJSON();
      data.geojson = geojson;
      data._id = ObjectID.generate(); // eslint-disable-line
      data.layerType = `HVAC:${hvacInventory.layer.layerType}`;

      map.removeLayer(hvacInventory.layer);

      createHVAC(data);
    } else if (hvacInventory.itemSelected) {
      const geojson = hvacInventory.itemSelected.layer.toGeoJSON();
      const hvacId = hvacInventory.itemSelected.values._id;
      data.geojson = geojson;
      data.layerType = `HVAC:${hvacInventory.itemSelected.layer.layerType}`;
      data._id = hvacId; // eslint-disable-line

      updateHvacById(hvacId, data);
    }

    this.setState({ hvacInventory: { isToggled: false, layer: null, itemSelected: null } });
  }

  handleSaveInventoryLandscape = (values) => {
    const { landscapeInventory } = this.state;
    const { createLandscapeInventoryItem, updateLandscapeInventoryItemById } = this.props;
    const { map } = this.PMControl.context;
    const data = {};
    Object.keys(values).forEach((value) => {
      if (value === 'inventoryType') {
        data[value] = JSON.parse(values[value].value);
      } else {
        data[value] = values[value].value || values[value];
      }
    });

    data.layerType = 'landscapeInventory';

    if (landscapeInventory.layer) {
      const geojson = landscapeInventory.layer.toGeoJSON();
      data.geojson = geojson;
      data._id = ObjectID.generate(); // eslint-disable-line
      data.layerType = `${LANDSCAPING_NAME}:${landscapeInventory.layer.layerType}`;

      map.removeLayer(landscapeInventory.layer);

      createLandscapeInventoryItem(data);
    } else if (landscapeInventory.itemSelected) {
      const geojson = landscapeInventory.itemSelected.layer.toGeoJSON();
      const itemId = landscapeInventory.itemSelected.values._id;
      data.geojson = geojson;
      data._id = itemId;
      data.layerType = `${LANDSCAPING_NAME}:${landscapeInventory.itemSelected.layer.layerType}`;

      updateLandscapeInventoryItemById(itemId, data);
    }

    this.setState({ landscapeInventory: { isToggled: false, layer: null, itemSelected: null } });
  }

  handleDeleteInventoryLandscape = (e) => {
    e.preventDefault();
    const { landscapeInventory } = this.state;
    const { deleteLandscapeInventoryItemById } = this.props;
    const itemId = landscapeInventory.itemSelected.values._id;

    deleteLandscapeInventoryItemById(itemId);
    this.setState({ landscapeInventory: { isToggled: false, itemSelected: null } });
  }

  handleDeleteHvac = (e) => {
    e.preventDefault();
    const { hvacInventory } = this.state;
    const { deleteHvacById } = this.props;
    const hvacId = hvacInventory.itemSelected.values._id; // eslint-disable-line

    deleteHvacById(hvacId);
    this.setState({ hvacInventory: { isToggled: false, itemSelected: null } });
  }

  handleHvacInventorySideBarToggle = ({ isOpen }) => {
    const { hvacInventory } = this.state;
    const { map } = this.PMControl.context;
    const { isToggled, layer, itemSelected } = hvacInventory;
    if (!isOpen && isToggled) {
      const newState = { hvacInventory: { isToggled: false, layer: null } };
      if (layer) {
        layer.unbindTooltip();
        map.removeLayer(layer);
      }

      if (itemSelected) newState.hvacInventory.itemSeleccted = null;
      this.setState(newState);
    }
  }

  handleLandscapeInventorySidebarToggle = ({ isOpen }) => {
    const { landscapeInventory } = this.state;
    const { map } = this.PMControl.context;
    const { isToggled, layer, itemSelected } = landscapeInventory;
    if (!isOpen && isToggled) {
      const newState = { landscapeInventory: { isToggled: false, layer: null } };
      if (layer) map.removeLayer(layer);
      if (itemSelected) newState.landscapeInventory.itemSeleccted = null;

      this.setState(newState);
    }
  }

  handleSideBarHVACToggle = ({ isOpen }) => {
    const { hvacInventory: { layer, isToggled, itemSelected } } = this.state;
    const { map } = this.PMControl.context;

    if (!isOpen && isToggled) {
      const newState = { hvacInventory: { layer: null, isToggled: false } };

      if (layer) map.removeLayer(layer);
      if (itemSelected) newState.hvacInventory.itemSelected = null;
    }
  }

  handleSelectSubItem = (e) => {
    this.toggleLayersOff();
    this.setState({ subNavigationItemSelected: e.target.value });
  }

  resync = (e) => {
    e.preventDefault();
    this.props.resync();
  }

  switchTab = (name) => () => {
    this.setState({ activeTab: name });
    this.props.resync();
  }

  subtractPolygon = (featureId) => (e) => {
    e.preventDefault();

    this.closeEditPopup();
    this.closePopup();

    const { map, layerContainer } = this.PMControl.context;
    let usedLayer;

    layerContainer.eachLayer((layer) => {
      if (layer.properties._id === featureId) {
        usedLayer = layer;
      }
    });

    if (!usedLayer) return;

    const all = map._layers; // eslint-disable-line

    // find all layers that intersect with `layer`, the just drawn cutting layer
    const layers = Object.keys(all)
      // convert object to array
      .map((l) => all[l])
      // only layers handled by leaflet.pm
      .filter((l) => l.pm)
      // only polygons
      .filter((l) => l instanceof L.Polygon)
      // exclude the drawn one
      .filter((l) => l !== usedLayer)
      // only layers with intersections
      .filter((l) => {
        try {
          return !!intersect(usedLayer.toGeoJSON(), l.toGeoJSON());
        } catch (e) { // eslint-disable-line
          console.error('You cant cut polygons with self-intersections'); // eslint-disable-line no-console
          return false;
        }
      });

    // loop through all layers that intersect with the drawn (cutting) layer
    layers.forEach((l) => {
      // the resulting layers after the cut
      const resultingLayers = [];

      // find layer difference
      const diff = difference(l.toGeoJSON(), usedLayer.toGeoJSON());

      // if result is a multipolygon, split it into regular polygons
      if (diff && diff.geometry && diff.geometry.type === 'MultiPolygon') {
        const geoJSONs = diff.geometry.coordinates.reduce((arr, coords) => {
          arr.push({ type: 'Polygon', coordinates: coords });
          return arr;
        }, []);

        // add new layers to map
        geoJSONs.forEach((g) => {
          const newL = L.geoJSON(g, l.options);
          resultingLayers.push(newL);

          // give the new layer the original options
          newL.pm.enable(this.options);
          newL.pm.disable();
        });
      } else {
        // add new layer to map
        const newL = L.geoJSON(diff, l.options);
        resultingLayers.push(newL);

        // give the new layer the original options
        newL.pm.enable(this.options);
        newL.pm.disable();
      }

      // fire pm:cut on the cutted layer
      l.fire('pm:cut', {
        layer: l,
        resultingLayers,
      });

      // fire pm:cut on the map for each cutted layer
      map.fire('pm:cut', {
        cuttedLayer: l,
        resultingLayers,
      });

      // add templayer prop so pm:remove isn't fired
      l._pmTempLayer = true; // eslint-disable-line
      usedLayer._pmTempLayer = true; // eslint-disable-line

      // remove old layer and cutting layer
      l.remove();
      usedLayer.remove();
    });
  };

  stopEditMode = () => {
    this.setState({
      isEditing: false,
      layerEditingId: '',
    });
    if (this.state.keypressEventListener) {
      document.removeEventListener('keydown', this.state.keypressEventListener);
      this.setState({ keypressEventListener: null });
    }
  }

  saveEditing = () => {
    const { layerContainer } = this.PMControl.context;

    layerContainer.eachLayer((layer) => {
      if (layer.layerType !== 'marker') {
        layer.fire('pm:update');
        layer.dragging.disable();
        layer.transform.disable();
      }
    });

    this.stopEditMode();

    return false;
  };

  cancelEditing = () => {
    const { layerContainer } = this.PMControl.context;

    layerContainer.eachLayer((layer) => {
      if (layer.layerType !== 'marker') {
        layer.off('pm:update');
        layer.pm.disable();
        layer.dragging.disable();
        layer.transform.disable();
      }
    });

    this.cycle();
    this.stopEditMode();

    return false;
  };

  loadControlsState = (isFirstLoad = false) => {
    let parsed = {};
    const restored = window.localStorage.getItem('mapControlsState');

    if (restored) {
      parsed = JSON.parse(restored);

      const { siteId, featureId = null } = this.props.route.match.params;
      if (!isEmpty(parsed) && parsed[siteId]) {
        const { selectedAreas, showOrtho, showPavement, showHVAC, showRoofing } = parsed[siteId];
        const featurePavement = (featureId ? true : showPavement);
        const showPavementStatus = isFirstLoad ? featurePavement : showPavement;
        const selectedToggles = { selectedAreas, showOrtho, showPavement: showPavementStatus, showHVAC, showRoofing };
        this.setState(() => ({ selectedToggles }));
      }
    }

    return parsed;
  };

  saveControlsState = () => {
    const existingState = this.loadControlsState();
    const { siteId } = this.props.route.match.params;
    const { selectedAreas, showOrtho, showPavement, showHVAC, showRoofing } = this.state;
    const mapControlsState = { selectedAreas, showOrtho, showPavement, showHVAC, showRoofing };

    existingState[siteId] = mapControlsState;
    const existingStateString = JSON.stringify(existingState);
    window.localStorage.setItem('mapControlsState', existingStateString);
    this.cycle();
  };

  refPMControl = (c) => {
    this.PMControl = c;
    this.cycle();
  };

  toggleDragging = (layer, draggable) => {
    layer.pm.disable();
    layer.pm.enable({ draggable });
  };

  convertFeatureToLayer = ({ feature, layerContainer }) => {
    const geojson = cloneDeep(feature.geojson);
    const isSinglePointMarker = feature.layerType && feature.layerType.split(':')[1] === 'marker';

    if (!geojson.geometry) return;

    const isPolyline = geojson.geometry && geojson.geometry.type && geojson.geometry.type === 'LineString';

    layerOptions.showMeasurements = !this.props.readOnly && isPolyline;

    if (layerOptions.showMeasurements) {
      layerOptions.measurementOptions = {
        formatDistance(distance) {
          return readableDistance(distance, false, true);
        },
      };
    }

    if (!isSinglePointMarker) {
      const coordinates = cloneDeep(geojson.coordinates);
      const properCoordinates = this.getProperCoordinates(coordinates);
      geojson.coordinates = properCoordinates;
    }

    const geometryLayer = L.GeoJSON.geometryToLayer(geojson.geometry, layerOptions);

    geometryLayer.properties = {
      ...feature,
      geojson: null,
    };

    // if feature contains patchNumber, bind a tooltip to layer
    if (feature.patchNumber) {
      geometryLayer.bindTooltip(feature.patchNumber, { permanent: true, interactive: false });
    }

    if (geometryLayer.dragging) geometryLayer.dragging.disable();
    if (geometryLayer.transform) geometryLayer.transform.disable();

    if (feature.color && geometryLayer.setStyle) {
      geometryLayer.setStyle({ color: feature.color });
    }

    if (feature.layerType && feature.layerType.includes('HVAC')) {
      if (feature.layerType.split(':')[1] === 'marker') {
        geometryLayer.setIcon(CustomIcon(feature.unitType.color));
      } else {
        geometryLayer.setStyle({ color: feature.unitType.color });
      }
      geometryLayer.layerType = feature.layerType.split(':')[1];
      geometryLayer.bindTooltip(feature.unitNumber, { permanent: true, interactive: false });
    }

    if (feature.layerType && feature.layerType.includes(`${LANDSCAPING_NAME}:`)) {
      if (feature.layerType.split(':')[1] === 'marker') {
        geometryLayer.setIcon(CustomIcon(feature.color));
      }
      geometryLayer.layerType = feature.layerType.split(':')[1];
    }

    const editOpts = {
      snappable: true,
      allowSelfIntersection: true,
      preventVertexEdit: false,
      preventMarkerRemoval: false,
    };

    if (geometryLayer.pm && !isSinglePointMarker) geometryLayer.pm.enable(editOpts);
    geometryLayer.on('pm:update', this.onLayerUpdated);

    layerContainer.addLayer(geometryLayer);

    if (!isSinglePointMarker) geometryLayer.bringToBack();

    const clickHandler = () => {
      const isNotEditing =
        !geometryLayer.pm.enabled()
        && !this.state.layerEditingId
        && !this.state.isDrawing
        && !this.state.isGlobalEditing;

      if (isNotEditing) {
        if (feature.type || feature.layerId) {
          this.openPopup(feature._id);
        } else {
          this.openEditPopup(feature._id)();
        }
      } else if (this.state.isGlobalEditing) {
        if (geometryLayer.properties._id !== this.state.layerEditingId) {
          this.setState({ layerEditingId: geometryLayer.properties._id });
        }
        let draggable = false;
        Mousetrap.bind('space', () => {
          if (!draggable) {
            draggable = true;
            this.toggleDragging(geometryLayer, draggable);
          }
        }, 'keydown');
        Mousetrap.bind('space', () => {
          if (draggable) {
            draggable = false;
            this.toggleDragging(geometryLayer, draggable);
          }
        }, 'keyup');
        layerContainer.eachLayer((layer) => {
          if (layer !== geometryLayer) {
            layer.pm.disable();
          }
        });
      }
      layerContainer.eachLayer((layer) => {
        if (layer !== geometryLayer) {
          layer.pm.disable();
        }
      });
    };

    const clickHvacHandler = () => {
      this.setState(() => ({
        hvacInventory: {
          isToggled: true,
          itemSelected: { layer: geometryLayer, values: feature },
        },
      }));
    };

    const clickLandscapeInventoryHandler = () => {
      this.setState(() => ({
        landscapeInventory: {
          isToggled: true,
          itemSelected: { layer: geometryLayer, values: feature },
        },
      }));
    };

    const clickRoofingMeasurementLayerHandler = () => {
      if (!feature.type) {
        this.openEditPopup(feature._id)();
      } else {
        this.openPopup(feature._id);
      }
    };

    let clickFunctionHandler = clickHandler;

    if (feature.layerType && feature.layerType.includes(`${LANDSCAPING_NAME}:`)) {
      clickFunctionHandler = clickLandscapeInventoryHandler;
    } else if (feature.layerType && feature.layerType.includes('HVAC')) {
      clickFunctionHandler = clickHvacHandler;
    } else if (feature.layerType === MEASUREMENT_LAYER_ROOFING) {
      clickFunctionHandler = clickRoofingMeasurementLayerHandler;
    }

    geometryLayer.on({
      click: clickFunctionHandler,
    });
  };


  cycle = debounce(() => {
    console.log('>..cycling'); // eslint-disable-line
    const { showPavement, showHVAC, showLandscape, showRoofing } = this.state;

    if (!this.PMControl) return;

    this.generateShortcuts(this.PMControl.context.map);

    // clear all layers
    const { layerContainer } = this.PMControl.context;
    layerContainer.clearLayers();

    if (showHVAC) this.renderHvacLayers();
    if (showLandscape) this.renderLandscapeLayers();
    if (showPavement) {
      this.renderPavementMeasurementLayers(layerContainer);
      this.renderPavementConditionLayers(layerContainer);
    }
    if (showRoofing) this.renderRoofingMeasurementLayers(layerContainer);
  }, 40);

  generateShortcuts = (map) => {
    const { drawToolsShortcuts } = this.state;

    if (!drawToolsShortcuts) {
      keyboardShortcuts.forEach((sc) => {
        Mousetrap.bind(sc.shortcut, this.toggleDrawToolShortcut(map, sc.shape), 'keyup');
      });

      Mousetrap.bind(['mod+l', 'alt+n'], this.createLayerShortcut);

      this.setState({ drawToolsShortcuts: true });
    }
  };

  toggleDrawToolShortcut = (map, shape) => () => {
    if (shape === 'Edit') {
      map.pm.toggleGlobalEditMode();
    } else {
      map.pm.Draw[shape].toggle();
    }
  }

  createLayerShortcut = (e) => {
    const { createLayer, layers } = this.props;
    const index = layers.data.length + 1;
    const newLayer = {
      _id: ObjectID.generate(),
      index,
      name: '',
    };
    e.preventDefault();
    createLayer(newLayer);
    return false;
  };


  duplicatePolygon = (featureId, layerType) => (e) => {
    e.preventDefault();

    const { features } = this.getFeaturesAndLayerTypes(layerType);
    if (isEmpty(features)) return;
    const feature = find(features.data, (f) => f._id === featureId); // eslint-disable-line
    if (!feature) return;

    const dupie = {
      ...feature,
      title: `${feature.title} (duplicated)`,
      _id: ObjectID.generate(),
    };

    if (layerType && layerType.includes(ROOFING_NAME)) {
      this.props.createRoofingMeasurementFeature(dupie);
    } else if (layerType && layerType.includes(LANDSCAPING_NAME)) {
      this.props.createLandscapeMeasurementFeature(dupie);
    } else {
      this.props.createFeature(dupie);
    }
  };

  deleteLastPoint = () => {
    if (!this.state.workingLayer) return;

    if (this.state.shape && this.state.shape.includes('inventory')) {
      this.state.workingLayer.deleteLastVertex();
      return;
    }

    const layer = this.state.workingLayer;
    const shape = this.state.shape;

    layer.pm.enable();
    const markers = layer.pm._markers; // eslint-disable-line
    const map = layer.pm._map; // eslint-disable-line
    // stop drawing
    if (markers.length <= 1) {
      layer.pm._map.pm.disableDraw(shape); // eslint-disable-line
      layer.pm.disable();
      return;
    }
    // delete last point when there are only 2 points
    if (markers.length === 2) {
      const latlngs = layer._latlngs; // eslint-disable-line
      const latlng = latlngs[0];
      // map.pm.disableDraw('Poly');
      map.pm.disableDraw(shape);
      map.pm.enableDraw(shape);
      map.fireEvent('click', {
        latlng,
        layerPoint: map.latLngToLayerPoint(latlng),
        containerPoint: map.latLngToContainerPoint(latlng),
      });
      layer.pm.disable();
      return;
    }
    // delete last point when there are more then 2 points
    const marker = markers[markers.length - 1];
    layer.pm._removeMarker({ target: marker }); // eslint-disable-line
    const ls = (shape === 'Line') ? map.pm.Draw.Line._layerGroup._layers : map.pm.Draw.Poly._layerGroup._layers; // eslint-disable-line
    const d = Object.keys(ls).pop();
    ls[d].remove();
    delete ls[d];
    (shape === 'Line') ? map.pm.Draw.Line._syncHintLine() : map.pm.Draw.Poly._syncHintLine(); // eslint-disable-line
    layer.pm.disable();
  };

  saveEditPopupData = (type, featureId, payload = {}, layerType) => {
    const { features } = this.getFeaturesAndLayerTypes(layerType);
    const { data = [] } = features;
    const { selectedAreas } = this.state;

    if (isEmpty(payload)) return;
    if (!featureId) return;
    if (isEmpty(data)) return;

    const foundFeature = data.find((f) => f._id === featureId);
    if (!foundFeature) return;
    // duplicating existing feature
    const feature = {
      ...foundFeature,
      type,
      ...payload,
    };

    const values = pickBy(feature, identity);

    if (layerType && layerType.includes(MEASUREMENT_LAYER_ROOFING)) {
      this.props.updateRoofingMeasurementFeatureById(featureId, values);
    } else if (layerType && layerType.includes(MEASUREMENT_LAYER_LANDSCAPE)) {
      this.props.updateLandscapeMeasurementFeatureById(featureId, values);
    } else {
      this.props.updateFeatureById(featureId, feature, selectedAreas);
    }

    this.openPopup(featureId);

    this.closeEditPopup();
    this.closePopup();
  };

  deletePolygon = (featureId, layerType) => (e) => {
    e.preventDefault();
    const { selectedAreas } = this.state;
    const { deleteFeatureById, deleteRoofingMeasurementFeatureById, deleteLandscapeMeasurementFeatureById } = this.props;
    const layerContainer = this.PMControl.context.layerContainer;
    layerContainer.eachLayer((layer) => {
      if (layer.properties && layer.properties._id === featureId) {
        layerContainer.removeLayer(layer);
        if (layerType && layerType.includes(MEASUREMENT_LAYER_ROOFING)) {
          deleteRoofingMeasurementFeatureById(featureId);
        } else if (layerType && layerType.includes(MEASUREMENT_LAYER_LANDSCAPE)) {
          deleteLandscapeMeasurementFeatureById(featureId);
        } else {
          deleteFeatureById(layer.properties._id, {}, selectedAreas);
        }
        this.closeEditPopup();
        this.closePopup();
      }
    });
  };

  editPolygon = (type) => (featureId, layerType) => (e) => {
    e.preventDefault();
    const { features } = this.getFeaturesAndLayerTypes(layerType);
    if (isEmpty(features.data) || !featureId) return;

    const feature = find(features.data, (f) => f._id === featureId);

    if (!feature) return;

    const layerContainer = this.PMControl.context.layerContainer;

    layerContainer.eachLayer((layer) => {
      if (layer.properties._id && layer.properties._id === featureId) {
        this.closeEditPopup();
        this.closePopup();
        this.setState({
          layerEditingId: featureId,
          isEditing: true,
          editingLayerType: layerType,
        });

        if (type === 'scale') {
          layer.dragging.enable();
          layer.transform.enable({
            rotation: true,
            dragging: true,
            scaling: true,
            handlerOptions: {
              dashArray: '3, 6',
            },
            boundsOptions: {
              dashArray: '3, 6',
            },
            rotateHandleOptions: {
              dashArray: '3, 6',
            },
          });
        } else {
          layer.pm.enable({
            draggable: false,
          });
        }

        const keypressEventListener = (ev) => {
          if (ev.key === 'Escape') this.cancelEditing();
          if (ev.key === 'Enter') this.saveEditing();
        };

        this.setState({ keypressEventListener });
        document.addEventListener('keydown', keypressEventListener);
      }
    });
  };

  extractLatLngBox = (latLngBox) => {
    const { north, east, west, south } = latLngBox;
    return [[north, west], [south, east]];
  };

  openPopup = (popupId) => this.setState(() => ({ activePopupId: popupId }));

  closePopup = () => {
    const { activePopupId } = this.state;
    if (activePopupId) this.setState({ activePopupId: null });
  };

  toggleOrtho = () => {
    this.setState(() => ({
      showOrtho: !this.state.showOrtho,
    }), this.saveControlsState);
  };

  togglePavement = (explicitState = null) => {
    const newState = explicitState || !this.state.showPavement;
    this.setState(() => ({ showPavement: newState }), this.saveControlsState);
  };

  toggleHVAC = (explicitState = null) => {
    this.setState((prevState) => ({
      showHVAC: explicitState || !prevState.showHVAC,
    }), this.saveControlsState);
  };

  toggleLandscape = (explicitState = null) => {
    this.setState((prevState) => ({
      showLandscape: explicitState || !prevState.showLandscape,
    }), this.saveControlsState);
  }

  toggleRoofing = (explicitState = null) => {
    this.setState((prevState) => ({
      showRoofing: explicitState || !prevState.showRoofing,
    }), this.saveControlsState);
  }

  toggleLayersOff = () => {
    this.setState({
      showPavement: false,
      showHVAC: false,
      showLandscape: false,
      showRoofing: false,
      selectedAreas: {},
    }, this.saveControlsState);
  }

  openEditPopup = (popupId) => (e) => {
    if (e) e.preventDefault();
    this.setState({ activeEditPopupId: popupId, activePopupId: null });
  };

  closeEditPopup = (infoPopupId) => this.setState({ activeEditPopupId: null, activePopupId: infoPopupId });

  openSideMenuSharedMap = (polygonId) => this.setState({ showSharedRepairInfo: true, activePopupId: polygonId });
  closeSideMenuSharedMap = () => this.setState({ showSharedRepairInfo: false, activePopupId: null });

  handleCreateWithLayer = (e) => {
    const payload = {};

    const geojson = { ...e.toGeoJSON() };

    payload.title = geojson.properties.LAYER;
    payload.geojson = geojson;

    const aci = Number(geojson.properties.COLOR) - 1;
    const mapped = ACIMapper.getByACI(aci);

    if (mapped && mapped.hex) {
      payload.color = mapped.hex;
    }

    this.handleCreate(payload);
  };

  handleCreate = (payload) => {
    const { features } = this.props;
    const { subNavigationItemSelected } = this.state;
    const { selectedAreas } = this.state;

    let lowestIndex = -1;

    features.data.forEach(({ index }) => {
      if (index !== 'undefined' && index === lowestIndex) {
        lowestIndex = index - 1;
      }
    });

    const prepared = {
      ...payload,

      createdAt: new Date(),
      _id: ObjectID.generate(), // eslint-disable-line
      index: lowestIndex,

      layerId: payload.layerId || null,
      title: payload.title || null,
      color: payload.color || '#FF7077',
    };
    const popupType = prepared.type && prepared.type === 'RESTORE_FEATURE' ? 'activePopupId' : 'activeEditPopupId';

    switch (subNavigationItemSelected) {
      case PAVEMENT_NAME:
        this.props.createFeature(prepared, selectedAreas);
        break;
      case LANDSCAPING_NAME:
        this.props.createLandscapeMeasurementFeature(prepared);
        break;
      case ROOFING_NAME:
        this.props.createRoofingMeasurementFeature(prepared);
        break;
      default:
        break;
    }

    this.setState({
      newLayerId: prepared._id,
      [popupType]: prepared._id,
    });
  };

  stylePolygon = (id, style = {}) => {
    const { layerContainer } = this.PMControl.context;

    if (layerContainer) {
      layerContainer.eachLayer((layer) => {
        if (layer.properties._id === id) {
          layer.setStyle(style);
        }
      });
    }
  };

  toggleTooltip = (id, info, color, tooltipAction) => {
    const { layerContainer } = this.PMControl.context;
    if (layerContainer) {
      layerContainer.eachLayer((layer) => {
        if (layer.properties._id === id) {
          layer.bindTooltip(`${info}`);
          if (tooltipAction === 'close') {
            layer.unbindTooltip();
          } else {
            layer.openTooltip();
          }
          layer.setIcon(CustomIcon(color));
        }
      });
    }
  }

  highlightPolygon = (id) => {
    this.stylePolygon(id, {
      fillOpacity: 0.85,
    });
  };

  resetPolygon = (id) => {
    this.stylePolygon(id, {
      fillOpacity: 0.5,
    });
  };

  highlightInventoryItemsGroup = (identifiers) => {
    if (typeof identifiers === 'object') {
      identifiers.forEach((identifier) => {
        this.toggleTooltip(identifier.id, identifier.qty, '#7CFC00', 'open');
      });
    } else {
      this.stylePolygon(identifiers, {
        fillOpacity: 0.85,
      });
    }
  }

  resetInventoryItemsGroup = (identifiers) => {
    if (typeof identifiers === 'object') {
      identifiers.forEach((identifier) => {
        this.toggleTooltip(identifier.id, identifier.qty, '#228B22', 'close');
      });
    } else {
      this.stylePolygon(identifiers, {
        fillOpacity: 0.5,
      });
    }
  }

  createPopup = (popupProps, action) => {
    const layerType = this.getLayerType(popupProps);
    const popupType = popupSelector(layerType, action);

    const position = [popupProps.position.lat, popupProps.position.lng];
    const { properties: { inputArea } } = popupProps.data;
    const { features, layers } = this.getFeaturesAndLayerTypes(popupProps.data.properties.layerType);

    const { showSharedRepairInfo } = this.state;

    this.inputArea = inputArea || (inputArea === 0) ? inputArea : null;
    const { readOnly, siteRepairPhotos, isLoadingPhotos } = this.props;
    const showAsSideBar = readOnly && siteRepairPhotos && siteRepairPhotos.length;
    if (readOnly && isLoadingPhotos) {
      return null;
    }

    const renderingPopupProps = {
      ...popupProps,
      isShared: readOnly,
      showAsSideBar,
      key: `${popupProps.id}_${popupType}_${layerType}_${Math.random()}`,
      features: features.data,
      layers: layers.data,
      position,
      layerType,
      openEditPopup: this.openEditPopup,
      closeEditPopup: this.closeEditPopup,
      saveEditData: this.saveEditPopupData,
      onClose: this.closePopup,
      readOnly,
      showSharedRepairInfo,
      closeSideMenuSharedMap: this.closeSideMenuSharedMap,
    };

    return PopupRenderer[popupType](renderingPopupProps);
  };

  closeModal = () => {
    this.setState(() => ({ isModalOpen: false, videoArea: null }));
  };

  openAreaVideos = (videoArea) => {
    this.setState(() => ({ videoArea, isModalOpen: true }));
  };

  toggleSideBar = () => {
    const { toggleSideBarMap } = this.props;
    const element = this.arrowSideBar.current;

    if (element.className === 'arrow-side-bar-transform-right') {
      element.className = 'arrow-side-bar-transform-left';
    } else {
      element.className = 'arrow-side-bar-transform-right';
    }

    toggleSideBarMap();
  };

  /* ---------------------- SCREENSHOT LEAFLET METHODS ---------------------- */
  handleSnapped = (file) => {
    this.setState({ isSavingScreenshot: true, screenshotFile: file });
  };

  showToastError = (message) => {
    this.toastId = toast.error(message, SCREENSHOT_TOAST_ERROR_CONFIG);
  };

  shouldImageSnap = () => {
    const { showOrtho } = this.state;
    const { layers } = this.props;
    const selectedLayers = getSelectedLayers(layers.data);

    if (showOrtho) {
      this.showToastError('Please, deactivate Orthomosaic to take the screenshot');
      return false;
    }

    if (selectedLayers.length > 1) {
      this.showToastError('Please, select just 1 (ONE) layer as maximum');
      return false;
    }

    return true;
  }

  handleStartSnappingImage = () => {
    this.toastId = toast.info('Taking screenshot! Wait a moment please...', {
      autoClose: false,
      closeButton: false,
      position: 'bottom-center',
      hideProgressBar: true,
      draggable: false,
      draggablePercent: 80,
      closeOnClick: false,
    });
  };

  handleFinishSnappingImage = (error) => {
    if (error) {
      console.log(error); // eslint-disable-line no-console
    }
    toast.dismiss();
  };

  handleCloseSavingImage = () => {
    this.setState({ isSavingScreenshot: false, screenshot: null });
  };

  saveScreenshot = () => {
    const { screenshotFile } = this.state;
    const { layers, route, saveScreenshot } = this.props;
    const selectedLayer = getSelectedLayers(layers.data)[0];
    const { siteId } = route.match.params;
    const trimmedName = selectedLayer ? selectedLayer.name.replace(/\s/g, '') : 'property';
    saveScreenshot({ trimmedName, screenshotFile, siteId });
    this.setState({ isSavingScreenshot: false });
  };

  /* ---------------------------------------------------------------------------------------- */

  renderHvacLayers = () => {
    const { hvacs: { data } } = this.props;
    const { layerContainer } = this.PMControl.context;

    data.forEach((hvac) => this.convertFeatureToLayer({ feature: hvac, layerContainer }));
  };

  renderLandscapeLayers = () => {
    const { layerContainer } = this.PMControl.context;

    this.renderLandscapeInventoryItems(layerContainer);
    this.renderLandscapeMeasurementLayers(layerContainer);
  };

  renderLandscapeMeasurementLayers = (layerContainer) => {
    const { landscapeMeasurementFeatures, landscapeMeasurementLayers } = this.props;

    if (isEmpty(landscapeMeasurementFeatures.data)) return;

    const activeLayersOrdered = {};
    landscapeMeasurementLayers.data.filter((l) => l.isActive).forEach((l) => {
      activeLayersOrdered[l._id] = l.index; // eslint-disable-line
    });

    const filtered = landscapeMeasurementFeatures.data.filter((f) => {
      if (!f.layerId) return true;
      const layerIndex = activeLayersOrdered[f.layerId];
      const isHidden = !f.layerId || (!layerIndex && layerIndex !== 0);
      return !isHidden;
    });

    const unique = uniqBy(filtered, '_id');

    const prepared = unique.map((f) => {
      const layerIndex = activeLayersOrdered[f.layerId] + 1;
      const featureIndex = ((!f.index || f.index < 0) ? 0 : f.index) + 1;

      const baseIndex = f.layerId ? (layerIndex * layerIndex) : featureIndex;
      const index = baseIndex * featureIndex;

      return {
        ...f,
        index,
      };
    });

    const sorted = sortBy(prepared, 'index');

    sorted.forEach((feature) => {
      this.convertFeatureToLayer({
        feature,
        layerContainer,
      });
    });

    const popups = [];

    layerContainer.eachLayer((layer) => {
      if (layer.properties.layerType === MEASUREMENT_LAYER_LANDSCAPE) {
        const feature = find(sorted, (f) => f._id === layer.properties._id);
        const payload = getPolygonPayload(layer);
        const popupProps = {
          ...payload,
          feature,
          siteRepairs: this.props.siteRepairs,
          position: payload.center,
          data: layer,
          layers: this.props.landscapeMeasurementLayers,
          duplicatePolygon: this.duplicatePolygon,
          deletePolygon: this.deletePolygon,
          subtractPolygon: this.subtractPolygon,
          editPolygon: this.editPolygon(),
          scalePolygon: this.editPolygon('scale'),
          featureId: layer.properties._id, // eslint-disable-line
        };
        popups.push(popupProps);
      }
    });
    this.setState({ popups, editPopups: popups });
  };

  renderLandscapeInventoryItems = (layerContainer) => {
    const { landscapeInventoryItems: { data } } = this.props;

    data.forEach((item) => {
      this.convertFeatureToLayer({ feature: item, layerContainer });
    });
  };

  renderRoofingMeasurementLayers = (layerContainer) => {
    const { roofingMeasurementFeatures, roofingMeasurementLayers } = this.props;

    if (isEmpty(roofingMeasurementFeatures.data)) return;

    const activeLayersOrdered = {};
    roofingMeasurementLayers.data.filter((l) => l.isActive).forEach((l) => {
      activeLayersOrdered[l._id] = l.index; // eslint-disable-line
    });

    const filtered = roofingMeasurementFeatures.data.filter((f) => {
      if (!f.layerId) return true;
      const layerIndex = activeLayersOrdered[f.layerId];
      const isHidden = !f.layerId || (!layerIndex && layerIndex !== 0);
      return !isHidden;
    });

    const unique = uniqBy(filtered, '_id');
    const prepared = unique.map((f) => {
      const layerIndex = activeLayersOrdered[f.layerId] + 1;
      const featureIndex = ((!f.index || f.index < 0) ? 0 : f.index) + 1;

      const baseIndex = f.layerId ? (layerIndex * layerIndex) : featureIndex;
      const index = baseIndex * featureIndex;

      return {
        ...f,
        index,
      };
    });

    const sorted = sortBy(prepared, 'index');
    sorted.forEach((feature) => {
      this.convertFeatureToLayer({
        feature,
        layerContainer,
      });
    });

    const popups = [];

    layerContainer.eachLayer((layer) => {
      const feature = find(sorted, (f) => f._id === layer.properties._id);
      const payload = getPolygonPayload(layer);
      const popupProps = {
        ...payload,
        feature,
        siteRepairs: this.props.siteRepairs,
        position: payload.center,
        data: layer,
        layers: this.props.roofingMeasurementLayers,
        duplicatePolygon: this.duplicatePolygon,
        deletePolygon: this.deletePolygon,
        subtractPolygon: this.subtractPolygon,
        editPolygon: this.editPolygon(),
        scalePolygon: this.editPolygon('scale'),
        featureId: layer.properties._id, // eslint-disable-line
      };
      popups.push(popupProps);
    });
    this.setState({ popups, editPopups: popups });
  };

  renderPavementMeasurementLayers = (layerContainer) => {
    const { layers, features } = this.props;
    // draw geojson polygons
    if (isEmpty(features.data)) return;

    const activeLayersOrdered = {};
    layers.data.filter((l) => l.isActive).forEach((l) => {
      activeLayersOrdered[l._id] = l.index; // eslint-disable-line
    });

    const filtered = features.data.filter((f) => {
      const showingChanges = this.state.activeTab === 'changes';
      if (!f.layerId || showingChanges) return true;
      const layerIndex = activeLayersOrdered[f.layerId];
      const isHidden = !f.layerId || (!layerIndex && layerIndex !== 0);
      return !isHidden;
    });

    const unique = uniqBy(filtered, '_id');

    const prepared = unique.map((f) => {
      const layerIndex = activeLayersOrdered[f.layerId] + 1;
      const featureIndex = ((!f.index || f.index < 0) ? 0 : f.index) + 1;

      const baseIndex = f.layerId ? (layerIndex * layerIndex) : featureIndex;
      const index = baseIndex * featureIndex;

      return {
        ...f,
        index,
      };
    });

    const sorted = sortBy(prepared, 'index');

    sorted.forEach((feature) => {
      this.convertFeatureToLayer({
        feature,
        layerContainer,
      });
    });

    const popups = [];

    layerContainer.eachLayer((layer) => {
      if (layer.properties._id === this.state.layerEditingId) {
        layer.pm.enable();
        let draggable = false;
        Mousetrap.bind('space', () => {
          if (!draggable) {
            draggable = true;
            this.toggleDragging(layer, draggable);
          }
        }, 'keydown');
        Mousetrap.bind('space', () => {
          if (draggable) {
            draggable = false;
            this.toggleDragging(layer, draggable);
          }
        }, 'keyup');
      }

      if (!layer.properties.layerType) {
        const feature = find(sorted, (f) => f._id === layer.properties._id);
        const payload = getPolygonPayload(layer);
        const popupProps = {
          ...payload,
          feature,
          siteRepairs: this.props.siteRepairs,
          position: payload.center,
          data: layer,
          layers: this.props.layers,
          duplicatePolygon: this.duplicatePolygon,
          deletePolygon: this.deletePolygon,
          subtractPolygon: this.subtractPolygon,
          editPolygon: this.editPolygon(),
          scalePolygon: this.editPolygon('scale'),
          featureId: layer.properties._id, // eslint-disable-line
        };
        popups.push(popupProps);
      }
    });

    this.setState({ popups, editPopups: popups });
  }

  renderPavementConditionLayers = (layerContainer) => {
    const { groupedPCIFeatures, conditionLayerPCIMap, pciMapFeatures } = this.props;
    const popups = [];
    const sortedFeatures = [];

    if (conditionLayerPCIMap.isActive) {
      Object.keys(groupedPCIFeatures).forEach((group) => {
        if (pciMapFeatures[group]) {
          groupedPCIFeatures[group].forEach((f) => {
            const feature = { ...f, color: PCIColors[group] };
            sortedFeatures.push(feature);
            this.convertFeatureToLayer({
              feature,
              layerContainer,
            });
          });
        }
      });
    }

    layerContainer.eachLayer((layer) => {
      if (!layer.properties.layerType) {
        const feature = find(sortedFeatures, (f) => f._id === layer.properties._id);
        const payload = getPolygonPayload(layer);
        const popupProps = {
          ...payload,
          feature,
          siteRepairs: this.props.siteRepairs,
          position: payload.center,
          data: layer,
          layers: this.props.layers,
          duplicatePolygon: this.duplicatePolygon,
          deletePolygon: this.deletePolygon,
          subtractPolygon: this.subtractPolygon,
          editPolygon: this.editPolygon(),
          scalePolygon: this.editPolygon('scale'),
          featureId: layer.properties._id, // eslint-disable-line
        };
        popups.push(popupProps);
      }
    });

    this.setState({ popups, editPopups: popups });
  }

  renderPopups = () => {
    const activePopup = find(this.state.popups, (p) => p.featureId === this.state.activePopupId);
    return activePopup && this.createPopup(activePopup);
  };

  renderEditPopups = () => this.state.editPopups
      .filter((p) => p.featureId === this.state.activeEditPopupId)
      .map((props) => this.createPopup(props, ACTION_EDIT))

  renderOrthomosaic = () => {
    const { showOrtho } = this.state;
    const { isOrthoLoading, siteOrtho } = this.props;

    if (isOrthoLoading || !siteOrtho) return '';

    const { template } = siteOrtho;

    return showOrtho && template && (
      <TileLayer
        url={template}
        maxZoom={26}
        maxNativeZoom={23}
        tileSize={256}
        detectRetina
      />
    );
  };

  renderAreaMarkers = () => {
    const {
      selectedAreas = {},
      showPavement,
      showHVAC,
      showLandscape,
      showRoofing,
    } = this.state;

    const areaIsSelected = showPavement || showHVAC || showLandscape || showRoofing;

    if (isEmpty(selectedAreas) && !areaIsSelected) {
      return null;
    }

    const {
      areaPhotos = {},
      route,
      toggleAreaPhotoDefected,
      setAreaPhotoDefectedType,
      setAreaPhotoDefectedSeverity,
      toggleAreaPhotoRepair,
      setAreaPhotoRepairName,
      repairs,
      isOrthoLoading,
      siteOrtho,

      addAreaPhotoRepair,
      deleteAreaPhotoRepair,
      getAreaPhotoRepairs,
      areaPhotoRepairs,
    } = this.props;
    const { siteId } = route.match.params;

    if (!isEmpty(selectedAreas) && !isEmpty(areaPhotos)) {
      const clusters = Object.keys(areaPhotos)
        .filter((areaId) => selectedAreas[areaId])
        .map((areaId) => ({
          areaId,
          photos: areaPhotos[areaId].photos.filter((p) => p && p.location && p.location.lat),
        }))
        .map(({ areaId, photos }) => {
          const markers = photos.map((m) => {
            const {
              title,
              location: { lat, lng },
              id,
              defected,
              originalUrl,
              repair,
            } = m;
            return (
              <PhotoMarker
                route={route}
                defected={defected}
                photoId={id}
                siteId={siteId}
                areaId={areaId}
                title={title}
                position={[lat, lng]}
                key={id}
                url={originalUrl}
                repair={repair}
                toggleAreaPhotoDefected={toggleAreaPhotoDefected}
                setAreaPhotoDefectedType={setAreaPhotoDefectedType}
                setAreaPhotoDefectedSeverity={setAreaPhotoDefectedSeverity}
                toggleAreaPhotoRepair={toggleAreaPhotoRepair}
                setAreaPhotoRepairName={setAreaPhotoRepairName}

                addAreaPhotoRepair={addAreaPhotoRepair}
                deleteAreaPhotoRepair={deleteAreaPhotoRepair}
                getAreaPhotoRepairs={getAreaPhotoRepairs}
                areaPhotoRepairs={areaPhotoRepairs}

                repairs={repairs}
                isOrthoLoading={isOrthoLoading}
                siteOrtho={siteOrtho}
              />
            );
          });

          return markers;
        });

      return (
        <CanvasMarkersLayer dataKey="position">
          {clusters}
        </CanvasMarkersLayer>
      );
    }
    return null;
  };

  renderCommentButton = (readOnly = false, siteId) => (
    <CommentButton readOnly={readOnly} siteId={siteId} />
  );

  renderToolbar = () => {
    const { readOnly } = this.props;
    const { subNavigationItemSelected } = this.state;
    const toolbarContent = [];
    let isPmToolbarActive = false;
    const inventoryToolElement = document.getElementById('inventory-items-container-id');

    if (
      subNavigationItemSelected === PAVEMENT_NAME ||
      subNavigationItemSelected === LANDSCAPING_NAME ||
      subNavigationItemSelected === ROOFING_NAME
    ) {
      isPmToolbarActive = true;
      if (inventoryToolElement) {
        document.getElementById('inventory-items-container-id').className += ' hidden';
      }
    }
    if (
      subNavigationItemSelected === LANDSCAPING_NAME ||
      subNavigationItemSelected === HVAC_NAME
    ) {
      if (inventoryToolElement) {
        document.getElementById('inventory-items-container-id').className = 'leaflet-bar leaflet-control';
      }
    }

    return (
      <FeatureGroup>
        <LeafletPM
          position="topright"
          onDrawStart={this.onDrawStart}
          onDrawEnd={this.onDrawEnd}
          onCreate={this.onCreate}
          onCut={this.onCut}
          onGlobalEditToggle={this.onGlobalEditToggle}
          ref={this.refPMControl}
          isShared={readOnly}
          isPmToolbarActive={isPmToolbarActive}
        />
        <InventoryItems
          position="topright"
          title="Add Inventory Marker"
          onCreate={this.onMarkerInventoryCreated}
          onClick={this.onMarkerInventoryClick}
          key="leaflet.inventoryItems"
          onStart={this.onStartDrawingInventoryItem}
          onStop={this.onDrawEnd}
        />
        { toolbarContent }
        <LeafletEasyprint
          title={LEAFLET_EASYPRINT_CONFIG.title}
          position={LEAFLET_EASYPRINT_CONFIG.position}
          sizeModes={[LEAFLET_EASYPRINT_CONFIG.customSize]}
          tileWait={LEAFLET_EASYPRINT_CONFIG.tileWait}
          handleImage={this.handleSnapped}
          shouldImageSnap={this.shouldImageSnap}
          exportOnly
          onStart={this.handleStartSnappingImage}
          onFinish={this.handleFinishSnappingImage}
          hideControlContainer
          hideClasses={['gm-style', 'CommentButtonWrapper']}
        />
      </FeatureGroup>
    );
  }

  render() {
    const {
      center,

      layers,
      features,
      areas,
      hvacs,
      landscapeInventoryItems,
      landscapeMeasurementLayers,
      landscapeMeasurementFeatures,
      roofingMeasurementLayers,
      roofingMeasurementFeatures,

      readOnly,
      route,

      isScreenshotLoading,
      isUpdatingFeature,
      groupedPCIFeatures,
      conditionLayerPCIMap,
      toggleConditionLayerStatus,
      togglePciRange,
    } = this.props;

    const { siteId } = route.match.params;

    const {
      selectedAreas,
      showOrtho,
      showPavement,
      showHVAC,
      showLandscape,
      showRoofing,
      isGlobalEditing,
      isDrawing,
      isEditing,
      activePopupId,
      popups,
      videoArea,
      videoId,
      isModalOpen,
      isSavingScreenshot,
      screenshotFile,
      hvacInventory,
      landscapeInventory,
      subNavigationItemSelected,
    } = this.state;

    return (
      <MapContainer>
        {features.isLoading && <FeaturesLoader>Fetching zones and repairs...</FeaturesLoader>}
        {isScreenshotLoading && <FeaturesLoader>Saving screenshot ...</FeaturesLoader>}
        {isUpdatingFeature && <FeaturesLoader>Updating zones...</FeaturesLoader>}
        <Toolbar>
          {isDrawing && (
            <button onClick={this.deleteLastPoint}>
              Delete last point
            </button>
          )}
          {isEditing && (
            <button onClick={this.cancelEditing}>
              Cancel
            </button>
          )}
          {isEditing && (
            <button onClick={this.saveEditing} className="primary">
              Save
            </button>
          )}
        </Toolbar>
        <SubNavBar handleSelectSubItem={this.handleSelectSubItem} subNavigationItemSelected={subNavigationItemSelected} />
        <MapControlsContainer
          changes={this.getChanges()}
          layers={layers}
          features={features}
          areas={areas}
          hvacs={hvacs}
          landscapeInventoryItems={landscapeInventoryItems}
          landscapeMeasurementLayers={landscapeMeasurementLayers}
          landscapeMeasurementFeatures={landscapeMeasurementFeatures}
          roofingMeasurementLayers={roofingMeasurementLayers}
          roofingMeasurementFeatures={roofingMeasurementFeatures}

          activeTab={this.state.activeTab}
          switchTab={this.switchTab}
          resync={this.resync}
          loadMoreChanges={this.props.loadMoreChanges}
          updateFeaturesOrder={this.props.updateFeaturesOrder}

          createLayer={this.props.createLayer}
          createLandscapeMeasurementLayer={this.props.createLandscapeMeasurementLayer}
          updateLandscapeMeasurementLayerById={this.props.updateLandscapeMeasurementLayerById}
          toggleLandscapeMeasurementLayerStatus={this.props.toggleLandscapeMeasurementLayerStatus}
          createRoofingMeasurementLayer={this.props.createRoofingMeasurementLayer}
          updateRoofingMeasurementLayerById={this.props.updateRoofingMeasurementLayerById}
          toggleRoofingMeasurementLayerStatus={this.props.toggleRoofingMeasurementLayerStatus}
          deleteRoofingMeasurementLayerById={this.props.deleteRoofingMeasurementLayerById}
          updateLayersOrder={this.props.updateLayersOrder}
          updateLayerById={this.props.updateLayerById}
          toggleLayerStatus={this.props.toggleLayerStatus}
          deleteLayerById={this.props.deleteLayerById}
          getSiteRepairPhotos={this.props.getSiteRepairPhotos}

          activePopupId={activePopupId}
          highlightPolygon={this.highlightPolygon}
          resetPolygon={this.resetPolygon}
          openPopup={this.openPopup}
          selectedAreas={selectedAreas}
          PMControl={this.PMControl}
          showOrtho={showOrtho}
          showPavement={showPavement}
          showHVAC={showHVAC}
          showLandscape={showLandscape}
          showRoofing={showRoofing}
          handleCreate={this.handleCreateWithLayer}
          toggleOrtho={this.toggleOrtho}
          togglePavement={this.togglePavement}
          toggleHVAC={this.toggleHVAC}
          toggleLandscape={this.toggleLandscape}
          toggleRoofing={this.toggleRoofing}
          getAreaPhotos={this.getAreaPhotos}
          isGlobalEditing={isGlobalEditing}
          isDrawing={isDrawing}
          popups={popups}
          route={route}
          openAreaVideos={this.openAreaVideos}
          readOnly={readOnly}
          openSideMenuSharedMap={this.openSideMenuSharedMap}
          subNavigationItemSelected={subNavigationItemSelected}
          toggleConditionLayerStatus={toggleConditionLayerStatus}
          conditionLayerPCIMap={conditionLayerPCIMap}
          groupedPCIFeatures={groupedPCIFeatures}
          togglePciRange={togglePciRange}

          highlightInventoryItemsGroup={this.highlightInventoryItemsGroup}
          resetInventoryItemsGroup={this.resetInventoryItemsGroup}
        />
        <SideBarButton onClick={this.toggleSideBar} id={'page-wrap'}>
          <div ref={this.arrowSideBar}> { <ArrowLeft /> } </div>
        </SideBarButton>
        <HVAC
          isOpen={hvacInventory.isToggled}
          outerContainerId="outer-container"
          pageWrapId="right-buttons-wrapper"
          handleSaveHVAC={this.handleSaveHVAC}
          createdLayer={hvacInventory.layer}
          handleDeleteHvac={this.handleDeleteHvac}
          handleSidebarToggle={this.handleHvacInventorySideBarToggle}
          hvacSelected={hvacInventory.itemSelected}
        />
        <LandscapingInventorySidebar
          isOpen={landscapeInventory.isToggled}
          outerContainerId="outer-container"
          pageWrapId="right-buttons-wrapper"
          handleSidebarToggle={this.handleLandscapeInventorySidebarToggle}
          landscapeMeasurementLayers={landscapeMeasurementLayers}
          landscapeMeasurementFeatures={landscapeMeasurementFeatures}
          createdLayer={landscapeInventory.layer}
          handleSaveInventoryLandscape={this.handleSaveInventoryLandscape}
          handleDeleteInventoryLandscape={this.handleDeleteInventoryLandscape}
          landscapeInventoryItemSelected={landscapeInventory.itemSelected}
        />
        {this.renderEditPopups()}

        <Map center={center}>
          {this.renderPopups()}
          {this.renderOrthomosaic()}
          {this.renderAreaMarkers()}
          {this.renderCommentButton(readOnly, siteId)}

          {this.renderToolbar()}
        </Map>
        <AreaVideosModal
          isModalOpen={isModalOpen}
          siteId={siteId}
          videoArea={videoArea}
          videoId={videoId}
          closeModal={this.closeModal}
        />
        <SaveScreenshot
          isOpen={isSavingScreenshot}
          screenshot={screenshotFile}
          onClose={this.handleCloseSavingImage}
          layer={layers}
          saveScreenshot={this.saveScreenshot}
        />
      </MapContainer>
    );
  }
}

MapComponent.propTypes = {
  resync: PropTypes.func.isRequired,
  loadMoreChanges: PropTypes.func.isRequired,

  createFeature: PropTypes.func.isRequired,
  cutFeature: PropTypes.func.isRequired,
  updateFeaturesOrder: PropTypes.func.isRequired,
  updateFeatureById: PropTypes.func.isRequired,
  deleteFeatureById: PropTypes.func.isRequired,

  createLayer: PropTypes.func.isRequired,
  updateLayersOrder: PropTypes.func.isRequired,
  updateLayerById: PropTypes.func.isRequired,
  toggleLayerStatus: PropTypes.func.isRequired,
  deleteLayerById: PropTypes.func.isRequired,
  isUpdatingFeature: PropTypes.bool,

  createHVAC: PropTypes.func.isRequired,
  updateHvacById: PropTypes.func.isRequired,
  deleteHvacById: PropTypes.func.isRequired,

  createLandscapeInventoryItem: PropTypes.func.isRequired,
  deleteLandscapeInventoryItemById: PropTypes.func.isRequired,
  updateLandscapeInventoryItemById: PropTypes.func.isRequired,

  createLandscapeMeasurementFeature: PropTypes.func.isRequired,
  updateLandscapeMeasurementFeatureById: PropTypes.func.isRequired,
  deleteLandscapeMeasurementFeatureById: PropTypes.func.isRequired,
  createLandscapeMeasurementLayer: PropTypes.func.isRequired,
  updateLandscapeMeasurementLayerById: PropTypes.func.isRequired,
  toggleLandscapeMeasurementLayerStatus: PropTypes.func.isRequired,

  createRoofingMeasurementFeature: PropTypes.func.isRequired,
  updateRoofingMeasurementFeatureById: PropTypes.func.isRequired,
  deleteRoofingMeasurementFeatureById: PropTypes.func.isRequired,
  createRoofingMeasurementLayer: PropTypes.func.isRequired,
  updateRoofingMeasurementLayerById: PropTypes.func.isRequired,
  toggleRoofingMeasurementLayerStatus: PropTypes.func.isRequired,
  deleteRoofingMeasurementLayerById: PropTypes.func.isRequired,

  changes: PropTypes.object.isRequired,
  features: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired,
  areas: PropTypes.object.isRequired,
  isOrthoLoading: PropTypes.bool.isRequired,
  siteOrtho: PropTypes.object,
  hvacs: PropTypes.object.isRequired,
  landscapeInventoryItems: PropTypes.object.isRequired,
  landscapeMeasurementLayers: PropTypes.object.isRequired,
  landscapeMeasurementFeatures: PropTypes.object.isRequired,
  roofingMeasurementLayers: PropTypes.object.isRequired,
  roofingMeasurementFeatures: PropTypes.object.isRequired,

  center: PropTypes.array.isRequired,
  data: PropTypes.object,
  areaPhotos: PropTypes.object,
  getAreaPhotos: PropTypes.func,
  route: PropTypes.object,
  readOnly: PropTypes.bool,
  toggleAreaPhotoDefected: PropTypes.func.isRequired,
  setAreaPhotoDefectedType: PropTypes.func.isRequired,
  setAreaPhotoDefectedSeverity: PropTypes.func.isRequired,
  toggleAreaPhotoRepair: PropTypes.func.isRequired,
  setAreaPhotoRepairName: PropTypes.func.isRequired,
  repairs: PropTypes.array,
  siteRepairs: PropTypes.array,
  getSiteRepairPhotos: PropTypes.func,

  toggleSideBarMap: PropTypes.func,

  saveScreenshot: PropTypes.func,
  isScreenshotLoading: PropTypes.bool,
  clearSiteScreenshot: PropTypes.func,
  screenshotError: PropTypes.any,
  siteRepairPhotos: PropTypes.array,
  isLoadingPhotos: PropTypes.bool,

  addAreaPhotoRepair: PropTypes.func,
  deleteAreaPhotoRepair: PropTypes.func,
  getAreaPhotoRepairs: PropTypes.func,
  areaPhotoRepairs: PropTypes.array,

  toggleConditionLayerStatus: PropTypes.func.isRequired,
  conditionLayerPCIMap: PropTypes.object.isRequired,
  groupedPCIFeatures: PropTypes.object,
  togglePciRange: PropTypes.func.isRequired,
  pciMapFeatures: PropTypes.object.isRequired,
};

export default MapComponent;
