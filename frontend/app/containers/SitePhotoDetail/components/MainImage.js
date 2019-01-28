import React from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';

import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import omitBy from 'lodash/omitBy';
import omit from 'lodash/omit';
import isNil from 'lodash/isNil';
import ObjectID from 'bson-objectid';
import LoadingIndicator from 'components/LoadingIndicator';
import Immutable from 'immutable';

import L from 'leaflet';
import { Map, ImageOverlay, FeatureGroup } from 'react-leaflet';
import { LeafletPM } from '../../../components/LeafletPM';
import { MapViewWrapper, Toolbar, AnnotationLoader } from './elements';
import { getPolygonPayload } from '../../SiteMapPage/utils';
import { popupSelector, PopupRenderer, ACTION_EDIT } from './Popup/index';

const DownloadIcon = ({ size = '18' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 471.2 471.2" width={size} height={size}>
    <g>
      <g>
        <path d="M457.7,230.15c-7.5,0-13.5,6-13.5,13.5v122.8c0,33.4-27.2,60.5-60.5,60.5H87.5c-33.4,0-60.5-27.2-60.5-60.5v-124.8    c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v124.8c0,48.3,39.3,87.5,87.5,87.5h296.2c48.3,0,87.5-39.3,87.5-87.5v-122.8    C471.2,236.25,465.2,230.15,457.7,230.15z" fill="#FFFFFF" />
        <path d="M226.1,346.75c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l85.8-85.8c5.3-5.3,5.3-13.8,0-19.1c-5.3-5.3-13.8-5.3-19.1,0l-62.7,62.8    V30.75c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v273.9l-62.8-62.8c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1    L226.1,346.75z" fill="#FFFFFF" />
      </g>
    </g>
  </svg>
);

DownloadIcon.propTypes = {
  size: PropTypes.string,
};

const initialState = {
  popups: [],
  editPopups: [],
  activePopupId: '',
  activeEditPopupId: '',
  isDrawing: false,
  isEditing: false,
  isGlobalEditing: false,
  layerEditingId: '',
  selectedToggles: {},
  annotations: [],
};

let selectedPopupData = {};

class MainImageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const { photoId, getAnnotations } = this.props;
    getAnnotations(photoId);
  }

  componentWillReceiveProps() {
    this.cycle();
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

  onLayerUpdated = (e) => {
    const { annotations = [] } = this.props;
    const layer = e.target;
    const annotationId = layer.properties._id;

    const annotation = find(annotations, (f) => f._id === annotationId);
    const geojson = layer.toGeoJSON();
    const updated = {
      ...annotation,
      geojson,
    };

    if (annotation._id === this.state.layerEditingId) {
      this.updateAnnotationById(annotation._id, updated); // eslint-disable-line
    }

    this.closeEditPopup();
    this.closePopup();
  };


  onChangePopupData = (data) => {
    selectedPopupData = data;
  }

  createAnnotation = (annotation = {}) => {
    const { photoId, createAnnotation } = this.props;

    if (!isEmpty(annotation)) {
      createAnnotation({
        ...omit(annotation, ['createdAt', '_id']),
        photoId,
      });
    }
  }

  updateAnnotationById = (annotationId, annotation) => {
    const { photoId, updateAnnotation, annotations } = this.props;

    if (annotationId) {
      const annotationUpdate = omit(omitBy(annotation, isNil), ['_id', 'type', 'updatedAt', 'createdAt']);
      updateAnnotation({
        data: {
          ...annotationUpdate,
          photoId,
        },
        annotationId,
        annotations,
      });
    }
  }

  deleteAnnotationById = (annotationId) => {
    const { photoId, annotations, deleteAnnotation } = this.props;
    if (annotationId) {
      deleteAnnotation({ annotationId, photoId, annotations });
    }
  }

  handleCreateWithLayer = (e) => {
    const payload = {};
    const geojson = { ...e.toGeoJSON() };
    payload.geojson = geojson;
    this.handleCreate(payload);
  };

  handleCreate = (payload) => {
    const { annotations } = this.props;
    let lowestIndex = -1;

    annotations.forEach(({ index }) => {
      if (index !== 'undefined' && index === lowestIndex) {
        lowestIndex = index - 1;
      }
    });

    const prepared = {
      ...payload,
      createdAt: new Date(),
      index: lowestIndex,
      _id: ObjectID.generate(), // eslint-disable-line
      title: payload.title || 'No Title',
      description: payload.description || 'No Description',
    };
    this.createAnnotation(prepared);
  };

  openEditPopup = (popupId) => (e) => {
    e.preventDefault();
    const { layerContainer } = this.PMControl.context;
    layerContainer.eachLayer((layer) => {
      layer.fire('pm:update');
      layer.dragging.disable();
      layer.transform.disable();
    });
    if (!isEmpty(selectedPopupData) && selectedPopupData._id !== popupId) {
      const newData = { ...selectedPopupData };
      this.updateAnnotationById(newData._id, newData);
      selectedPopupData = {};
    }
    this.setState(() => ({ activeEditPopupId: popupId }), () => {
    });
  };

  closeEditPopup = (infoPopupId) => {
    this.setState({
      activeEditPopupId: null,
      activePopupId: infoPopupId,
      isEditing: false,
      layerEditingId: '',
    });
  };

  openPopup = (popupId) => this.setState(() => ({ activePopupId: popupId }));

  closePopup = () => this.setState({ activePopupId: null });

  refPMControl = (c) => {
    this.PMControl = c;
    this.cycle();
  };

  toggleDragging = (layer, draggable) => {
    layer.pm.disable();
    layer.pm.enable({ draggable });
  };

  convertAnnotationToLayer = ({ annotation, layerContainer }) => {
    const geojson = annotation.geojson;
    if (!geojson.geometry) return;
    const geometryLayer = L.GeoJSON.geometryToLayer(geojson.geometry, {
      transform: true,
      draggable: true,
      scaling: true,
    });

    geometryLayer.properties = {
      ...annotation,
      geojson: null,
    };

    geometryLayer.dragging.disable();
    geometryLayer.transform.disable();

    const editOpts = {
      snappable: true,
      allowSelfIntersection: true,
      preventVertexEdit: false,
      preventMarkerRemoval: false,
    };

    geometryLayer.pm.enable(editOpts);
    geometryLayer.on('pm:update', this.onLayerUpdated);

    layerContainer.addLayer(geometryLayer);

    geometryLayer.bringToBack();

    const clickHandler = () => {
      const isNotEditing =
        !geometryLayer.pm.enabled()
        && !this.state.isDrawing
        && !this.state.isGlobalEditing;

      if (isNotEditing) {
        this.openPopup(annotation._id);
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
    geometryLayer.on({
      click: clickHandler,
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
      layer.fire('pm:update');
      layer.dragging.disable();
      layer.transform.disable();
      if (layer.properties._id) {
        const annotation = {
          ...layer.properties,
          geojson: layer.toGeoJSON(),
        };
        this.updateAnnotationById(layer.properties._id, annotation);
      }
    });

    this.stopEditMode();

    return false;
  };

  cancelEditing = () => {
    const { layerContainer } = this.PMControl.context;

    layerContainer.eachLayer((layer) => {
      layer.off('pm:update');
      layer.pm.disable();
      layer.dragging.disable();
      layer.transform.disable();
    });

    this.cycle();
    this.stopEditMode();

    return false;
  };

  deletePolygon = (annotationId) => (e) => {
    e.preventDefault();

    const layerContainer = this.PMControl.context.layerContainer;
    layerContainer.eachLayer((layer) => {
      if (layer.properties && layer.properties._id === annotationId) {
        layerContainer.removeLayer(layer);
        this.deleteAnnotationById(layer.properties._id);
        this.closeEditPopup();
        this.closePopup();
      }
    });
  };


  editPolygon = (type) => (annotationId) => (e) => {
    e.preventDefault();

    const { annotations } = this.props;

    if (isEmpty(annotations) || !annotationId) return;

    const annotation = find(annotations, (f) => f._id === annotationId);

    if (!annotation) return;

    const layerContainer = this.PMControl.context.layerContainer;

    layerContainer.eachLayer((layer) => {
      if (layer.properties._id && layer.properties._id === annotationId) {
        this.closeEditPopup();
        this.closePopup();

        this.setState({
          layerEditingId: annotationId,
          isEditing: true,
        });

        if (type === 'scale') {
          layer.dragging.enable();
          layer.transform.enable({
            rotation: false,
            draggable: true,
            scaling: false,
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

  saveEditPopupData = (type, annotationId, payload = {}) => {
    const { annotations } = this.props;
    if (isEmpty(payload)) return;
    if (!annotationId) return;
    if (isEmpty(annotations)) return;
    const foundAnnotation = annotations.find((f) => f._id === annotationId);
    if (!foundAnnotation) return;
    // duplicating existing feature
    const annotation = {
      ...foundAnnotation,
      type,
      ...payload,
    };

    this.updateAnnotationById(annotationId, annotation);
    this.closeEditPopup();
  };

  createPopup = (props, action) => {
    const popupType = popupSelector(action);
    const position = [props.position.lat, props.position.lng];
    const { properties: { inputArea } } = props.data;
    const { annotations } = this.props;

    this.inputArea = inputArea || (inputArea === 0) ? inputArea : null;

    const popupProps = {
      ...props,
      isShared: false,
      key: `${props.id}_${popupType}_${Math.random()}`,
      annotations,
      position,
      openEditPopup: this.openEditPopup,
      closeEditPopup: this.closeEditPopup,
      deletePolygon: this.deletePolygon,
      saveEditData: this.saveEditPopupData,
      onClose: this.closePopup,
      readOnly: false,
      onChangeData: this.onChangePopupData,
    };

    return PopupRenderer[popupType](popupProps);
  };

  cycle = debounce(() => {
    const { annotations } = this.props;
    if (isEmpty(annotations) || !this.PMControl) return;

    // clear all layers
    const { layerContainer } = this.PMControl.context;
    layerContainer.clearLayers();

    // draw geojson polygons
    const unique = uniqBy(annotations, '_id');

    const prepared = unique.map((f) => {
      const annotationIndex = ((!f.index || f.index < 0) ? 0 : f.index) + 1;

      const baseIndex = annotationIndex;
      const index = baseIndex * annotationIndex;

      return {
        ...f,
        index,
      };
    });

    const sorted = sortBy(prepared, 'index');

    sorted.forEach((annotation) => {
      this.convertAnnotationToLayer({
        annotation,
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

      const annotation = find(sorted, (f) => f._id === layer.properties._id);
      const payload = getPolygonPayload(layer);
      const popupProps = {
        ...payload,
        annotation,
        position: payload.center,
        data: layer,
        deletePolygon: this.deletePolygon,
        editPolygon: this.editPolygon(),
        scalePolygon: this.editPolygon('scale'),
        annotationId: layer.properties._id, // eslint-disable-line
      };

      popups.push(popupProps);
    });

    this.setState({ popups, editPopups: popups });
  }, 40);

  renderPopups = () => {
    const activePopup = find(this.state.popups, (p) => p.annotationId === this.state.activePopupId);
    return activePopup && this.createPopup(activePopup);
  };

  renderEditPopups = () =>
    this.state.editPopups
      .filter((p) => p.annotationId === this.state.activeEditPopupId)
      .map((props) => this.createPopup(props, ACTION_EDIT));

  render() {
    const {
      imageSrc,
      className,
      isAnnotationLoading,
    } = this.props;
    const {
      isDrawing,
      isEditing,
    } = this.state;
    const readOnly = false;
    const boundWidth = (window.innerWidth / 2) || 500;
    const boundHeight = 500;
    const bounds = [[0, 0], [boundHeight, boundWidth]];
    return (
      <MapViewWrapper
        className={className}
        PMControl={this.PMControl}
      >
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
        <Map bounds={bounds} className={className} crs={L.CRS.Simple} >
          {this.renderPopups()}
          {this.renderEditPopups()}
          {isAnnotationLoading && <AnnotationLoader><LoadingIndicator /></AnnotationLoader>}
          <ImageOverlay url={imageSrc} bounds={bounds} />
          <FeatureGroup>
            <LeafletPM
              isPmToolbarActive
              position="topright"
              onDrawStart={this.onDrawStart}
              onDrawEnd={this.onDrawEnd}
              onCreate={this.onCreate}
              onCut={this.onCut}
              onGlobalEditToggle={this.onGlobalEditToggle}
              isShared={readOnly}
              ref={this.refPMControl}
              editOptions={{
                drawPolyline: false,
                cutPolygon: false,
                editMode: false,
              }}
            />
          </FeatureGroup>
        </Map>
      </MapViewWrapper>
    );
  }
}

MainImageContainer.propTypes = {
  photoId: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  className: PropTypes.string,
  data: PropTypes.object, // eslint-disable-line
  createAnnotation: PropTypes.func,
  getAnnotations: PropTypes.func,
  deleteAnnotation: PropTypes.func,
  updateAnnotation: PropTypes.func,
  annotations: PropTypes.PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Immutable.Iterable), PropTypes.object]),
  isAnnotationLoading: PropTypes.bool,
};

export default MainImageContainer;
