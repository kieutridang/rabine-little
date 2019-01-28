import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import injectSaga from 'common/injectSaga';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import cloneDeep from 'lodash/cloneDeep';
import ObjectID from 'bson-objectid';
import { APP_URL } from '../../constants';

import saga from './saga';

import MapComponent from './MapComponent';

import { Wrapper, MapPageContainer } from './elements';

import { makeSelectSiteRepairs, makeSelectSiteRepairPhotos, makeSelectIsLoadingPhotos } from '../../appSelector/siteRepairs';
import { makeSelectRepairs } from '../../appSelector/repairs';
import { makeGetAreaPhotoRepairs, makeGetAreaPhotos } from '../../appSelector/sitePhoto';
import { makeSelectScreenshotLoading, makeSelectScreenshotError } from '../../appSelector/siteScreenshot';
import { makeGetLoadingState, makeGetSiteOrtho } from '../../appSelector/site';
import { makeSelectIsUpdatingFeature } from '../../appSelector/feature';
import { makeSelectCurrentUser } from '../../appSelector/auth';

import { actions as sitePhotoActions } from '../../appReducer/sitePhoto.reducer';
import { actions as repairsActions } from '../../appReducer/repairs.reducer';
import { actions as siteRepairActions } from '../../appReducer/siteRepairs.reducer';
import { actions as uiActions } from '../../appReducer/UI.reducer';
import { actions as siteScreenshotActions } from '../../appReducer/siteScreenshot.reducer';
import { actions as featureActions } from '../../appReducer/feature.reducer';
import { actions as siteActions } from '../../appReducer/site.reducer';

import {
  DetailData,
} from './selector';

import { rabineFetcher } from '../../appApi/fetcher/rabineFetcher';

import * as actions from './actions';
import './style.css';

import { MEASUREMENT_LAYER_ROOFING, MEASUREMENT_LAYER_LANDSCAPE, SocketConst } from './constants';

export const dataSchema = {
  isLoading: true,
  isLoadingMore: false,
  total: null,
  data: [],
  error: '',
};

const conditionLayerSchema = {
  isActive: false,
};

const pciMapFeaturesSchema = {
  Poor: true,
  Fair: true,
  Good: true,
  'Not Set': true,
};

export const initialState = {
  changes: dataSchema,
  features: dataSchema,
  layers: dataSchema,
  areas: dataSchema,
  location: dataSchema,
  template: dataSchema,
  hvacs: dataSchema,
  landscapeInventory: dataSchema,
  landscapeMeasurementLayers: dataSchema,
  landscapeMeasurementFeatures: dataSchema,
  roofingMeasurementLayers: dataSchema,
  roofingMeasurementFeatures: dataSchema,
  conditionLayerPCIMap: conditionLayerSchema,
  pciMapFeatures: pciMapFeaturesSchema,
};

const localStorageLandscapeInventory = (siteId) => `landscape_${siteId}_inventory`;

export const socket = io(APP_URL, { transports: ['websocket'] });

export class SiteMapPage extends React.Component {
  static propTypes = {
    route: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.mapComponentChild = React.createRef();
  }

  state = initialState;

  componentWillMount = () => {
    const { siteId, token } = this.props.route.match.params;
    this.query();
    this.props.getRepairs();
    this.props.getSiteRepairs({ siteId });
    this.props.getSiteDetail(siteId, token);

    if (this.props.user && this.props.user._id) {
      const { _id } = this.props.user;
      socket.emit(SocketConst.REQ_GET_USERS_VIEWING_MAP, { sId: siteId, uId: _id });
    }
  };

  componentWillUnmount = () => {
    this.props.clearSiteScreenshot();

    if (this.props.user && this.props.user._id) {
      const { siteId } = this.props.route.match.params;
      const { _id } = this.props.user;
      socket.emit(SocketConst.REQ_USER_STOP_VIEWING_MAP, { sId: siteId, uId: _id });
    }
  };

  getCenter = () => {
    const { detailData } = this.props;

    if (detailData && detailData.location) {
      const { lat, lng } = detailData.location;

      if (lat && lng) {
        const center = [lat, lng];
        return center;
      }
    }

    const defaultUSACoordinates = [41.850033, -87.6500523];

    const { data = [] } = this.state.features;
    if (!data || data.length === 0) return defaultUSACoordinates;

    const geometry = data[0].geojson.geometry;
    if (!geometry) return defaultUSACoordinates;

    const coords = geometry.coordinates[0][0];
    const lat = coords[1];
    const lng = coords[0];
    const center = [lat, lng];
    return center;
  };

  getHvacs = (siteId) => {
    rabineFetcher.get(`site/${siteId}/hvac`)
      .then((res) => {
        const hvacs = res.map((hvac) => ({ ...hvac, _id: hvac.id }));

        this.setState(() => ({
          hvacs: {
            isLoading: false,
            data: hvacs,
          },
        }));
      });
  }

