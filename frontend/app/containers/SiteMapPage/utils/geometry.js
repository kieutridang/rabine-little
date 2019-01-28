import L from 'leaflet';

const defaultPrecision = {
  km: 2,
  ha: 2,
  m: 0,
  mi: 2,
  ac: 2,
  yd: 0,
  ft: 2,
  nm: 2,
};

const format = {
  numeric: {
    delimiters: {
      thousands: ',',
      decimal: '.',
    },
  },
};

// @method formattedNumber(n, precision): string
// Returns n in specified number format (if defined) and precision
export const formattedNumber = (n, precision) => {
  const delimiters = format && format.delimiters;
  const thousands = delimiters && delimiters.thousands;
  let decimal = delimiters && delimiters.decimal;
  let formatted = parseFloat(n).toFixed(precision);

  if (thousands || decimal) {
    const splitValue = formatted.split('.');

    decimal = decimal || '.';
    formatted = thousands ? splitValue[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousands}`) : splitValue[0];

    if (splitValue.length > 1) {
      formatted = formatted + decimal + splitValue[1];
    }
  }

  return formatted;
};

// @method geodesicArea(): number
export const geodesicArea = (latLngs) => {
  const pointsCount = latLngs.length;
  const d2r = Math.PI / 180;
  let area = 0.0;
  let p1;
  let p2;

  if (pointsCount > 2) {
    for (let i = 0; i < pointsCount; i++) { // eslint-disable-line
      p1 = latLngs[i];
      p2 = latLngs[(i + 1) % pointsCount];
      area += ((p2.lng - p1.lng) * d2r) * (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
    }

    area *= 6378137.0;
    area *= 6378137.0;
    area /= 2.0;
  }

  return Math.abs(area);
};

// @method readableArea(area, isMetric, precision): string
// Returns a readable area string in yards or metric.
// The value will be rounded as defined by the precision option object.
export const readableArea = (area, isMetric, precisionLevel) => {
  const precision = L.Util.extend({}, defaultPrecision, precisionLevel);
  let areaStr;

  if (isMetric) {
    const type = typeof isMetric;
    let units = ['ha', 'm'];
    if (type === 'string') {
      units = [isMetric];
    } else if (type !== 'boolean') {
      units = isMetric;
    }

    if (area >= 1000000 && units.indexOf('km') !== -1) {
      areaStr = `${formattedNumber(area * 0.000001, precision.km)} km²`;
    } else if (area >= 10000 && units.indexOf('ha') !== -1) {
      areaStr = `${formattedNumber(area * 0.0001, precision.ha)} ha`;
    } else {
      areaStr = `${formattedNumber(area, precision.m)} m²`;
    }
  } else {
    const sqyards = area / 0.836127; // Square yards in 1 meter

    if (sqyards >= 3097600) {
      // 3097600 square yards in 1 square mile
      areaStr = `${formattedNumber(sqyards / 3097600, precision.mi)} mi²`;
    } else if (sqyards >= 4840) {
      // 4840 square yards in 1 acre
      areaStr = `${formattedNumber(sqyards / 4840, precision.ac)} acres`;
    } else {
      areaStr = `${formattedNumber(sqyards, precision.yd)} yd²`;
    }
  }

  return areaStr;
};

// @method readableDistance(distance, units): string
// Converts a metric distance to one of [ feet, nauticalMile, metric or yards ] string

// @alternative
// @method readableDistance(distance, isMetric, useFeet, isNauticalMile, precision): string
// Converts metric distance to distance string.
// The value will be rounded as defined by the precision option object.
export const readableDistance = (distance, isMetric, isFeet, isNauticalMile, precisionLevel) => {
  const precision = L.Util.extend({}, defaultPrecision, precisionLevel);
  let distanceStr;
  let units;

  if (isMetric) {
    units = typeof isMetric === 'string' ? isMetric : 'metric';
  } else if (isFeet) {
    units = 'feet';
  } else if (isNauticalMile) {
    units = 'nauticalMile';
  } else {
    units = 'yards';
  }

  switch (units) {
    case 'metric':
      // show metres when distance is < 1km, then show km
      if (distance > 1000) {
        distanceStr = `${formattedNumber(distance / 1000, precision.km)} km`;
      } else {
        distanceStr = `${formattedNumber(distance, precision.m)} m`;
      }
      break;
    case 'feet': // eslint-disable-line
      const feet = distance * 1.09361 * 3;
      distanceStr = `${formattedNumber(feet, precision.ft)} ft`;
      break;
    case 'nauticalMile': // eslint-disable-line
      const nm = distance * 0.53996;
      distanceStr = `${formattedNumber(nm / 1000, precision.nm)} nm`;
      break;
    case 'yards': // eslint-disable-line
    default: // eslint-disable-line
      const yards = distance * 1.09361;

      if (yards > 1760) {
        distanceStr = `${formattedNumber(yards / 1760, precision.mi)} miles`;
      } else {
        distanceStr = `${formattedNumber(yards, precision.yd)} yd`;
      }
      break;
  }
  return distanceStr;
};
