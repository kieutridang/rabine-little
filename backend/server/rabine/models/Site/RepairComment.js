import SiteRepairCommentDB from '~/schemas/SiteRepairComment';
import User from '~/schemas/User';

class SiteRepairComment {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async _mapModel(siteRepairComment) {
    if (!siteRepairComment) {
      throw new Error('no such that comment');
    }

    const {
      _id,
      repairInstanceId,
      userId,
      authorName,
      comment,
      createdDate
    } = siteRepairComment;

    let user = null;
    if (userId) {
      user = await this._getUser(userId);
    }

    return {
      id: _id,
      repairInstanceId,
      userId,
      authorName: authorName || (user && user.fullName),
      comment,
      createdDate
    };
  }

  async _mapModels(data = []) {
    return Promise.all(data.map(async (item) => {
      const {
        _id,
        repairInstanceId,
        userId,
        authorName,
        comment,
        createdDate
      } = item;

      let user = null;
      if (userId) {
        user = await this._getUser(userId);
      }

      return {
        id: _id,
        repairInstanceId,
        userId,
        authorName: authorName || (user && user.fullName),
        comment,
        createdDate
      };
    }));
  }

  async _getUser(userId) {
    return User.findOne({ _id: userId });
  }

  async create(repairComment) {
    const {
      repairInstanceId,
      userId,
      authorName,
      comment
    } = repairComment;

    const siteRepairComment = new SiteRepairCommentDB({
      repairInstanceId,
      authorName: authorName,
      userId,
      comment
    });

    return siteRepairComment.save()
      .then(data => this._mapModel(data));
  }

  async get(repairInstanceId, commentId) {
    const query = { deleted: false, repairInstanceId, _id: commentId };

    return SiteRepairCommentDB.findOne(query)
      .then(commentDB => this._mapModel(commentDB));
  }

  async remove(repairInstanceId, commentId) {
    const query = { deleted: false, repairInstanceId, _id: commentId };

    return SiteRepairCommentDB.findOneAndUpdate(query, { deleted: true })
      .then(commentDB => this._mapModel(commentDB));
  }

  async list(repairInstanceId) {
    const query = { deleted: false, repairInstanceId };

    return SiteRepairCommentDB.find(query)
      .then(data => this._mapModels(data));
  }
}

module.exports = SiteRepairComment;
