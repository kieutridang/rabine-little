import RoofingFeatureDB from '~/schemas/RoofingFeature';
import SiteMapLayerDB from '~/schemas/SiteMapLayer';

const pickBy = require('lodash/pickBy');
const identity = require('lodash/identity');

class RoofingFeature {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  _mapModel(roofDB) {
    const {
      _id,
      siteId,

      title,
      index,
      color,
      type,
      patchNumber,

      layerId,
      layerType,

      defectType,
      typeOfRepair,
      repairType,
      repairCost,

      zoneId,
      zoneType,
      zoneSubType,
      zoneName,

      geojson,

      rating
    } = roofDB;

    return {
      id: _id,
      title,
      index,
      color,
      type,
      patchNumber,

      layerId,
      layerType: layerType || 'MEASUREMENT_LAYER_ROOFING',
      featureType: 'ROOFING',
      defectType,
      typeOfRepair,
      repairType,
      repairCost,

      zoneId,
      zoneType,
      zoneSubType,
      zoneName,

      siteId,
      geojson,
      rating
    };
  }

  _mapModels(roofsDB) {
    return roofsDB.map(roofingFeature => this._mapModel(roofingFeature));
  }

  async list(queryRequest) {
    const { siteId, type } = queryRequest;
    const query = { siteId };
    query.$or = [{ deleted: { $exists: false } }, { deleted: false }];

    if (type && type !== 'all') {
      query.type = type;
    }

    try {
      const roofingsDB = await RoofingFeatureDB.find(query);
      return this._mapModels(roofingsDB);
    } catch (err) {
      throw new Error(err);
    }

  }

  async remove(request) {
    const { siteId, id } = request;
    const query = { siteId, _id: id, deleted: false };

    try {
      const result = await RoofingFeatureDB.deleteOne(query);
      return result;
    } catch (err) {
      throw new Error(err);
    }
  }

  async post(siteId, payloadRequest) {
    const {
      title,
      index,
      color,
      type,
      patchNumber,

      layerId,
      layerType,

      defectType,
      typeOfRepair,
      repairType,
      repairCost,

      zoneId,
      zoneType,
      zoneSubType,
      zoneName,

      geojson,

      rating
    } = payloadRequest;

    // validate layerId
    if (layerId) {
      const layer = await SiteMapLayerDB.findOne({ _id: layerId, siteId });

      if (!layer) {
        throw Error('There is no layer with that site');
      }
    }

    const newData = {
      title,
      index,
      color,
      type,
      patchNumber,

      layerId,
      layerType,

      defectType,
      typeOfRepair,
      repairType,
      repairCost,

      zoneId,
      zoneType,
      zoneSubType,
      zoneName,

      geojson,
      siteId,

      rating
    };

    try {
      const data = pickBy(newData, identity);
      const roofingFeature = new RoofingFeatureDB(data);

      const roofingDB = await roofingFeature.save();
      return this._mapModel(roofingDB);
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(siteId, id, payloadRequest) {
    const {
      title,
      index,
      color,
      type,
      patchNumber,

      layerId,
      layerType,

      defectType,
      typeOfRepair,
      repairType,
      repairCost,

      zoneId,
      zoneType,
      zoneSubType,
      zoneName,

      geojson,

      rating
    } = payloadRequest;

    // validate layerId
    if (layerId) {
      const layer = await SiteMapLayerDB.findOne({ _id: layerId, siteId });

      if (!layer) {
        throw Error('There is no layer with that site');
      }
    }

    const updatedData = {
      title,
      index,
      color,
      type,
      patchNumber,

      layerId,
      layerType,

      defectType,
      typeOfRepair,
      repairType,
      repairCost,

      zoneId,
      zoneType,
      zoneSubType,
      zoneName,

      geojson,
      siteId,

      rating
    };

    try {
      const query = { _id: id, siteId, deleted: false };

      const roofingDB = await RoofingFeatureDB.findOneAndUpdate(query, updatedData, { new: true });
      return this._mapModel(roofingDB);
    } catch (err) {
      throw new Error(err);
    }
  }
}
module.exports = RoofingFeature;
