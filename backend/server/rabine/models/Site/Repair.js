import find from 'lodash/find';
import mongoose from 'mongoose';

import RepairPriceDB from '~/schemas/RepairPrice';
import RepairInputPriceDB from '~/schemas/RepairInputPrice';

import SiteAreaDB from '~/schemas/SiteArea';
import SiteRepairDB from '~/schemas/SiteRepair';

import {
  mapRepairInputPrice,
  mapRepairInputPrices,
  tryParseFloat,
  tryParseInt,
  getSiteArea,
  readableArea,
  toFeet,
  totalPrice,
  mapRepairPrices,
  groupRepairSameZone,
  groupZoneSameName,
  getFinalPrice,
  getGeoLength,
  getYearOnly
} from '~/util/siteRepair';

import s3 from '~/util/s3';

const RepairsCroppedBucket = 'rabine-repairs-cropped';

class SiteRepair {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  _mapDBToModels(siteRepairsDB = []) {
    return siteRepairsDB.map(item => this._mapDBToModel(item));
  }

  _mapDBToModel(siteRepairDB) {
    const {
      _id: id,
      siteId,
      title,
      unit,
      croppedUrl,
      isCropUploaded,
      type,
      qty,
      year,
      zone
    } = siteRepairDB;

    return {
      id,
      siteId,
      featureId: id,
      title,
      unit,
      type,
      qty,
      year,
      zone,
      croppedUrl,
      isCropUploaded,
      isManually: true
    };
  }

  async getSiteRepairs(siteId) {
    return SiteRepairDB.find({ siteId, deleted: false })
      .then(siteRepairs => this._mapDBToModels(siteRepairs));
  }

  async _checkAndSaveRepairPrice(siteRepair, siteRepairInput) {
    const { unitPrice } = siteRepairInput;
    const result = { ...siteRepair };

    if (unitPrice && unitPrice > 0) {
      const { id: featureId, siteId, qty } = siteRepair;
      const inputPrice = { siteId, featureId, unitPrice, qty };

      const repairInputPrice = await this.updateRepairInputPrice(inputPrice);
      result.unitPrice = repairInputPrice.unitPrice;
    }

    return result;
  }

  async getById(repairId) {
    return SiteRepairDB.findOne({ _id: repairId });
  }

  async deleteSiteRepair(repairId) {
    return SiteRepairDB.deleteOne({ _id: repairId });
  }

  async addSiteRepair(siteRepairInput) {
    const siteRepairItem = new SiteRepairDB({
      ...siteRepairInput
    });

    return siteRepairItem.save()
      .then(this._mapDBToModel)
      .then(siteRepair => this._checkAndSaveRepairPrice(siteRepair, siteRepairInput));
  }

  async updateSiteRepair(siteRepairInput) {
    const { id: _id } = siteRepairInput;
    const { title, qty, unit, zone, year } = siteRepairInput;

    return SiteRepairDB.findOneAndUpdate({ _id }, { title, qty, unit, zone, year })
      .then(this._mapDBToModel)
      .then(siteRepair => this._checkAndSaveRepairPrice(siteRepair, siteRepairInput));
  }

  async getRepairInputPrices(siteId) {

    return RepairInputPriceDB.find({ siteId })
      .then(mapRepairInputPrices);
  }

  async getRepairInputPrice(siteId, featureId) {

    return RepairInputPriceDB.find({ siteId, featureId })
      .then(mapRepairInputPrice);
  }

  async updateRepairInputPrice(inputPrice) {
    const { siteId, featureId, unitPrice, qty } = inputPrice;
    const query = { siteId, featureId };
    const update = { siteId, featureId, unitPrice, qty };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    return RepairInputPriceDB.findOneAndUpdate(query, update, options)
      .then(mapRepairInputPrice);
  }

  async getAllRepairPrices() {
    return RepairPriceDB.find({})
      .then(mapRepairPrices);
  }

  async listRepairBySiteIds(siteIds) {
    const repairs = await Promise.all(siteIds.map(async (siteId) => {
      const siteRepairs = await this.getRepairPolygonBySiteId(siteId);
      return siteRepairs.map(repair => ({ ...repair, siteId }));
    }));

    const results = repairs.reduce((first, second) => [...first, ...second], []);
    return results;
  }

