import RepairDB from '~/schemas/Repair';
import AreaPhotoDB from '~/schemas/AreaPhoto';
import seedData from '~/seed/repair';
import SiteAreaDB from '~/schemas/SiteArea';

class Repair {
  constructor() {
    this.seed(seedData);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async seed(data) {
    data.forEach(this.findOneOrCreate);

    this.list()
      .then((list) => {
        console.log(`> seed: ${data.length}/${list.length} repair items`); // eslint-disable-line
      });
  }

  async _mapPhotoUrlForPhotos(photos) {

    const mappedPhotos = await Promise.all(photos.map(async (photo) => {
      const { siteId, areaId } = photo;
      const signedOptimizedUrl = await this.area._getOptimizedPhotoUrl(photo, siteId, areaId);
      const signedThumbnailUrl = await this.area._getOptimizedPhotoUrl(photo, siteId, areaId, {
        width: 320,
        height: 240
      });
      const signedOriginalUrl = await this.area._getOriginalUrl(photo, siteId, areaId);

      return {
        ...photo,
        url: signedOptimizedUrl,
        originalUrl: signedOriginalUrl,
        thumbnailUrl: signedThumbnailUrl
      };
    }));

    return mappedPhotos;
  }

  async _mapModel(repair = {}) {
    return {
      id: repair._id,
      title: repair.title,
      createdDate: repair.createdDate
    };
  }

  async _mapModels(repairDb) {
    return repairDb.map((repair) => {
      return {
        id: repair._id,
        title: repair.title
      };
    });
  }

  async _create(title) {
    const d = new RepairDB({ title });
    return d.save();
  }

  async create(req) {
    const { title } = req;

    return this.getByTitle(title)
      .then((repair) => {
        if (repair) {
          throw new Error('Repair with that name already exists.');
        }

        return this._create(title);
      })
      .then(this._mapModel).catch((err) => {
        throw new Error(err);
      });
  }

  async findOneOrCreate(title) {
    const payload = { title };
    const foundOrCreated = await RepairDB.findOneOrCreate(payload, payload);
    return foundOrCreated;
  }

  async getByTitle(title) {
    return RepairDB.findOne({ title })
      .then((data) => {
        if (!data) {
          throw new Error('Not found.');
        }
        return data;
      })
      .then(this._mapModel)
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getById(_id) {
    return RepairDB.findOne({ _id })
      .then((data) => {
        if (!data) {
          throw new Error('Not found.');
        }
        return data;
      })
      .then(this._mapModel)
      .catch((err) => {
        throw new Error(err);
      });
  }

  async updateById(_id, title) {
    return RepairDB.findOne({ _id })
      .then((data) => {
        if (!data) {
          throw new Error('Not found.');
        }
        data.title = title; // eslint-disable-line
        return data.save();
      })
      .then(this._mapModel)
      .catch((err) => {
        throw new Error(err);
      });
  }

  async list(filter = {}) {
    const query = { deleted: false };
    const { title } = filter;

    if (title && typeof title === 'string') {
      query.title = { $regex: title };
    }

    return RepairDB.find(query)
      .then(data => this._mapModels(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getRepairPhotos(repairInstanceId) {

    const repairName = repairInstanceId.toHexString();
    const siteAreaQuery = {
      'photos.repairName': repairName,
      deleted: false
    };

    const oldPhotos = await SiteAreaDB.find(siteAreaQuery)
      .then((siteAreas) => {
        return siteAreas.reduce((siteAreaPhotos, siteArea) => {
          const areaPhotos = (siteArea.photos || []).filter(p => p.repairName === repairName)
            .map(photo => ({ ...photo, siteId: siteArea.siteId, areaId: siteArea._id }));

          if (areaPhotos.length > 0) {
            siteAreaPhotos.push(...areaPhotos);
          }

          return siteAreaPhotos;
        }, []);
      })
      .then(photosData => this.areaPhoto._mapModels(photosData))
      .then(photos => this._mapPhotoUrlForPhotos(photos));

    const query = { repairName, deleted: false };

    const photos = await AreaPhotoDB.find(query)
      .then(photosData => this.areaPhoto._mapModels(photosData));


    return [
      ...oldPhotos,
      ...photos
    ];
  }
}

module.exports = Repair;
