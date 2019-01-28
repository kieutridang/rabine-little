import AppInfoDB from '~/schemas/AppInfo';

class AppInfo {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async _mapModel(appInfo) {
    const {
      key,
      data,
      updatedAt
    } = appInfo;


    return {
      key,
      data,
      updatedAt
    };
  }

  async _mapModels(dbItems = []) {
    return dbItems.map((item) => {
      const {
        key,
        data,
        updatedAt
      } = item;

      return {
        key,
        data,
        updatedAt
      };
    });
  }

  async createOrUpdate(appInfoRequest) {
    const { key, data } = appInfoRequest;

    return AppInfoDB.findOneAndUpdate(
      { key },
      {
        key,
        data
      },
      { upsert: true, new: true }
    );
  }

  async create(appInfoRequest) {
    const { key, data } = appInfoRequest;

    const appInfo = new AppInfoDB({
      key,
      data
    });

    return appInfo.save()
      .then(dbItems => this._mapModel(dbItems));
  }

  async list() {
    return AppInfoDB.find({ })
    .then(data => this._mapModels(data))
    .catch((err) => { throw new Error(err); });
  }

  async getById(key) {
    return AppInfoDB.findOne({ key })
    .then((data) => {
      return data ? this._mapModel(data) : null;
    })
    .catch((err) => { throw new Error(err); });
  }
}

module.exports = AppInfo;