  getLandscapeInventoryItems = (siteId) => {
    const items = JSON.parse(window.localStorage.getItem(localStorageLandscapeInventory(siteId)));
    this.setState({ landscapeInventory: { isLoading: false, data: items || [] } });
  }

  getSiteRepairPhotos = (payload) => {
    const { getSiteRepairPhotos } = this.props;
    if (getSiteRepairPhotos && payload) {
      getSiteRepairPhotos(payload);
    }
  }

  loadMoreChanges = () => {
    const { siteId } = this.props.route.match.params;
    const { data = [] } = this.state.changes;
    const last = data.reverse()[0];

    const limit = 10;
    const after = last._id;

    this.setState((prevState) => ({
      changes: {
        ...prevState.changes,
        isLoadingMore: true,
      },
    }));

    rabineFetcher.get(`site/${siteId}/changes?limit=${limit}&after=${after}`)
      .then((newData) => {
        const { changes, total } = newData;

        this.setState((prevState) => ({
          changes: {
            total,
            isLoading: false,
            isLoadingMore: false,
            data: [...prevState.changes.data, ...changes],
          },
        }));
      })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  }

  query = () => {
    const { siteId, token } = this.props.route.match.params;
    const query = token ? `token=${token}` : '';
    const { queryTemplate } = this.props;

    this.queryChanges(siteId, query);
    this.queryLayers(siteId, query);
    this.queryFeatures(siteId, query);
    this.queryAreas(siteId, query);
    queryTemplate(siteId, query);
    this.getHvacs(siteId);
    this.getLandscapeInventoryItems(siteId);
    this.queryLandscapeMeasurementFeatures(siteId);
    this.queryLandscapeMeasurementLayers(siteId);
    this.queryRoofingMeasurementLayers(siteId);
    this.queryRoofingMeasurementFeatures(siteId);
  }

  queryChanges = (siteId, query) => {
    rabineFetcher.get(`site/${siteId}/changes?limit=10&${query}`)
      .then((data) => {
        const { changes, total } = data;

        this.setState(() => ({
          changes: {
            total,
            isLoading: false,
            data: changes,
          },
        }));
      })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  }

  queryLayers = (siteId, query) => {
    rabineFetcher.get(`site/${siteId}/layers?${query}`)
      .then((data) => {
        const { layers } = data;
        const sortedLayers = layers.sort((a, b) => a.index - b.index);

        this.setState(() => ({
          layers: {
            isLoading: false,
            data: sortedLayers.map((l) => ({ ...l, isActive: false })),
          },
        }));
      })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  }

  queryFeatures = (siteId, query) => {
    rabineFetcher.get(`site/${siteId}/features?${query}`)
      .then((data) => {
        const { features } = data;
        this.setState(() => ({
          features: {
            isLoading: false,
            data: features,
          },
        }));
      })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  }

  queryLandscapeMeasurementLayers = (siteId) => {
    rabineFetcher.get(`site/${siteId}/layers?featureType=LANDSCAPE`)
      .then((data) => {
        const { layers } = data;
        const sortedLayers = layers ? layers.sort((a, b) => a.index - b.index) : [];

        this.setState({
          landscapeMeasurementLayers: {
            isLoading: false,
            data: sortedLayers.map((l) => ({ ...l, isActive: false })),
          },
        });
      })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  }

  queryLandscapeMeasurementFeatures = (siteId) => {
    rabineFetcher.get(`site/${siteId}/landscapeFeature`)
      .then((data) => {
        const values = data;

        this.setState({ landscapeMeasurementFeatures: { isLoading: false, data: values } });
      })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  }

  queryRoofingMeasurementLayers = (siteId) => {
    rabineFetcher.get(`site/${siteId}/layers?featureType=ROOFING`)
      .then((data) => {
        const { layers } = data;
        const sortedLayers = layers.sort((a, b) => a.index - b.index);

        this.setState({
          roofingMeasurementLayers: {
            isLoading: false,
            data: sortedLayers.map((l) => ({ ...l, isActive: false })),
          },
        });
      })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  }

  queryRoofingMeasurementFeatures = (siteId) => {
    rabineFetcher.get(`site/${siteId}/roofingFeature/all`)
      .then((data) => {
        const values = data;
        values.forEach((value) => {
          value._id = value.id; // eslint-disable-line
          delete value.id; // eslint-disable-line
        });
        this.setState({ roofingMeasurementFeatures: { isLoading: false, data: values } });
      })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  }

  queryAreas = (siteId, query) => {
    rabineFetcher.get(`site/${siteId}/areas?${query}`)
      .then((data) => {
        this.setState(() => ({
          areas: {
            isLoading: false,
            data,
          },
        }));
      })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  }

  resync = () => {
    this.setState(initialState);
    this.query();
  }


/* HVAC METHODS */
  createHVAC = (hvac = {}) => {
    const { siteId } = this.props.route.match.params;
    delete hvac['_id']; // eslint-disable-line

    if (!isEmpty(hvac)) {
      rabineFetcher.post(`site/${siteId}/hvac`, hvac)
        .then((res) => {
          this.setState((prevState) => {
            const newHvac = res;
            newHvac._id = newHvac.id;
            delete newHvac.id;
            const hvacs = [...prevState.hvacs.data, newHvac];
            return { hvacs: { data: hvacs } };
          });
        })
        .catch((err) => {
          console.log('couldn’t fetch', err); // eslint-disable-line
        });
    }
  }

