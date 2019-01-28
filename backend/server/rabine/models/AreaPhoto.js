import AreaPhotoDB from '~/schemas/AreaPhoto';

const RepairDefect = [
  'repair',
  'defected'
];

class AreaPhoto {
  constructor(opts) {
    Object.assign(this, opts);
  }

  _mapModels(areaPhotoItems = []) {
    const self = this;
    return areaPhotoItems.map(areaPhotoItem => self._mapModel(areaPhotoItem));
  }

  _mapModel(areaPhotoItem) {
    const {
      _id,
      droneMake,
      droneModel,
      title,
      taken,
      location,
      isUplift,
      url,
      repairId,
      defected,
      severity,
      repair,
      repairName,
      createdDate,
      annotations,
      siteId,
      areaId
    } = areaPhotoItem;

    return {
      _id,
      droneMake,
      droneModel,
      title,
      taken,
      location,
      isUplift,
      url,
      repairId,
      defected,
      severity,
      repair,
      repairName,
      createdDate,
      annotations,
      siteId,
      areaId
    };
  }

  async getAreaPhotosOf(siteS3Folder, areaFolderName, page, pageSize) {
    const path = `^${siteS3Folder}/${areaFolderName}`;
    const urlPath = path.replace(/\s+/g, '\\+');
    const query = {};

    if (RepairDefect.indexOf(areaFolderName) >= 0) {
      query[areaFolderName] = true;
      if (siteS3Folder && typeof siteS3Folder === 'string') {
        query.url = { $regex: siteS3Folder };
        query.$or = [{ deleted: { $exists: false } }, { deleted: false }];
      }
    } else if (urlPath && typeof urlPath === 'string') {
      query.url = { $regex: urlPath };
      query.$or = [{ deleted: { $exists: false } }, { deleted: false }];
    }
    const pipe1 = { $match: query };
    const pipe2 = {
      $group: {
        _id: null,
        count: { $sum: 1 },
        photos: { $push: '$$ROOT' }
      }
    };
    const pipe3 = {
      $project: {
        count: 1,
        photos: { $slice: ['$photos', (page - 1) * pageSize, pageSize] }
      }
    };
    const aggregationQuery = [pipe1, pipe2];
    if (page && pageSize) {
      aggregationQuery.push(pipe3);
    }
    return AreaPhotoDB.aggregate(aggregationQuery).then((areas) => {
      if (areas.length > 0) {
        const areasInfo = areas[0];
        areasInfo.photos = this._mapModels(areasInfo.photos);
        return areasInfo;
      }
      return {};
    })
    .catch((error) => {
      throw new Error(error);
    });
  }

  async getAreaPhotosCountOf(siteS3Folder, areaFolderName) {
    const path = areaFolderName ? `^${siteS3Folder}/${areaFolderName}` : `^${siteS3Folder}`;
    const urlPath = path.replace(/\s+/g, '\\+');
    const query = {};
    if (urlPath && typeof urlPath === 'string') {
      query.url = { $regex: urlPath };
      query.$or = [{ deleted: { $exists: false } }, { deleted: false }];
    }
    return AreaPhotoDB.count(query);
  }

  async removeAreaPhotos(urls) {
    return AreaPhotoDB.updateMany(
      { url: { $in: urls } },
      { $set: { deleted: true } }
    );
  }

  async getAreaPhotosOfFolder(folderPath) {
    const path = folderPath;
    const urlPath = path.replace(/\s+/g, '\\+');
    const query = {};
    if (urlPath && typeof urlPath === 'string') {
      query.url = { $regex: urlPath };
      query.$or = [{ deleted: { $exists: false } }, { deleted: false }];
    }
    return AreaPhotoDB.find(query)
      .select({ url: 1 });
  }

  async removeAreaPhoto(url) {
    return AreaPhotoDB.remove({ url });
  }

  async updateZonePhotos(photos) {
    if (photos) {
      photos.map(async (photo) => {
        const { _id, zoneId } = photo;
        await AreaPhotoDB.findOneAndUpdate({ _id }, { zoneId });
      });
    }
  }

  async syncAreaPhoto(areaPhoto) {
    const {
      droneMake,
      droneModel,
      title,
      taken,
      location,
      isUplift,
      url
    } = areaPhoto;

    return AreaPhotoDB.findOneAndUpdate(
      {
        url,
        $or: [{ deleted: { $exists: false } }, { deleted: false }]
      },
      {
        droneMake,
        droneModel,
        title,
        taken,
        location,
        isUplift,
        url
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

module.exports = AreaPhoto;
