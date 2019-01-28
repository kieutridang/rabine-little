const _ = require('lodash');
const Hashids = require('hashids');

export const RestripeEffectedAreaId = '5555977cde006d7d25ad7a96';
export const AsphaltCrackFillId = '6666977cde006d7d25ad7a96';
export const ConcretedCrackFillId = '7777866cde006d7d25ad7a96';
export const R = 6371000;

export const precision = {
  km: 2,
  ha: 2,
  m: 0,
  mi: 2,
  ac: 2,
  yd: 0,
  ft: 0,
  nm: 2
};

export const toFeet = (metric) => {
  let value = metric;
  let unit = null;

  if (metric && typeof metric === 'string' && metric.indexOf(' ') >= 0) {
    const src = metric.split(' ');
    [value, unit] = src;
  }

  switch (unit) {
    case 'm²':
      return value * 10.7639;
    case 'ha':
      return value * 107639;
    case 'km':
      return value * 3280.84;
    default: // metres
      return value * 3.28084;
  }
};

export const getDistance = (latlng1, latlng2) => {
  const rad = Math.PI / 180;
  const lat1 = latlng1.lat * rad;
  const lat2 = latlng2.lat * rad;
  const sinDLat = Math.sin((latlng2.lat - latlng1.lat) * (rad / 2));
  const sinDLon = Math.sin((latlng2.lng - latlng1.lng) * (rad / 2));
  const a = (sinDLat * sinDLat) + (Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const accumulatedLengths = (coords) => {
  if (coords.length === 0) {
    return [];
  }

  const lengths = [0];
  let total = 0;

  for (let i = 0, n = coords.length - 1; i < n; i++) { // eslint-disable-line
    total += getDistance(coords[i], coords[i + 1]);
    lengths.push(total);
  }

  return lengths;
};

export const getYearOnly = (strYear = '') => {
  const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

  let finalYear = strYear;
  years.forEach((year) => {
    if (strYear.includes(year)) {
      finalYear = year;
      return finalYear;
    }

    return year;
  });

  return finalYear;
};

export const getGeoLength = (geometry) => {
  const { coordinates } = geometry;

  let area = 0;

  if (coordinates && coordinates.length > 0) {
    const coods = coordinates.map(c => ({ lat: c[1], lng: c[0] }));
    const accumulated = accumulatedLengths(coods);
    area = accumulated.length > 0 ? accumulated[accumulated.length - 1] : 0;
  }

  return area;
};

export const totalPrice = (unitPrice, qty) => (qty * unitPrice).toFixed(2);

export const geodesicArea = (latLngs) => {
  const pointsCount = latLngs.length;
  let area = 0.0;
  const d2r = Math.PI / 180;
  let p1 = null;
  let p2 = null;

  if (pointsCount > 2) {
    for (let i = 0; i < pointsCount; i += 1) {
      p1 = latLngs[i];
      p2 = latLngs[(i + 1) % pointsCount];
      area += ((p2.lng - p1.lng) * d2r) *
        (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
    }
    area = (area * 6378137.0 * 6378137.0) / 2.0;
  }

  return Math.abs(area);
};

// @method formattedNumber(n, precision): string
// Returns n in specified number format (if defined) and precision
export const formattedNumber = (n, precis, numberFormat = null) => {
  let formatted = parseFloat(n).toFixed(precis);
  const format = numberFormat && numberFormat.numeric;
  const delimiters = format && format.delimiters;
  const thousands = delimiters && delimiters.thousands;
  let decimal = delimiters && delimiters.decimal;

  if (thousands || decimal) {
    const splitValue = formatted.split('.');
    const reg = /(\d)(?=(\d{3})+(?!\d))/g;
    formatted = thousands ? splitValue[0].replace(reg, `$1${thousands}`) : splitValue[0];
    decimal = decimal || '.';

    if (splitValue.length > 1) {
      formatted = formatted + decimal + splitValue[1];
    }
  }

  return formatted;
};

export const readableArea = (area, isMetric) => {
  let areaStr;
  let units;
  let calculatedArea = area;

  if (isMetric) {
    units = ['ha', 'm'];
    const type = typeof isMetric;
    if (type === 'string') {
      units = [isMetric];
    } else if (type !== 'boolean') {
      units = isMetric;
    }

    if (calculatedArea >= 1000000 && units.indexOf('km') !== -1) {
      areaStr = `${formattedNumber(area * 0.000001, precision.km)} km²`;
    } else if (area >= 10000 && units.indexOf('ha') !== -1) {
      areaStr = `${formattedNumber(area * 0.0001, precision.ha)} ha`;
    } else {
      areaStr = `${formattedNumber(area, precision.m)} m²`;
    }
  } else {
    calculatedArea /= 0.836127; // Square yards in 1 meter

    if (calculatedArea >= 3097600) { // 3097600 square yards in 1 square mile
      areaStr = `${formattedNumber(area / 3097600, precision.mi)} mi²`;
    } else if (calculatedArea >= 4840) { // 4840 square yards in 1 acre
      areaStr = `${formattedNumber(calculatedArea / 4840, precision.ac)} acres`;
    } else {
      areaStr = `${formattedNumber(calculatedArea, precision.yd)} yd²`;
    }
  }

  return areaStr;
};

const hasProperCoordinates = (coordinates, index = 0) =>
  coordinates
  && coordinates.length > index
  && coordinates[index]
  && coordinates[index][0];

export const getSiteArea = (geometry) => {
  const { coordinates } = geometry;

  let area = 0;

  for (let i = 0; i < coordinates.length; i += 1) {
    if (i === 0) {
      if (hasProperCoordinates(coordinates)) {
        const coods = coordinates[0].map(c => ({ lat: c[1], lng: c[0] }));
        area += geodesicArea(coods);
      }
    } else if (hasProperCoordinates(coordinates, i)) {
      const coods = coordinates[i].map(c => ({ lat: c[1], lng: c[0] }));
      area -= geodesicArea(coods);
    }
  }

  return area;
};

export const tryParseInt = (str, defaultValue) => {
  let retValue = defaultValue;

  if (str && str.length > 0 && !isNaN(str)) { // eslint-disable-line
    retValue = parseInt(str, 10);
  }

  return retValue;
};


export const tryParseFloat = (str, defaultValue) => {
  let retValue = defaultValue;
  if (str && str.length > 0 && !isNaN(str)) { // eslint-disable-line
    retValue = parseFloat(str);
  }

  return retValue;
};

export const mapRepairInputPrice = (repairInputPrice = {}) => {
  const {
    _id,
    siteId,
    featureId,
    unitPrice = 0,
    qty = 0,
    createdDate
  } = repairInputPrice;

  const total = totalPrice(unitPrice, qty);

  return {
    id: _id,
    siteId,
    featureId,
    unitPrice,
    qty,
    total,
    createdDate
  };
};

export const mapRepairInputPrices = (repairInputPricesDB = []) => {
  return repairInputPricesDB.map(mapRepairInputPrice);
};

export const mapRepairPrice = (repairPriceDB) => {
  const {
    y2018,
    y2019,
    y2020,
    y2021,
    y2022,
    y2023,
    _id,
    repairName,
    areaRangeLow,
    unit
  } = repairPriceDB;

  return {
    y2018,
    y2019,
    y2020,
    y2021,
    y2022,
    y2023,
    _id,
    repairName,
    areaRangeLow,
    unit
  };
};

const compareName = (text1 = '', text2 = '') => text1.toUpperCase() === text2.toUpperCase();

const sameConcreteCrackName = (text1 = '', text2 = '') => {
  const t1 = text1.toUpperCase();
  const t2 = text2.toUpperCase();

  if (t1.indexOf('CONCRETE CRACK') >= 0 && t2.indexOf('CONCRETE CRACK') >= 0) {
    return true;
  }

  return t1 === t2;
};

export const mapRepairPrices = (repairPricesDB = []) => {
  return repairPricesDB.map(mapRepairPrice);
};

export const groupZoneSameName = (zones) => {
  const reducedZones = zones.reduce((currentZones, zone) => {
    const index = currentZones.findIndex(i =>
      zone.title &&
      compareName(`${zone.title}-${zone.layerName}`, `${i.title}-${i.layerName}`));

    if (index >= 0) {
      const { area } = currentZones[index];
      const sumArea = parseFloat(area) + parseFloat((zone.area || '0'));
      const mergedZone = {
        ...currentZones[index],
        area: sumArea.toFixed(2).toString()
      };

      currentZones[index] = mergedZone; // eslint-disable-line
    } else {
      currentZones.push(zone);
    }

    return currentZones;
  }, []);

  return reducedZones;
};


export const getFinalPrice = (repairs, repairPrices, repairInputPrices) => {
  const pricedRepairs = repairs.map((repair) => {
    const { qty = 0, year, id, isGrouped } = repair;
    const iYear = tryParseInt(getYearOnly(year));
    let finalPrice = 0;

    const repairInputPrice = repairInputPrices
      .find(price => price.featureId.toString() === id.toString());

    if (repairInputPrice) {
      const { unitPrice: price } = repairInputPrice;
      finalPrice = price || 0;
    }

    const sortedPrices = _.sortBy(repairPrices, ['repairName', 'areaRangeLow']).reverse();

    const repairPrice = sortedPrices.find((repairPriceItem) => {
      const { repairName, areaRangeLow = 0, areaRangeHigh = -1 } = repairPriceItem;

      if (areaRangeHigh > 0) {
        return (
          compareName(repair.title, repairName) ||
          sameConcreteCrackName(repair.title, repairName)
        ) &&
          qty >= areaRangeLow &&
          qty <= areaRangeHigh;
      }

      return (
        compareName(repair.title, repairName) ||
        sameConcreteCrackName(repair.title, repairName)
      ) && qty >= areaRangeLow;
    });

    if (repairPrice && iYear >= 2018 && iYear <= 2023) {
      const yYear = `y${iYear}`;
      finalPrice = repairPrice[yYear] || 0;
    }

    return {
      ...repair,
      unitPrice: finalPrice.toString(),
      total: totalPrice(finalPrice, qty),
      isGrouped
    };
  });

  return pricedRepairs;
};

export const loadRestripeEffectedArea = (reducedRepairs = []) => {
  const repairPairs = _.toPairs(_.groupBy(_.filter(reducedRepairs, i => i.zone && i.restripeAffectedArea), i => `${i.year}_${i.zone}`));
  const results = repairPairs.map((pairs) => {
    const key = pairs[0];
    const year = key.split('_')[0];
    const zone = key.split('_')[1];
    const repairType = (pairs[1] && pairs[1].length > 0) ? pairs[1][0].repairType : '';
    const hashids = new Hashids(`${RestripeEffectedAreaId}_${key}`, 24);
    const id = hashids.encode(1);

    return {
      id,
      title: 'Restripe Affected Area',
      unit: 'LS',
      type: 'Repair',
      qty: 1,
      year,
      zone,
      repairType
    };
  }).filter(repair => repair.qty > 0);

  return results;
};

export const loadAsphaltCrackFill = (reducedRepairs) => {
  const repairPairs = _.toPairs(_.groupBy(_.filter(reducedRepairs, i => i.zone && i.fillAsphaltCrack), i => `${i.year}_${i.zone}`));
  const results = repairPairs.map((pairs) => {
    const key = pairs[0];
    const year = key.split('_')[0];
    const zone = key.split('_')[1];
    const values = pairs[1];

    const total = values.reduce((current, repair) => {
      if (repair.fillAsphaltCrack) {
        return current + parseFloat((repair.inputAsphalt || '0'));
      }

      return current;
    }, 0);

    const hashids = new Hashids(`${AsphaltCrackFillId}_${key}`, 24);
    const id = hashids.encode(2);

    return {
      id,
      title: 'Asphalt Crack Fill',
      unit: 'LF',
      type: 'Repair',
      qty: total,
      year,
      zone,
      repairType: 'Maintenance'
    };
  }).filter(repair => repair.qty > 0);

  return results;
};

export const loadConcreteCrackFill = (reducedRepairs) => {
  const repairPairs = _.toPairs(_.groupBy(_.filter(reducedRepairs, i => i.zone && i.concreteCrackFill), i => `${i.year}_${i.zone}`));
  const results = repairPairs.map((pairs) => {
    const key = pairs[0];
    const year = key.split('_')[0];
    const zone = key.split('_')[1];
    const values = pairs[1];

    const total = values.reduce((current, repair) => {
      if (repair.concreteCrackFill) {
        return current + parseFloat((repair.inputConcreteCrackFill || '0'));
      }

      return current;
    }, 0);

    const hashids = new Hashids(`${ConcretedCrackFillId}_${key}`, 24);
    const id = hashids.encode(2);

    return {
      id,
      title: 'Concrete Crack Seal',
      unit: 'LF',
      type: 'Repair',
      qty: total,
      year,
      zone,
      repairType: 'Maintenance'
    };
  }).filter(repair => repair.qty > 0);

  return results;
};

export const groupRepairs = (repairs) => {
  return repairs.reduce((currentRepairs, repair) => {

    const index = currentRepairs.findIndex(i =>
      repair.title &&
      repair.zone &&
      repair.year &&
      compareName(repair.title, i.title) &&
      repair.zone === i.zone &&
      repair.year === i.year);

    if (index >= 0) {
      const currentRepair = currentRepairs[index];
      const sumQty = parseFloat(currentRepair.qty) + parseFloat((repair.qty || '0'));
      const { inputArea = '0', inputAsphalt = '0', inputConcreteCrackFill = '0', inputOverrideSF = '0' } = currentRepair;
      const { restripeAffectedArea, fillAsphaltCrack, concreteCrackFill, overrideSF } = repair;

      let sumArea = parseFloat(inputArea);
      let sumAsphalt = parseFloat(inputAsphalt);
      let sumConcreteCrackFill = parseFloat(inputConcreteCrackFill);
      let sumOverrideSF = parseFloat(inputOverrideSF);

      if (restripeAffectedArea && inputArea) {
        const floatValue = parseFloat((repair.inputArea || '0'));
        sumArea += floatValue;
      }

      if (fillAsphaltCrack && inputAsphalt) {
        const floatValue = parseFloat((repair.inputAsphalt || '0'));
        sumAsphalt += floatValue;
      }

      if (concreteCrackFill && inputConcreteCrackFill) {
        const floatValue = parseFloat((repair.inputConcreteCrackFill || '0'));
        sumConcreteCrackFill += floatValue;
      }

      if (overrideSF && inputOverrideSF) {
        const floatValue = parseFloat((repair.inputOverrideSF || '0'));
        sumOverrideSF += floatValue;
      }

      const mergedRepair = {
        ...currentRepair,
        restripeAffectedArea: (restripeAffectedArea || currentRepair.restripeAffectedArea),
        fillAsphaltCrack: (fillAsphaltCrack || currentRepair.fillAsphaltCrack),
        concreteCrackFill: (concreteCrackFill || currentRepair.concreteCrackFill),
        overrideSF: (overrideSF || currentRepair.overrideSF),
        qty: sumQty,
        isGrouped: true,
        inputArea: sumArea.toString(),
        inputAsphalt: sumAsphalt.toString(),
        inputConcreteCrackFill: sumConcreteCrackFill.toString(),
        inputOverrideSF: sumOverrideSF.toString()
      };

      currentRepairs[index] = mergedRepair; // eslint-disable-line
    } else {
      currentRepairs.push(repair);
    }

    return currentRepairs;
  }, []);
};

export const groupRepairSameZone = (repairs) => {
  const reducedNoAsphaltRepairs = groupRepairs(repairs.filter(repair =>
    !(repair.title && (/seal coat (&|and) asphalt crack/i).test(repair.title)) &&
    ((!repair.fillAsphaltCrack && !repair.concreteCrackFill) ||
    (repair.fillAsphaltCrack && repair.restripeAffectedArea) ||
    (repair.fillAsphaltCrack && repair.title.indexOf('Asphalt Crack') < 0) ||
    (!repair.concreteCrackFill && repair.title.indexOf('Concrete Crack') > 0))));

  const asphaltCrackSealRepairs = repairs.filter(repair =>
    repair.title &&
    (/seal coat (&|and) asphalt crack/i).test(repair.title))
    .map((repair) => {
      return {
        ...repair,
        title: 'Asphalt Crack Seal'
      };
    });

  let sealCoatRepairs = [];

  if (asphaltCrackSealRepairs && asphaltCrackSealRepairs.length > 0) {
    sealCoatRepairs = asphaltCrackSealRepairs.map((repair) => {
      const {
        id,
        year,
        repairType,
        zone,
        qty,
        inputOverrideSF
      } = repair;

      const modifiedQty = inputOverrideSF ? (qty * inputOverrideSF) : qty;

      return {
        id,
        title: 'Seal Coat',
        unit: 'SF',
        type: 'Repair',
        qty: modifiedQty,
        year,
        zone,
        repairType
      };
    });
  }

  const reducedAsphaltRepairs = groupRepairs(repairs.filter(repair => repair.fillAsphaltCrack));
  const reducedConcreteRepairs = groupRepairs(repairs.filter(repair => repair.concreteCrackFill));

  const restripes = loadRestripeEffectedArea(repairs);
  const asphalts = loadAsphaltCrackFill(reducedAsphaltRepairs);
  const concretes = loadConcreteCrackFill(reducedConcreteRepairs);

  return [
    ...sealCoatRepairs,
    ...asphaltCrackSealRepairs,
    ...reducedNoAsphaltRepairs,
    ...restripes,
    ...asphalts,
    ...concretes
  ];
};

module.exports = {
  mapRepairInputPrice,
  mapRepairInputPrices,
  tryParseFloat,
  tryParseInt,
  getSiteArea,
  geodesicArea,
  toFeet,
  totalPrice,
  mapRepairPrice,
  mapRepairPrices,
  readableArea,
  groupRepairSameZone,
  groupZoneSameName,
  getFinalPrice,
  getGeoLength,
  getYearOnly
};