  updateHvacById = (hvacId, changes = {}) => {
    const { siteId } = this.props.route.match.params;
    delete changes['_id']; // eslint-disable-line

    if (hvacId) {
      this.setState((prevState) => {
        const hvacs = prevState.hvacs.data.map((hvac) => {
          if (hvac && hvac._id === hvacId) {
            return changes;
          }
          return hvac;
        });

        return { hvacs: { data: hvacs } };
      });

      rabineFetcher.put(`site/${siteId}/hvac/${hvacId}`, changes);
    }
  };

  deleteHvacById = (hvacId) => {
    const { siteId } = this.props.route.match.params;

    if (hvacId) {
      this.setState((prevState) => {
        const hvacs = prevState.hvacs.data.filter((hvac) => hvac._id !== hvacId);
        return { hvacs: { data: hvacs } };
      });

      rabineFetcher.delete(`site/${siteId}/hvac/${hvacId}`);
    }
  }

/* HVAC METHODS (END) */

/* LANDSCAPING METHODS */
  createLandscapeInventoryItem = (item = {}) => {
    const { siteId } = this.props.route.match.params;

    if (!isEmpty(item)) {
      let items = window.localStorage.getItem(localStorageLandscapeInventory(siteId));
      if (!items) {
        items = [];
      } else {
        items = JSON.parse(items);
      }
      items.push(item);
      window.localStorage.setItem(localStorageLandscapeInventory(siteId), JSON.stringify(items));
      this.setState(() => ({ landscapeInventory: { data: items } }));
    }
  };

  deleteLandscapeInventoryItemById = (itemId) => {
    const { siteId } = this.props.route.match.params;

    if (itemId) {
      const items = JSON.parse(window.localStorage.getItem(localStorageLandscapeInventory(siteId)));
      const itemToDeleteIndex = items.findIndex((i) => i._id === itemId);
      items.splice(itemToDeleteIndex, 1);

      window.localStorage.setItem(localStorageLandscapeInventory(siteId), JSON.stringify(items));
      this.setState(() => ({ landscapeInventory: { data: items } }));
    }
  };

  updateLandscapeInventoryItemById = (itemId, item = {}) => {
    const { siteId } = this.props.route.match.params;

    if (itemId) {
      const items = JSON.parse(window.localStorage.getItem(localStorageLandscapeInventory(siteId)));
      const hvacToChangeIndex = items.findIndex((i) => i._id === itemId); // eslint-disable-line
      items[hvacToChangeIndex] = item;

      window.localStorage.setItem(localStorageLandscapeInventory(siteId), JSON.stringify(items));
      this.setState(() => ({ landscapeInventory: { data: items } }));
    }
  };

  createLandscapeMeasurementFeature = (feature = {}) => {
    const { siteId } = this.props.route.match.params;
    feature.layerType = MEASUREMENT_LAYER_LANDSCAPE; // eslint-disable-line
    delete feature['createdAt']; // eslint-disable-line

    this.setState((prevState) => {
      const data = [...prevState.landscapeMeasurementFeatures.data, feature];
      return { landscapeMeasurementFeatures: { data } };
    });
    const payload = pickBy(feature, identity);
    rabineFetcher.post(`site/${siteId}/landscapeFeature`, payload)
      .then(() => {
      }).catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  }

  updateLandscapeMeasurementFeatureById = (featureId, changes = {}) => {
    const { siteId } = this.props.route.match.params;
    const patchNumber = changes.patchNumber;

    if (!(typeof changes.patchNumber === 'string' && changes.patchNumber.trim() !== '')) {
      delete changes.patchNumber; // eslint-disable-line
    }

    if (featureId) {
      this.setState((prevState) => {
        const data = prevState.landscapeMeasurementFeatures.data.map((feature) => {
          if (feature._id === featureId) {
            return { ...changes, _id: featureId, patchNumber };
          }
          return feature;
        });
        return { landscapeMeasurementFeatures: { data } };
      });

      rabineFetcher.put(`site/${siteId}/landscapeFeature/${featureId}`, changes)
        .then(() => {
        })
        .catch((err) => {
          console.log('couldn’t fetch', err); // eslint-disable-line
        });
    }
  };

  deleteLandscapeMeasurementFeatureById = (featureId) => {
    const { siteId } = this.props.route.match.params;

    if (featureId) {
      this.setState((prevState) => {
        const data = prevState.landscapeMeasurementFeatures.data.filter((f) => f._id !== featureId);
        return { landscapeMeasurementFeatures: { data } };
      });
      rabineFetcher.delete(`site/${siteId}/landscapeFeature/${featureId}`)
        .then(() => {
        }).catch((err) => {
          console.log('couldn’t fetch', err); // eslint-disable-line
        });
    }
  };

