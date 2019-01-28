import AreaPhotoRepairDB from '~/schemas/AreaPhotoRepair';

class AreaPhotoRepair {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  _mapModels(photoRepairItems = []) {
    return photoRepairItems.map(photoRepairItem => this._mapModel(photoRepairItem));
  }

  _mapModel(photoRepairItem) {
    const {
      _id,
      photoId,
      repairId,
      repairName,
      index
    } = photoRepairItem;

    return {
      _id,
      photoId,
      repairId,
      repairName,
      index
    };
  }

  async create(photoId, repairPayload) {
    try {
      const { repairId, repairName, index } = repairPayload;
      const areaPhotoRepair = { repairId, repairName, index, photoId };
      let data = await AreaPhotoRepairDB.findOne({ repairId, photoId });

      if (!data) {
        const photoRepair = new AreaPhotoRepairDB(areaPhotoRepair);
        data = await photoRepair.save();
      }

      return this._mapModel(data);
    } catch (err) {
      throw err;
    }
  }

  async update(repairInstanceId, repairPayload) {
    const query = { _id: repairInstanceId };
    const repair = { ...repairPayload };

    return AreaPhotoRepairDB.findOneAndUpdate(query, repair, { new: true })
      .then(data => this._mapModel(data));
  }

  async remove(photoId, repairId) {
    try {
      const response = await AreaPhotoRepairDB.remove({ photoId, repairId });
      return response.n > 0;
    } catch (err) {
      throw err;
    }
  }

  async getRepairsOfPhoto(photoId) {
    try {
      const data = await AreaPhotoRepairDB.find({ photoId });
      return this._mapModels(data);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AreaPhotoRepair;
