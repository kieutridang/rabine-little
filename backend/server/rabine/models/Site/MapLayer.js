import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';

import SiteMapLayerDB from '~/schemas/SiteMapLayer';

class SiteMapLayer {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async _mapModel(mapLayerDB = {}) {
    const {
      _id,
      siteId,
      name,
      featureType,
      index,
      createdAt,
      updatedAt
    } = mapLayerDB;


    return {
      _id,
      siteId,
      name,
      featureType,
      index,
      createdAt,
      updatedAt
    };
  }

  async _mapModels(mapLayersDB = []) {
    return mapLayersDB.map((mapLayerDB) => {
      const {
        _id,
        siteId,
        name,
        featureType,
        index,
        createdAt,
        updatedAt
      } = mapLayerDB;


      return {
        _id,
        siteId,
        name,
        featureType,
        index,
        createdAt,
        updatedAt
      };
    });
  }

  async populateWithInitialLayers(
    siteId,
    featureType = 'PAVEMENT',
    initialLayers = ['Zone Map', '2018', '2019', '2020', '2021', '2022', '2023']
  ) {
    const initialMeasurementLayers = initialLayers.map((name, index) => ({
      index,
      name,
      siteId,
      featureType
    }));

    const layers = await this.MapLayer.createMany(initialMeasurementLayers);
    return layers;
  }

  async createMany(mapLayers = []) {

    if (mapLayers && mapLayers.length > 0) {
      try {
        const mapLayersDB = await SiteMapLayerDB.insertMany([...mapLayers]);
        const models = this._mapModels(mapLayersDB);

        return models;
      } catch (err) {
        throw new Error(err);
      }
    }

    return [];
  }

  async create(mapLayerRequest) {
    const {
      siteId,
      name,
      featureType,
      index,
      _id
    } = mapLayerRequest;

    try {
      const data = pickBy({
        siteId,
        name,
        featureType,
        index
      }, identity);

      if (_id) {
        data._id = _id;
      }

      const siteMapLayer = new SiteMapLayerDB(data);

      const mayLayerDB = await siteMapLayer.save();
      const mapLayer = this._mapModel(mayLayerDB);

      return mapLayer;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateRaw(layerId, updateFields) {
    return SiteMapLayerDB.update({ _id: layerId }, {
      $set: { ...updateFields }
    });
  }

  async update(mapLayerRequest) {
    const {
      _id,
      siteId,
      name,
      featureType,
      index
    } = mapLayerRequest;

    try {
      const query = { _id };
      const updatedData = pickBy({
        siteId,
        name,
        featureType,
        index
      }, identity);

      const mapLayerDB = await SiteMapLayerDB.findOneAndUpdate(
        query,
        updatedData,
        { new: true }
      );
      const mapLayer = this._mapModel(mapLayerDB);

      return mapLayer;
    } catch (err) {
      throw new Error(err);
    }
  }

  async listRaw(siteId) {
    const query = { siteId };
    const mapLayers = await SiteMapLayerDB.find(query);
    return mapLayers;
  }

  async list(siteId, featureType = 'PAVEMENT') {
    const query = { siteId };

    if (featureType === 'PAVEMENT') {
      query.$or = [{ featureType: { $exists: false } }, { featureType }];
    } else {
      query.featureType = featureType;
    }

    try {
      const mapLayersDB = await SiteMapLayerDB.find(query);
      let mapLayers = [];

      if (featureType === 'ROOFING' && (!mapLayersDB || mapLayersDB.length <= 0)) {
        mapLayers = await this.populateWithInitialLayers(
          siteId,
          'ROOFING',
          ['Zone Map', '2018', '2019', '2020', '2021', '2022', '2023']
        );
      } else {
        mapLayers = this._mapModels(mapLayersDB);
      }

      return mapLayers;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getById(id) {
    const query = { _id: id };

    try {
      const mapLayerDB = await SiteMapLayerDB.findOne(query);
      const mapLayer = this._mapModel(mapLayerDB);

      return mapLayer;
    } catch (err) {
      throw new Error(err);
    }
  }

  async removeById(id) {
    const query = { _id: id };

    try {
      return await SiteMapLayerDB.deleteOne(query);
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = SiteMapLayer;