  createLandscapeMeasurementLayer = (payload = {}) => {
    const { siteId } = this.props.route.match.params;

    const layer = {
      ...payload,
      isActive: false,
      _id: payload._id || ObjectID.generate(), // eslint-disable-line
      featureType: 'LANDSCAPE',
    };

    rabineFetcher.post(`site/${siteId}/map/layer`, { layer })
      .then(() => { })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });

    this.setState((prevState) => {
      const data = [...prevState.landscapeMeasurementLayers.data, layer];
      return { landscapeMeasurementLayers: { data } };
    });
  }

  updateLandscapeMeasurementLayerById = (layerId, changes = {}) => {
    if (layerId) {
      this.setState((prevState) => {
        const data = prevState.landscapeMeasurementLayers.data.map((layer) => {
          if (layer && layer._id === layerId) {
            return {
              ...layer,
              ...changes,
            };
          }
          return layer;
        });
        return { landscapeMeasurementLayers: { data } };
      });

      rabineFetcher.put(`layers/${layerId}`, { layer: changes })
        .then(() => {})
        .catch((err) => {
          console.log(273, err); // eslint-disable-line
        });
    }
  };

  toggleLandscapeMeasurementLayerStatus = (layerId, isActive) => {
    const { token } = this.props.route.match.params;

    if (layerId) {
      const data = this.state.landscapeMeasurementLayers.data.map((f) => {
        if (f && f._id === layerId) {
          return {
            ...f,
            isActive: !isActive,
          };
        }
        return f;
      });

      this.setState({ landscapeMeasurementLayers: { data } });

      if (!token) {
        rabineFetcher.put(`layers/${layerId}/toggle-status`, { isActive: !!isActive })
          .catch((err) => {
            console.log(273, err); // eslint-disable-line
          });
      }
    }
  };

/* LANDSCAPING METHODS (end) */


/* ROOFING METHODS */
  createRoofingMeasurementFeature = (feature = {}) => {
    const { siteId } = this.props.route.match.params;
    feature.layerType = MEASUREMENT_LAYER_ROOFING; // eslint-disable-line
    delete feature['createdAt']; // eslint-disable-line
    delete feature['_id']; // eslint-disable-line
    const payload = pickBy(feature, identity);
    rabineFetcher.post(`site/${siteId}/roofingFeature`, payload)
      .then((res) => {
        res._id = res.id; // eslint-disable-line
        delete res.id; // eslint-disable-line
        this.setState((prevState) => {
          const data = [...prevState.roofingMeasurementFeatures.data, res];
          return { roofingMeasurementFeatures: { data } };
        });
      }).catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });
  };

  updateRoofingMeasurementFeatureById = (featureId, changes = {}) => {
    const { siteId } = this.props.route.match.params;
    const patchNumber = changes.patchNumber;
    if (!(typeof changes.patchNumber === 'string' && changes.patchNumber.trim() !== '')) {
      delete changes.patchNumber; // eslint-disable-line
    }
    delete changes['_id']; // eslint-disable-line
    delete changes.zoneNumber; // eslint-disable-line

    if (featureId) {
      this.setState((prevState) => {
        const data = prevState.roofingMeasurementFeatures.data.map((feature) => {
          if (feature._id === featureId) {
            return { ...changes, _id: featureId, patchNumber };
          }
          return feature;
        });
        return { roofingMeasurementFeatures: { data } };
      });

      rabineFetcher.put(`site/${siteId}/roofingFeature/${featureId}`, changes)
        .then(() => {
        })
        .catch((err) => {
          console.log('couldn’t fetch', err); // eslint-disable-line
        });
    }
  };

  deleteRoofingMeasurementFeatureById = (featureId) => {
    const { siteId } = this.props.route.match.params;
    if (featureId) {
      this.setState((prevState) => {
        const data = prevState.roofingMeasurementFeatures.data.filter((f) => f._id !== featureId);
        return { roofingMeasurementFeatures: { data } };
      });
      rabineFetcher.delete(`site/${siteId}/roofingFeature/${featureId}`)
        .then(() => {
        }).catch((err) => {
          console.log('couldn’t fetch', err); // eslint-disable-line
        });
    }
  };

  createRoofingMeasurementLayer = (payload = {}) => {
    const { siteId } = this.props.route.match.params;
    const layer = {
      ...payload,
      isActive: false,
      _id: payload._id || ObjectID.generate(), // eslint-disable-line
      featureType: 'ROOFING',
    };

    rabineFetcher.post(`site/${siteId}/map/layer`, { layer })
      .then(() => { })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });

    this.setState((prevState) => {
      const data = [...prevState.roofingMeasurementLayers.data, layer];
      return { roofingMeasurementLayers: { data } };
    });
  };

  updateRoofingMeasurementLayerById = (layerId, changes = {}) => {
    if (layerId) {
      this.setState((prevState) => {
        const data = prevState.roofingMeasurementLayers.data.map((layer) => {
          if (layer && layer._id === layerId) {
            return {
              ...layer,
              ...changes,
            };
          }
          return layer;
        });
        return { roofingMeasurementLayers: { data } };
      });

      rabineFetcher.put(`layers/${layerId}`, { layer: changes })
        .then(() => {})
        .catch((err) => {
          console.log(273, err); // eslint-disable-line
        });
    }
  };

  toggleRoofingMeasurementLayerStatus = (layerId, isActive) => {
    const { token } = this.props.route.match.params;

    if (layerId) {
      const data = this.state.roofingMeasurementLayers.data.map((f) => {
        if (f && f._id === layerId) {
          return {
            ...f,
            isActive: !isActive,
          };
        }
        return f;
      });

      this.setState({ roofingMeasurementLayers: { data } });

      if (!token) {
        rabineFetcher.put(`layers/${layerId}/toggle-status`, { isActive: !!isActive })
          .catch((err) => {
            console.log(273, err); // eslint-disable-line
          });
      }
    }
  };
