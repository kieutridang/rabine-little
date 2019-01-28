import cloneDeep from 'lodash/cloneDeep';
import L from 'leaflet';
import { geodesicArea, readableArea, readableDistance } from './geometry';

const accumulatedLengths = (coords) => {
  if (coords.length === 0) return [];

  const lengths = [0];
  let total = 0;

  for (let i = 0, n = coords.length - 1; i < n; i++) { // eslint-disable-line
    const obj = coords[i];
    if (obj && obj.lat && obj.lng) {
      total += coords[i].distanceTo(coords[i + 1]);
      lengths.push(total);
    }
  }

  return lengths;
};

const getLength = (coords) => {
  const accumulated = accumulatedLengths(coords);
  return accumulated.length > 0 ? accumulated[accumulated.length - 1] : 0;
};

export const getPolygonPayload = (layer) => {
  const coordinates = layer.getLatLngs();
  let area = 0;
  coordinates.forEach((element, index) => {
    if (index === 0) area += geodesicArea(element);
    else area -= geodesicArea(element);
  });

  let length = 0;

  let isLine = false;
  if (area > 0) {
    length = getLength(coordinates[0]);
  } else {
    isLine = true;
    length = getLength(coordinates);
  }

  const newPolygon = {
    _id: layer.properties._id,
    layerId: layer.properties.layerId,
    area,
    coordinates,
    length,
    center: layer.getCenter(),
    geoJSON: layer.toGeoJSON(),
    readableArea: {
      metric: readableArea(area, true),
    },
    readableDistance: {
      metric: readableDistance((isLine ? length : area), true),
    },
    isLine,
  };

  return newPolygon;
};

export const optionalPolygonPayload = (layer) => {
  const coordinates = layer.getLatLngs();
  let area = 0;
  coordinates.forEach((element, index) => {
    if (index === 0) area += geodesicArea(element);
    else area -= geodesicArea(element);
  });

  let length = 0;

  let isLine = false;
  if (area > 0) {
    length = getLength(coordinates[0]);
  } else {
    isLine = true;
    length = getLength(coordinates);
  }

  const newPolygon = {
    area,
    coordinates,
    length,
    center: layer.getCenter(),
    geoJSON: layer.toGeoJSON(),
    readableArea: {
      metric: readableArea(area, true),
    },
    readableDistance: {
      metric: readableDistance((isLine ? length : area), true),
    },
    isLine,
  };

  return newPolygon;
};

export const tryParseFloat = (str, defaultValue = -1) => {
  let retValue = defaultValue;
  if (str !== null) {
    if (str.length > 0) {
      if (!isNaN(str)) {
        retValue = parseFloat(str);
      }
    }
  }
  return retValue;
};

const isValidFeature = (feature = {}) =>
  feature &&
  feature.geojson &&
  feature.geojson.geometry &&
  feature.geojson.geometry.coordinates &&
  feature.geojson.geometry.coordinates.length !== 0 &&
  feature.geojson.geometry.coordinates[0][0] !== null;

export const isProperFeature = (feature = {}) => {
  const geojson = feature.geojson;
  if (geojson && geojson.type === 'FeatureCollection') {
    return geojson && geojson.features.length > 0;
  }

  return isValidFeature(feature);
};

export const getSelectedLayers = (layers) => {
  const layersSelected = [];
  layers.forEach((layer) => {
    if (layer.isActive) {
      layersSelected.push(cloneDeep(layer));
    }
  });

  return layersSelected;
};

export const convertGeometryToLayer = (geojson) => {
  const geometryLayer = L.GeoJSON.geometryToLayer(geojson.geometry);
  return geometryLayer;
};

export const getLayerArea = (layer) => {
  const coordinates = layer.getLatLngs();
  let area = 0;
  coordinates.forEach((element, index) => {
    if (index === 0) area += geodesicArea(element);
    else area -= geodesicArea(element);
  });

  let length = 0;

  let isLine = false;
  if (area > 0) {
    length = getLength(coordinates[0]);
  } else {
    isLine = true;
    length = getLength(coordinates);
  }
  return {
    isLine,
    area,
    length,
    readableArea: {
      metric: readableArea(area, true),
    },
  };
};

export const getProperCoordinates = (c = []) => {
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
};

