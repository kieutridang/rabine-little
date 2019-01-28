import SiteActivityDB from '~/schemas/SiteActivity';
import User from '~/schemas/User';

import { ActivityType } from '~/constants';

class SiteActivity {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async _mapModel(siteActivity = {}) {
    const {
      _id,
      siteId,
      title,
      creatorId,
      creatorName,
      notes,
      createdDate,
      oldStatus,
      newStatus,
      type
    } = siteActivity;


    return {
      id: _id,
      siteId,
      title,
      creatorId,
      creator: creatorName,
      notes,
      createdDate,
      oldStatus,
      newStatus,
      type
    };
  }

  async _mapModels(data = []) {
    return data.map((item) => {
      const {
        _id,
        siteId,
        title,
        creatorId,
        creatorName,
        notes,
        createdDate,
        oldStatus,
        newStatus,
        type
      } = item;

      return {
        id: _id,
        siteId,
        title,
        creatorId,
        creator: creatorName,
        notes,
        createdDate,
        oldStatus,
        newStatus,
        type
      };
    });
  }

  async updateSiteStatus(site, oldStatus, newStatus) {
    if (site.status !== oldStatus) {
      throw new Error('status is incorrect');
    }

    const updatedSite = site;
    updatedSite.status = newStatus;
    return this.Site.updateSiteInfo(updatedSite);
  }

  async create(siteActivityRequest) {
    const {
      siteId,
      title,
      notes,
      oldStatus,
      newStatus,
      type,
      username
    } = siteActivityRequest;

    const user = await this._getUser(username);

    return this.Site
    .getById(siteId)
    .then((site) => {

      if (!site) {
        throw new Error('No site found');
      }

      const siteActivity = new SiteActivityDB({
        siteId,
        title,
        creatorName: user.fullName,
        creatorId: user.id,
        notes,
        oldStatus,
        newStatus,
        type
      });

      if (type === ActivityType.StatusChanged) {
        return this.updateSiteStatus(site, oldStatus, newStatus)
        .then(() => siteActivity.save())
        .then(data => this._mapModel(data));
      }

      return siteActivity.save()
      .then(data => this._mapModel(data));
    })
    .catch((err) => { throw new Error(err); });
  }

  async list(siteId) {
    const query = { deleted: false, siteId };

    return SiteActivityDB.find(query)
    .then(data => this._mapModels(data))
    .catch((err) => { throw new Error(err); });
  }

  async getById(activityId) {
    return SiteActivityDB.findOne({ _id: activityId, deleted: false })
    .then(data => this._mapModel(data))
    .catch((err) => { throw new Error(err); });
  }

  async _getUser(username) {
    return User.findOne({ username });
  }
}

module.exports = SiteActivity;