/* ROOFING METHODS (end) */

  deleteRoofingMeasurementLayerById = (layerId) => {
    if (layerId) {
      rabineFetcher.delete(`layers/${layerId}`)
        .then(() => {
        })
        .catch((err) => {
          console.log('couldn’t fetch', err); // eslint-disable-line
        });

      this.setState((prevState) => {
        const layersData = prevState.roofingMeasurementLayers.data.filter((l) => l && l._id !== layerId);
        const featuresData = prevState.roofingMeasurementFeatures.data.map((feature) => {
          if (feature.layerId !== layerId) return feature;
          return {
            ...feature,
            layerId: null,
          };
        });

        return {
          roofingMeasurementLayers: {
            data: layersData,
          },
          roofingMeasurementFeatures: {
            data: featuresData,
          },
        };
      });
    }
  };

/* PAVEMENT METHODS */
  createFeature = (feature = {}, selectedAreas = {}) => {
    const { siteId, token } = this.props.route.match.params;
    const { createFeature } = this.props;
    if (!isEmpty(feature)) {
      this.setState((prevState) => {
        const data = [...prevState.features.data, feature];
        return { features: { data } };
      });
      createFeature({ siteId, token, selectedAreas }, { feature });
    }
  };

  cutFeature = (oldFeatureId, newFeatures = [], selectedAreas = {}) => {
    const { siteId, token } = this.props.route.match.params;
    const { cutFeature } = this.props;

    if (oldFeatureId) {
      this.setState((prevState) => {
        const data = prevState.features.data.filter((f) => f && f._id !== oldFeatureId);
        return { features: { data } };
      });
    }

    const features = newFeatures.filter((feature) => !!feature);

    let data = [...this.state.features.data];

    features.forEach((feature) => {
      data = [...data, feature];
    });

    this.setState({
      features: { data },
    });

    cutFeature({ siteId, token, selectedAreas }, { oldFeatureId, newFeatures: features });
  };

  updateFeatureById = (featureId, changes = {}, selectedAreas = {}) => {
    const { siteId, token } = this.props.route.match.params;
    const { putFeature } = this.props;
    if (featureId) {
      this.setState((prevState) => {
        const data = prevState.features.data.map((f) => {
          if (f && f._id === featureId) {
            return changes;
          }
          return f;
        });

        return { features: { data } };
      });

      return putFeature({ siteId, token, featureId, selectedAreas }, { feature: changes });
    }
    return 'Feature Id not provided';
  };

  deleteFeatureById = (featureId, payload = {}, selectedAreas = {}) => {
    const { siteId, token } = this.props.route.match.params;
    const { deleteFeature } = this.props;
    if (featureId) {
      this.setState((prevState) => {
        const data = prevState.features.data.filter((f) => f && f._id !== featureId);
        return { features: { data } };
      });

      return deleteFeature({ siteId, token, featureId, selectedAreas }, payload.type);
    }
    return 'Feature Id not provided';
  };

  createLayer = (payload = {}) => {
    const { siteId } = this.props.route.match.params;
    const layer = {
      ...payload,
      isActive: false,
      _id: payload._id || ObjectID.generate(), // eslint-disable-line
    };

    rabineFetcher.post(`site/${siteId}/map/layer`, { layer })
      .then(() => { })
      .catch((err) => {
        console.log('couldn’t fetch', err); // eslint-disable-line
      });

    this.setState((prevState) => {
      const data = [...prevState.layers.data, layer];
      return { layers: { data } };
    });
  };

  updateLayersOrder = (payload, layerType) => {
    const { reordered } = payload;
    const { siteId } = this.props.route.match.params;

    if (reordered && reordered.length > 0) {
      this.setState(() => ({
        [layerType || 'layers']: { data: reordered },
      }));

      const order = {};

      reordered.forEach((layer) => {
        order[layer._id] = layer.index;
      });

      rabineFetcher.put(`site/${siteId}/layers/reorder`, { order })
        .then(() => {})
        .catch((err) => {
          console.log(273, err); // eslint-disable-line
        });
    }
  };

  updateFeaturesOrder = (payload) => {
    const { layerId, reordered } = payload;
    const { siteId } = this.props.route.match.params;

    if (!isEmpty(reordered)) {
      const layerFeatures = this.state.features.data.filter((f) => f.layerId === layerId);
      const lastIndex = layerFeatures.length + 1;
      const merged = this.state.features.data.map((feature) => {
        if (feature.layerId !== layerId) return feature;

        const featureIndex = reordered[feature._id];
        const index = featureIndex === 'undefined' ? lastIndex : featureIndex;
        return {
          ...feature,
          index,
        };
      });

      this.setState(() => ({
        features: { data: merged },
      }));

      rabineFetcher.put(`site/${siteId}/features/reorder`, { layerId, order: reordered })
        .then(() => {})
        .catch((err) => {
          console.log(273, err); // eslint-disable-line
        });
    }
  };

  updateLayerById = (layerId, changes = {}) => {
    if (layerId) {
      this.setState((prevState) => {
        const data = prevState.layers.data.map((layer) => {
          if (layer && layer._id === layerId) {
            return {
              ...layer,
              ...changes,
            };
          }
          return layer;
        });
        return { layers: { data } };
      });

      rabineFetcher.put(`layers/${layerId}`, { layer: changes })
        .then(() => {})
        .catch((err) => {
          console.log(273, err); // eslint-disable-line
        });
    }
  };

  toggleLayerStatus = (layerId, isActive) => {
    const { token } = this.props.route.match.params;

    if (layerId) {
      const data = this.state.layers.data.map((f) => {
        if (f && f._id === layerId) {
          return {
            ...f,
            isActive: !isActive,
          };
        }
        return f;
      });

      this.setState({ layers: { data } });

      if (!token) {
        rabineFetcher.put(`layers/${layerId}/toggle-status`, { isActive: !!isActive })
          .catch((err) => {
            console.log(273, err); // eslint-disable-line
          });
      }
    }
  };

  deleteLayerById = (layerId) => {
    if (layerId) {
      rabineFetcher.delete(`layers/${layerId}`)
        .then(() => {
        })
        .catch((err) => {
          console.log('couldn’t fetch', err); // eslint-disable-line
        });

      this.setState((prevState) => {
        const layersData = prevState.layers.data.filter((l) => l && l._id !== layerId);
        const featuresData = prevState.features.data.map((feature) => {
          if (feature.layerId !== layerId) return feature;
          return {
            ...feature,
            layerId: null,
          };
        });

        return {
          layers: {
            data: layersData,
          },
          features: {
            data: featuresData,
          },
        };
      });
    }
  };