  async getRepairPolygonBySiteId(siteId) {
    const repair = await this.listRepairPolygon(siteId)
      .then(data => data)
      .catch((error) => { throw new Error(error); });
    return repair;
  }

  async listRepairPolygon(siteId) {
    const repairPrices = await this.getAllRepairPrices();
    const repairInputPrices = await this.getRepairInputPrices(siteId);
    const repairsManually = await this.getSiteRepairs(siteId);

    const calculateFinalPrices = repairs => getFinalPrice(repairs, repairPrices, repairInputPrices);

    return this.getSiteFeatures(siteId, false)
      .then(({ layers, features, zones }) => {
        return features.filter(f => !!f.layerId).map((feature) => {
          const {
            geojson: { geometry },
            title = '',
            _id, // eslint-disable-line
            zoneId,
            layerId,
            restripeAffectedArea,
            fillAsphaltCrack,
            concreteCrackFill,
            overrideSF,
            inputArea,
            inputAsphalt,
            inputConcreteCrackFill,
            inputOverrideSF,
            repairType
          } = feature;

          const layer = find(layers, { _id: layerId });
          const year = layer && layer.name;
          const shortYear = getYearOnly(layer && layer.name);

          const zone = mongoose.Types.ObjectId.isValid(zoneId) &&
            find(zones, { _id: mongoose.Types.ObjectId(zoneId) });

          const zoneTitle = zone && zone.title ? zone.title : 'Not set';
          const zoneLayerId = zone && zone.layerId ? zone.layerId : '';
          const zoneLayer = find(layers, { _id: zoneLayerId });
          const zoneLayerName = zoneLayer && zoneLayer.name ? zoneLayer.name : 'Untitled';

          const area = getSiteArea(geometry);
          const length = getGeoLength(geometry);
          const areaSquared = toFeet(readableArea(area, true)).toFixed(2);
          const type = 'Repair';
          const realRepairType = fillAsphaltCrack ? 'Maintenance' : repairType;

          let qty;
          let unit;

          if (title.toUpperCase() === '8x8 Concrete Collar'.toUpperCase() ||
            title.toUpperCase() === '8\' x 8\' Concrete Collar'.toUpperCase() ||
            title.toUpperCase() === 'Infrared'.toUpperCase()
          ) {
            qty = '1';
            unit = 'Each';
          } else if (overrideSF) {
            const overrideSFValue = parseFloat((inputOverrideSF || '0'));
            const areaValue = (areaSquared && areaSquared > 0 ?
              areaSquared : toFeet(length).toFixed(2)
            );
            qty = areaValue * (overrideSFValue / 100);
            unit = 'LF';
          } else {
            qty = areaSquared && areaSquared > 0 ? areaSquared : toFeet(length).toFixed(2);
            unit = (!areaSquared || areaSquared == 0) && length && length > 0 ? 'LF' : 'SF'; // eslint-disable-line
          }

          const repair = {
            id: _id,
            title,
            year,
            unit,
            qty,
            type,
            zoneLayerName,
            zone: zoneTitle,
            restripeAffectedArea,
            fillAsphaltCrack,
            concreteCrackFill,
            overrideSF,
            inputArea,
            inputAsphalt,
            inputConcreteCrackFill,
            inputOverrideSF,
            repairType: realRepairType
          };

          const fQty = tryParseFloat(qty, 0);
          let unitPrice = 0;

          const repairInputPrice = repairInputPrices
            .find(price => price.featureId.toString() === repair.id);

          if (repairInputPrice) {
            const { unitPrice: price } = repairInputPrice;
            unitPrice = price;
          } else if (title && shortYear && tryParseInt(shortYear)) {
            const iYear = tryParseInt(shortYear);
            const repairPrice = repairPrices.find(i => i.repairName === title);

            if (repairPrice && iYear >= 2018 && iYear <= 2023) {
              const yYear = `y${iYear}`;
              unitPrice = repairPrice[yYear];
            }
          }

          repair.unitPrice = unitPrice;
          repair.total = totalPrice(unitPrice, fQty);

          return repair;
        });
      })
      .then(repairs => [...repairsManually, ...repairs])
      .then(groupRepairSameZone)
      .then(calculateFinalPrices);
  }

