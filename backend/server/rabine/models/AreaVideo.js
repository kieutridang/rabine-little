import AreaVideoDB from '~/schemas/AreaVideo';

import { AWSRabineUpliftDest } from '~/config';

class AreaVideo {
  constructor(opts) {
    Object.assign(this, opts);
  }

  _mapModels(areaVideoItems = []) {
    const self = this;
    return areaVideoItems.map(areaVideoItem => self._mapModel(areaVideoItem));
  }

  _mapModel(areaVideoItem) {
    const {
      _id,
      title,
      url,
      isUplift,
      defected,
      createdDate
    } = areaVideoItem;

    return {
      id: _id,
      title,
      isUplift,
      url,
      defected,
      createdDate
    };
  }

  async getSiteVideos(rabineS3Folder) {
    const folders = await this.s3Folder.list(`${rabineS3Folder}/Videos`, AWSRabineUpliftDest);

    return Promise.all(folders.map(async ({ name: areaName }) => {
      const total = await this.getAreaVideosCountOf(rabineS3Folder, areaName);
      return ({
        id: areaName,
        areaName,
        videosCount: total,
        type: 'Video',
        title: areaName,
        total
      });
    }));
  }

  async getAreaVideosOf(siteS3Folder, areaName, page, pageSize) {
    const urlPath = `^${siteS3Folder}/Videos/${areaName}`;
    const query = {};

    if (urlPath && typeof urlPath === 'string') {
      query.url = { $regex: urlPath };
    }
    const pipe1 = { $match: query };
    const pipe2 = {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
        videos: { $push: '$$ROOT' }
      }
    };
    const pipe3 = {
      $project: {
        totalCount: 1,
        videos: { $slice: ['$videos', (page - 1) * pageSize, pageSize] }
      }
    };
    const aggregationQuery = [pipe1, pipe2];
    if (page && pageSize) {
      aggregationQuery.push(pipe3);
    }
    return AreaVideoDB.aggregate(aggregationQuery).then((areas) => {
      if (areas.length > 0) {
        const areasInfo = areas[0];
        areasInfo.videos = this._mapModels(areasInfo.videos);
        return areasInfo;
      }
      return {};
    })
    .catch((error) => {
      throw new Error(error);
    });
  }

  async getAreaVideosCountOf(siteS3Folder, areaFolderName) {
    const urlPath = areaFolderName ? `^${siteS3Folder}/Videos/${areaFolderName}` : `^${siteS3Folder}/Videos/`;
    const query = {};

    if (urlPath && typeof urlPath === 'string') {
      query.url = { $regex: urlPath };
    }

    return AreaVideoDB.count(query);
  }

  async removeAreaVideo(url) {
    return AreaVideoDB.remove({ url });
  }

  async syncAreaVideo(areaVideoItem) {
    const {
      title,
      url,
      isUplift
    } = areaVideoItem;


    return AreaVideoDB.findOneAndUpdate(
      { url },
      {
        title,
        isUplift,
        url
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

module.exports = AreaVideo;