/* PAVEMENT METHODS (end) */

  saveScreenshot = (data) => {
    const { addSiteScreenshot } = this.props;

    const body = {
      file: data.screenshotFile,
      siteId: data.siteId,
      layerId: data.trimmedName,
    };

    addSiteScreenshot(body);
  };

  toggleConditionLayerStatus = (layerId, status) => {
    if (layerId === 'PCI Map') {
      this.setState({ conditionLayerPCIMap: { isActive: status } });
    }
  };

  togglePciRange = (title, status) => {
    const newState = cloneDeep(this.state.pciMapFeatures);
    newState[title] = status;

    this.setState({ pciMapFeatures: newState });
  };

  groupFeaturesByPCI = (features) => {
    const { data = [], isLoading } = features;
    if (isLoading) {
      return [];
    }

    const zones = data.filter((f) => f.title && f.title.includes('Zone'));
    const groupedZones = {
      Poor: [],
      Fair: [],
      Good: [],
      'Not Set': [],
    };

    zones.forEach((f) => {
      if (f.pci >= '0' && f.pci <= '49') {
        groupedZones.Poor.push(f);
      }
      if (f.pci >= '50' && f.pci <= '69') {
        groupedZones.Fair.push(f);
      }
      if (f.pci >= '70') {
        groupedZones.Good.push(f);
      }
      if (!f.pci) {
        groupedZones['Not Set'].push(f);
      }
    });

    return groupedZones;
  };

  render() {
    const {
      areaPhotos,
      getAreaPhotos,
      route,
      toggleAreaPhotoDefected,
      setAreaPhotoDefectedType,
      toggleAreaPhotoRepair,
      setAreaPhotoRepairName,
      setAreaPhotoDefectedSeverity,
      repairs,
      siteRepairs,
      toggleSideBarMap,
      isScreenshotLoading,
      screenshotError,
      clearSiteScreenshot,
      siteRepairPhotos,
      isLoadingPhotos,
      isOrthoLoading,
      siteOrtho,

      getAreaPhotoRepairs,
      addAreaPhotoRepair,
      deleteAreaPhotoRepair,
      areaPhotoRepairs,
      isUpdatingFeature,
    } = this.props;

    const { token } = route.match.params;
    const readOnly = !!token;
    const groupedPCIFeatures = this.groupFeaturesByPCI(this.state.features);

    return (
      <MapPageContainer>
        <Wrapper className={token ? 'full' : ''}>
          <MapComponent
            ref={this.mapComponentChild}
            readOnly={readOnly}
            center={this.getCenter()}
            route={route}

            changes={this.state.changes}
            layers={this.state.layers}
            features={this.state.features}
            areas={this.state.areas}
            areaPhotos={areaPhotos}
            isOrthoLoading={isOrthoLoading}
            siteOrtho={siteOrtho}
            repairs={repairs}
            siteRepairs={siteRepairs}
            siteRepairPhotos={siteRepairPhotos}
            hvacs={this.state.hvacs}
            landscapeInventoryItems={this.state.landscapeInventory}
            landscapeMeasurementLayers={this.state.landscapeMeasurementLayers}
            landscapeMeasurementFeatures={this.state.landscapeMeasurementFeatures}
            roofingMeasurementLayers={this.state.roofingMeasurementLayers}
            roofingMeasurementFeatures={this.state.roofingMeasurementFeatures}

            resync={this.resync}
            loadMoreChanges={this.loadMoreChanges}

            createFeature={this.createFeature}
            updateFeaturesOrder={this.updateFeaturesOrder}
            updateFeatureById={this.updateFeatureById}
            deleteFeatureById={this.deleteFeatureById}
            cutFeature={this.cutFeature}
            isUpdatingFeature={isUpdatingFeature}

            createLayer={this.createLayer}
            updateLayersOrder={this.updateLayersOrder}
            updateLayerById={this.updateLayerById}
            toggleLayerStatus={this.toggleLayerStatus}
            deleteLayerById={this.deleteLayerById}

            getAreaPhotos={getAreaPhotos}
            toggleAreaPhotoDefected={toggleAreaPhotoDefected}
            setAreaPhotoDefectedType={setAreaPhotoDefectedType}
            setAreaPhotoDefectedSeverity={setAreaPhotoDefectedSeverity}
            setAreaPhotoRepairName={setAreaPhotoRepairName}
            toggleAreaPhotoRepair={toggleAreaPhotoRepair}

            toggleSideBarMap={toggleSideBarMap}
            getSiteRepairPhotos={this.getSiteRepairPhotos}
            isLoadingPhotos={isLoadingPhotos}

            saveScreenshot={this.saveScreenshot}
            isScreenshotLoading={isScreenshotLoading}
            screenshotError={screenshotError}
            clearSiteScreenshot={clearSiteScreenshot}

            createHVAC={this.createHVAC}
            updateHvacById={this.updateHvacById}
            deleteHvacById={this.deleteHvacById}

            createLandscapeInventoryItem={this.createLandscapeInventoryItem}
            deleteLandscapeInventoryItemById={this.deleteLandscapeInventoryItemById}
            updateLandscapeInventoryItemById={this.updateLandscapeInventoryItemById}

            createLandscapeMeasurementFeature={this.createLandscapeMeasurementFeature}
            updateLandscapeMeasurementFeatureById={this.updateLandscapeMeasurementFeatureById}
            deleteLandscapeMeasurementFeatureById={this.deleteLandscapeMeasurementFeatureById}

            createLandscapeMeasurementLayer={this.createLandscapeMeasurementLayer}
            updateLandscapeMeasurementLayerById={this.updateLandscapeMeasurementLayerById}
            toggleLandscapeMeasurementLayerStatus={this.toggleLandscapeMeasurementLayerStatus}

            createRoofingMeasurementFeature={this.createRoofingMeasurementFeature}
            updateRoofingMeasurementFeatureById={this.updateRoofingMeasurementFeatureById}
            deleteRoofingMeasurementFeatureById={this.deleteRoofingMeasurementFeatureById}

            createRoofingMeasurementLayer={this.createRoofingMeasurementLayer}
            updateRoofingMeasurementLayerById={this.updateRoofingMeasurementLayerById}
            toggleRoofingMeasurementLayerStatus={this.toggleRoofingMeasurementLayerStatus}
            deleteRoofingMeasurementLayerById={this.deleteRoofingMeasurementLayerById}

            addAreaPhotoRepair={addAreaPhotoRepair}
            deleteAreaPhotoRepair={deleteAreaPhotoRepair}
            getAreaPhotoRepairs={getAreaPhotoRepairs}
            areaPhotoRepairs={areaPhotoRepairs}

            conditionLayerPCIMap={this.state.conditionLayerPCIMap}
            toggleConditionLayerStatus={this.toggleConditionLayerStatus}
            groupedPCIFeatures={groupedPCIFeatures}
            togglePciRange={this.togglePciRange}
            pciMapFeatures={this.state.pciMapFeatures}
          />
        </Wrapper>
      </MapPageContainer>
    );
  }
}