  async getSiteFeatures(siteId, isZoneMap = false) {
    return this.Map.getSiteFeatures(siteId)
      .then((site) => {
        const { layers = [], features = [] } = site;

        const filteredFeatures = features.filter((f) => {
          const layer = find(layers, { _id: f.layerId, siteId });
          const isZoneLayer = layer && layer.name.toLowerCase().trim().includes('zone');
          if (isZoneMap) { return isZoneLayer; }
          return !isZoneLayer;
        });

        const filteredZones = features.filter((f) => {
          const layer = find(layers, { _id: f.layerId, siteId });
          const isZoneLayer = layer && layer.name.toLowerCase().trim().includes('zone');
          if (!isZoneMap) { return isZoneLayer; }
          return isZoneLayer;
        });

        return {
          layers,
          features: filteredFeatures,
          zones: filteredZones
        };
      });
  }

  async listZonesBySiteIds(siteIds) {
    const zones = await Promise.all(siteIds.map(async (siteId) => {
      const siteZones = await this.listZonePolygon(siteId);
      return siteZones.map(zone => ({ ...zone, siteId }));
    }));

    const results = zones.reduce((first, second) => [...first, ...second], []);
    return results;
  }

  async listZonePolygon(siteId) {
    return this.getSiteFeatures(siteId, true)
      .then(({ layers, features }) => features.map((feature) => {
        const {
          geojson: { geometry = {} },
          title,
          _id,
          pci,
          surfaceType,
          layerId,
          trafficType
        } = feature;

        const layer = find(layers, { _id: layerId });

        const area = getSiteArea(geometry);
        const feetArea = toFeet(readableArea(area, true)).toFixed(2);

        return {
          id: _id,
          title,
          area: feetArea,
          pci,
          layerName: layer && layer.name ? layer.name : '',
          type: 'Zone Map',
          surfaceType,
          trafficType
        };
      }))
      .then(groupZoneSameName);
  }

  async listZoneOptions(siteId) {
    return this.getSiteFeatures(siteId, true)
      .then(({ features }) =>
        features.map(({ _id, title }) => ({ _id, title })))
      .catch((error) => { throw new Error(error); });
  }

  async exportExcel(siteId, type) {
    return type === 'zone' ?
      this.listZonePolygon(siteId) :
      this.listRepairPolygon(siteId);
  }

  async setCropUploadURL(siteId, repairName, croppedUrl) {
    const query = {
      siteId,
      deleted: false,
      'photos.repairName': `${repairName}`
    };

    const updated = await SiteAreaDB.findOneAndUpdate(query, {
      'photos.$.croppedUrl': croppedUrl,
      'photos.$.isCropUploaded': false
    }, { upsert: true, new: true });

    return updated;
  }

  async setCropUploaded({ siteId, repairName }) {
    const updated = await SiteAreaDB.update({
      siteId,
      'photos.repairName': `${repairName}`
    }, {
      $set: {
        'photos.$.isCropUploaded': true
      }
    });
    return updated;
  }

  async getCropUploadURL({ siteId, repairName, fileName, type }) {
    const key = `${repairName}/cropped/${fileName}`;
    const params = {
      Bucket: RepairsCroppedBucket,
      Key: key,
      ContentType: type,
      Expires: 120
    };

    const signedUrl = s3.getSignedUrl('putObject', params);
    const readUrl = this.getCroppedUrl(key);

    await this.setCropUploadURL(siteId, repairName, readUrl);

    return {
      readUrl,
      signedUrl
    };
  }

  getCroppedUrl(key) {
    const params = {
      Bucket: RepairsCroppedBucket,
      Key: key,
      ResponseCacheControl: 'no-cache'
    };

    return s3.getSignedUrl('getObject', params);
  }
}

module.exports = SiteRepair;
