import SiteMapCommentDB from '~/schemas/SiteMapComment';
import User from '~/schemas/User';

class SiteMapComment {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async _mapModel(siteMapComment = {}) {
    const {
      _id,
      siteId,
      userId,
      authorName,
      comment,
      createdDate
    } = siteMapComment;

    let user = null;
    if (userId) {
      user = await this._getUser(userId);
    }

    return {
      id: _id,
      siteId,
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
        siteId,
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
        siteId,
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

  async create(mapCommentRequest) {
    const {
      siteId,
      userId,
      authorName,
      comment
    } = mapCommentRequest;

    return this.Site.getById(siteId)
      .then((site) => {

        if (!site) {
          throw new Error('No site found');
        }

        const siteMapComment = new SiteMapCommentDB({
          siteId,
          authorName: authorName,
          userId,
          comment
        });

        return siteMapComment.save()
          .then(data => this._mapModel(data));
      });
  }

  async get(siteId, commentId) {
    const query = { deleted: false, siteId, _id: commentId };

    return SiteMapCommentDB.findOne(query)
      .then(commentDB => this._mapModel(commentDB));
  }

  async remove(siteId, commentId) {
    const query = { deleted: false, siteId, _id: commentId };

    return SiteMapCommentDB.findOneAndUpdate(query, { deleted: true })
      .then(commentDB => this._mapModel(commentDB));
  }

  async list(siteId) {
    const query = { deleted: false, siteId };

    return SiteMapCommentDB.find(query)
      .then(data => this._mapModels(data));
  }
}

module.exports = SiteMapComment;