SiteMapPage.propTypes = {
  areaPhotos: PropTypes.object,
  getSiteDetail: PropTypes.func,
  getAreaPhotos: PropTypes.func,
  getRepairs: PropTypes.func,
  getSiteRepairs: PropTypes.func,
  route: PropTypes.object,
  detailData: PropTypes.object,
  toggleAreaPhotoDefected: PropTypes.func,
  setAreaPhotoDefectedType: PropTypes.func,
  toggleAreaPhotoRepair: PropTypes.func,
  setAreaPhotoRepairName: PropTypes.func,

  setAreaPhotoDefectedSeverity: PropTypes.func,
  repairs: PropTypes.array,
  siteRepairs: PropTypes.array,
  toggleSideBarMap: PropTypes.func,
  addSiteScreenshot: PropTypes.func,
  clearSiteScreenshot: PropTypes.func,
  isScreenshotLoading: PropTypes.bool,
  screenshotError: PropTypes.any,
  getSiteRepairPhotos: PropTypes.func,
  createFeature: PropTypes.func,
  cutFeature: PropTypes.func,
  putFeature: PropTypes.func,
  deleteFeature: PropTypes.func,
  siteRepairPhotos: PropTypes.array,
  isLoadingPhotos: PropTypes.bool,
  queryTemplate: PropTypes.func,
  isOrthoLoading: PropTypes.bool,
  siteOrtho: PropTypes.object,
  user: PropTypes.object,

  addAreaPhotoRepair: PropTypes.func,
  deleteAreaPhotoRepair: PropTypes.func,
  getAreaPhotoRepairs: PropTypes.func,
  areaPhotoRepairs: PropTypes.array,
  isUpdatingFeature: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  detailData: DetailData(),
  areaPhotos: makeGetAreaPhotos(),
  repairs: makeSelectRepairs(),
  siteRepairs: makeSelectSiteRepairs(),
  isScreenshotLoading: makeSelectScreenshotLoading(),
  screenshotError: makeSelectScreenshotError(),
  siteRepairPhotos: makeSelectSiteRepairPhotos(),
  isLoadingPhotos: makeSelectIsLoadingPhotos(),
  isOrthoLoading: makeGetLoadingState(),
  siteOrtho: makeGetSiteOrtho(),
  user: makeSelectCurrentUser(),
  areaPhotoRepairs: makeGetAreaPhotoRepairs(),
  isUpdatingFeature: makeSelectIsUpdatingFeature(),
});

