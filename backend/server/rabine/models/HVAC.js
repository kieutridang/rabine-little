import HVACDB from '~/schemas/HVAC';

const pickBy = require('lodash/pickBy');
const identity = require('lodash/identity');


class HVAC {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  _mapModel(hvacDB) {
    const {
      _id,
      siteId,
      currentUnitCost,
      drigInstallCost,
      geojson,
      invoice,
      layerType,
      manufactureDate,
      modelNumber,
      pubScore,
      serialNumber,
      unitNumber,
      unitTonnage,
      unitType
    } = hvacDB;

    return {
      id: _id,
      siteId,
      currentUnitCost,
      drigInstallCost,
      geojson,
      invoice,
      layerType,
      manufactureDate,
      modelNumber,
      pubScore,
      serialNumber,
      unitNumber,
      unitTonnage,
      unitType
    };
  }

  _mapModels(hvacsDB) {
    return hvacsDB.map(hvac => this._mapModel(hvac));
  }

  async remove(queryRequest) {
    const { siteId, id } = queryRequest;
    const query = { siteId, _id: id, deleted: false };

    return HVACDB.remove(query)
      .then(data => this._mapModel(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async update(id, updateRequest) {
    const {
      currentUnitCost,
      drigInstallCost,
      geojson,
      invoice,
      layerType,
      manufactureDate,
      modelNumber,
      pubScore,
      serialNumber,
      unitNumber,
      unitTonnage,
      unitType
    } = updateRequest;

    const updatedDate = pickBy({
      currentUnitCost,
      drigInstallCost,
      geojson,
      invoice,
      layerType,
      manufactureDate,
      modelNumber,
      pubScore,
      serialNumber,
      unitNumber,
      unitTonnage,
      unitType
    }, identity);

    const query = { _id: id, deleted: false };

    return HVACDB.findOneAndUpdate(query, updatedDate, { new: true })
      .then(data => this._mapModel(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async list(queryRequest) {
    const { siteId } = queryRequest;
    const query = { siteId, deleted: false };

    return HVACDB.find(query)
      .then(data => this._mapModels(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async post(siteId, payloadRequest) {
    const {
      currentUnitCost,
      drigInstallCost,
      geojson,
      invoice,
      layerType,
      manufactureDate,
      modelNumber,
      pubScore,
      serialNumber,
      unitNumber,
      unitTonnage,
      unitType
    } = payloadRequest;

    const data = {
      currentUnitCost,
      drigInstallCost,
      geojson,
      invoice,
      layerType,
      manufactureDate,
      modelNumber,
      pubScore,
      serialNumber,
      unitNumber,
      unitTonnage,
      unitType,
      siteId
    };

    const hvac = new HVACDB(data);
    return hvac.save()
      .then(dataDB => this._mapModel(dataDB))
      .catch((err) => {
        throw new Error(err);
      });

  }
}
module.exports = HVAC;