const mapDispatchToProps = (dispatch) => ({
  getSiteDetail: (id, token) => dispatch(actions.fetchDetail(id, token)),
  getAreaPhotos: (siteId, areaId, token) => dispatch(sitePhotoActions.getAreaPhotos({ siteId, areaId, token })),
  toggleAreaPhotoDefected: (payload) => dispatch(sitePhotoActions.toggleAreaPhotoDefected(payload)),
  setAreaPhotoDefectedType: (payload) => dispatch(sitePhotoActions.setAreaPhotoDefectedType(payload)),
  toggleAreaPhotoRepair: (payload) => dispatch(sitePhotoActions.toggleAreaPhotoRepair(payload)),
  setAreaPhotoRepairName: (payload) => dispatch(sitePhotoActions.setAreaPhotoRepairName(payload)),

  getAreaPhotoRepairs: (photoId) => dispatch(sitePhotoActions.getAreaPhotoRepairs(photoId)),
  addAreaPhotoRepair: (payload) => dispatch(sitePhotoActions.addAreaPhotoRepair(payload)),
  deleteAreaPhotoRepair: (photoId, repairId) => dispatch(sitePhotoActions.deleteAreaPhotoRepair({ photoId, repairId })),

  setAreaPhotoDefectedSeverity: (payload) => dispatch(sitePhotoActions.setAreaPhotoDefectedSeverity(payload)),
  getRepairs: () => dispatch(repairsActions.getRepairsRequest()),
  getSiteRepairs: (filter) => dispatch(siteRepairActions.getSiteRepairsRequest(filter)),
  toggleSideBarMap: () => dispatch(uiActions.toggleSideBarMap()),
  addSiteScreenshot: (data) => dispatch(siteScreenshotActions.addSiteScreenshotRequest(data)),
  clearSiteScreenshot: () => dispatch(siteScreenshotActions.clearSiteScreenshot()),
  getSiteRepairPhotos: (payload) => dispatch(siteRepairActions.getSiteRepairPhotosRequest(payload)),
  createFeature: (siteData, featureData) => dispatch(featureActions.createFeatureRequest({ siteData, featureData })),
  cutFeature: (siteData, featureData) => dispatch(featureActions.cutFeatureRequest({ siteData, featureData })),
  putFeature: (siteData, featureData) => dispatch(featureActions.putFeatureRequest({ siteData, featureData })),
  deleteFeature: (siteData, type) => dispatch(featureActions.deleteFeatureRequest({ siteData, type })),
  queryTemplate: (siteId, query) => dispatch(siteActions.getSiteOrthoRequest({ siteId, query })),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);
const withSaga = injectSaga({ key: 'siteMapData', saga });

export default compose(withSaga, withRedux)(SiteMapPage);
