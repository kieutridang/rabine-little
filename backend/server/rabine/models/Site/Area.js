import mongoose from 'mongoose';

import AWS from 'aws-sdk';

import * as inside from 'point-in-polygon';

import SiteAreaDB from '~/schemas/SiteArea';
import AreaPhotoDB from '~/schemas/AreaPhoto';
import AreaVideoDB from '~/schemas/AreaVideo';
import RepairDB from '~/schemas/Repair';
import FeatureDB from '~/schemas/SiteMapFeature';

import {
  AWSAccessKeyId,
  AWSSecretAccessKey,
  AWSRegion,
  AWSAPIVersion,
  AWSBucket,
  AWSRabineUpliftDest,
  imageLambdaUrl,
  PhotoParams
} from '~/constants';

import { getUrlParams } from 'utils/common';

AWS.config.update({
  accessKeyId: AWSAccessKeyId,
  secretAccessKey: AWSSecretAccessKey,
  region: AWSRegion
});

const s3 = new AWS.S3({
  apiVersion: AWSAPIVersion
});

class SiteArea {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async _getThumbnailUrl(photo, siteId, areaId) {
    const { isUplift = false, url } = photo;
    const filePath = isUplift ? url : `${siteId}/${areaId}/thumbnail/${photo.title}`;

    const bucket = isUplift ? AWSRabineUpliftDest : AWSBucket;
    const signedUrl = await this._getSignedPhotoUrl(filePath, bucket);
    return signedUrl;
  }

  async _getOriginalUrl(photo, siteId, areaId) {
    const { isUplift = false, url } = photo;
    const filePath = isUplift ? url : `${siteId}/${areaId}/${photo.title}`;

    const bucket = isUplift ? AWSRabineUpliftDest : AWSBucket;
    const signedUrl = await this._getSignedPhotoUrl(filePath, bucket);
    return signedUrl;
  }

  async _getOptimizedPhotoUrl(photo, siteId, areaId, opts = {}) {
    const { isUplift = false, url } = photo;
    const filePath = isUplift ? url : `${siteId}/${areaId}/${photo.title}`;

    const bucket = isUplift ? AWSRabineUpliftDest : AWSBucket;
    const signedUrl = await this._getSignedPhotoUrl(filePath, bucket);

    const params = {
      ...getUrlParams(signedUrl),
      q: opts.quality || PhotoParams.quality,
      isUplift
    };

    if (opts.width) {
      params.w = opts.width;
    }

    if (opts.height) {
      params.h = opts.height;
    }

    const queryParams = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    const finalUrl = `${imageLambdaUrl}?f=${filePath}&${queryParams}`;
    return finalUrl;
  }

  _getSignedPhotoUrl(filePath, bucket) {
    const params = {
      Bucket: bucket || AWSBucket,
      Key: filePath,
      Expires: 600
    };
    return new Promise((resolve) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        return resolve(url);
      });
    });
  }

  async _getOriginalVideoUrl(video) {
    const { isUplift = false, url } = video;
    const bucket = isUplift ? AWSRabineUpliftDest : AWSBucket;
    const signedUrl = await this._getSignedFileUrl(url, bucket);
    return signedUrl;
  }

  async _getSignedFileUrl(filePath, bucket) {
    const params = {
      Bucket: bucket || AWSBucket,
      Key: filePath,
      Expires: 3000
    };
    return new Promise((resolve) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        return resolve(url);
      });
    });
  }

  async _mapPhotosModel(data, siteId, areaId) {
    if (!data) {
      return [];
    }

    const sortedData = data.sort((a, b) => new Date(a.taken) - new Date(b.taken));

    return Promise.all(sortedData.map(async (photo = {}) => {
      const {
        _id: id,
        defected,
        repairId,
        severity,
        croppedUrl,
        isCropUploaded,
        repair,
        repairName,
        deleted,
        taken,
        createdDate,
        droneMake,
        droneModel,
        title,
        location,
        zoneId,
        siteId: photoSiteId,
        areaId: photoAreaId
      } = photo;

      const finalSiteId = photoSiteId || siteId;
      const finalAreaId = photoAreaId || areaId;

      const signedOptimizedUrl = await this._getOptimizedPhotoUrl(photo, finalSiteId, finalAreaId);
      const signedThumbnailUrl = await this._getOptimizedPhotoUrl(photo, finalSiteId, finalAreaId, {
        width: 1024,
        height: 1024
      });
      const signedOriginalUrl = await this._getOriginalUrl(photo, finalSiteId, finalAreaId);
      const query = { _id: zoneId };
      query.$or = [{ featureType: { $exists: false } }, { featureType: 'PAVEMENT' }];

      const zone = await FeatureDB.findOne(query);

      return {
        id,
        defected,
        repairId,
        severity,
        croppedUrl,
        isCropUploaded,
        repair,
        repairName,
        deleted,
        taken,
        createdDate,
        droneMake,
        droneModel,
        title,
        location,
        zone: zone ? zone.title : 'No Zone',
        url: signedOptimizedUrl,
        originalUrl: signedOriginalUrl,
        thumbnailUrl: signedThumbnailUrl
      };
    }));
  }

  async _mapModelVideo(videoDB) {
    const {
      title,
      url,
      isUplift,
      defected,
      createdDate
    } = videoDB;


    return {
      title,
      url,
      isUplift,
      defected,
      createdDate
    };
  }

  async _getPhotosForSiteArea(siteArea = {}, s3FolderName = null, page = null, pageSize = null) {
    if (!siteArea) { throw new Error('not found'); }

    const {
      _id,
      siteId,
      title,
      createdDate,
      photos = [],
      totalCount
    } = siteArea;
    let totalCountItem = totalCount;

    // should be careful in this one, if it has the s3Folder, so should we care its photos?
    let finalPhotos = [...photos];
    if (s3FolderName) {
      const rabinePhotos = await this.areaPhoto.getAreaPhotosOf(s3FolderName, title, page, pageSize); // eslint-disable-line
      if (rabinePhotos && rabinePhotos.photos && rabinePhotos.photos.length > 0) {
        finalPhotos = photos ? rabinePhotos.photos.concat(photos) : rabinePhotos.photos;
        totalCountItem = rabinePhotos.count;
      }
    }

    const mappedPhotos = await this._mapPhotosModel(finalPhotos, siteId, _id);
    return {
      id: _id,
      siteId,
      title,
      photos: mappedPhotos,
      imagesCount: totalCountItem || mappedPhotos.length,
      createdDate
    };
  }

  _mapModels(data = [], rabineS3Folder = null) {
    return Promise.all(data.map(async (item) => {
      const { _id, siteId, title, createdDate, imagesCount } = item;

      let total = imagesCount;

      if (rabineS3Folder) {
        total += await this.areaPhoto.getAreaPhotosCountOf(rabineS3Folder, title);
      }

      return {
        id: _id,
        siteId,
        title,
        createdDate,
        imagesCount: total,
        total,
        areaName: title,
        type: 'Photo'
      };
    }));
  }

  async create(siteAreaRequest) {
    const { siteId, title } = siteAreaRequest;
    const siteArea = new SiteAreaDB({ siteId, title });

    return siteArea.save()
      .then(data => this._getPhotosForSiteArea(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async addAreaPhoto(areaPhotoRequest) {
    const { siteId, areaId } = areaPhotoRequest;
    const photo = { ...areaPhotoRequest };

    SiteAreaDB.findOneAndUpdate(
      { _id: areaId, siteId, deleted: false },
      { $push: { photos: photo } }
    )
      .then(data => this._getPhotosForSiteArea(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async addAreaVideo(areaVideoRequest) {
    const { title, url } = areaVideoRequest;
    const video = { title, url };

    const areaVideo = new AreaVideoDB(video);
    return areaVideo.save()
      .then(data => this._mapModelVideo(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getAreaVideo(getVideoRequest) {
    const { siteId, areaName, page, pageSize } = getVideoRequest;

    const site = await this.Site.getById(siteId);
    const { rabineS3Folder } = site;

    return this.areaVideo.getAreaVideosOf(rabineS3Folder, areaName, page, pageSize)
      .then((result) => {
        if (result && result.videos && result.videos.length > 0) {
          const handleNewVideos = Promise.all(result.videos.map(async (video) => {
            const fullUrl = await this._getOriginalVideoUrl(video);
            return ({
              ...video,
              fullUrl
            });
          }));
          return handleNewVideos.then((videos) => {
            return ({
              ...result,
              videos
            });
          });
        }
        return {};
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async updateAreaPhoto(doc, payload = {}) {
    const { siteId, areaId, photoId } = doc;

    return SiteAreaDB.findOne({ _id: areaId, siteId, deleted: false })
      .then((area) => {
        area.photos = area.photos.map((item) => { // eslint-disable-line
          if (photoId !== item.id) return item; // eslint-disable-line
          return {
            ...item,
            payload
          };
        });
        return area.save();
      })
      .then(data => this._getPhotosForSiteArea(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async toggleAreaPhotoDefected(doc) {
    const { siteId, areaId, photoId, defected } = doc;
    let result = null;

    if (areaId !== 'repair' && areaId !== 'defected') {
      result = await SiteAreaDB.findOneAndUpdate(
        {
          _id: areaId,
          siteId,
          'photos._id': photoId,
          deleted: false
        },
        {
          $set: { 'photos.$.defected': defected }
        }
      );

      const areaPhoto = await AreaPhotoDB.findOne({ _id: photoId });

      if (areaPhoto) {
        result = await AreaPhotoDB.findOneAndUpdate(
          { _id: photoId },
          {
            $set: { defected: defected }
          }
        );
      }

      return result;
    }

    const siteAreaPhoto = await SiteAreaDB.findOne({ 'photos._id': photoId });

    if (siteAreaPhoto) {
      result = await SiteAreaDB.findOneAndUpdate(
        { 'photos._id': photoId },
        {
          $set: { 'photos.$.defected': defected }
        }
      );
    }

    const areaPhoto = await AreaPhotoDB.findOne({ _id: photoId });

    if (areaPhoto) {
      result = await AreaPhotoDB.findOneAndUpdate(
        { _id: photoId },
        {
          $set: { defected: defected }
        }
      );
    }

    return result;
  }

  async setAreaPhotoDefectedType(doc) {
    const { siteId, areaId, photoId, repairId } = doc;

    const foundRepair = mongoose.Types.ObjectId.isValid(repairId)
      ? (await RepairDB.findOne({ _id: repairId }))
      : null;

    const finalRepairId = foundRepair ? repairId : null;

    let result = null;

    if (mongoose.Types.ObjectId.isValid(areaId) && areaId !== 'repair') {
      const foundArea = await SiteAreaDB.findOne({
        _id: areaId,
        siteId,
        'photos._id': photoId,
        deleted: false
      });

      if (foundArea) {
        const modify = {
          $set: {
            'photos.$.repairId': finalRepairId,
            'photos.$.defected': true
          }
        };

        result = await SiteAreaDB.update(
          { 'photos._id': photoId },
          modify
        );
      }

      const areaPhoto = await AreaPhotoDB.findOne({ _id: photoId });

      if (areaPhoto) {
        return AreaPhotoDB.findOneAndUpdate(
          { _id: photoId },
          {
            $set: {
              repairId: finalRepairId,
              defected: true
            }
          }
        );
      }

      return result;
    }

    const siteAreaPhoto = await SiteAreaDB.findOne({ 'photos._id': photoId });

    if (siteAreaPhoto) {
      result = await SiteAreaDB.findOneAndUpdate(
        { 'photos._id': photoId },
        {
          $set: {
            'photos.$.repairId': finalRepairId,
            'photos.$.defected': true
          }
        }
      );
    }

    const areaPhoto = await AreaPhotoDB.findOne({ _id: photoId });

    if (areaPhoto) {
      result = await AreaPhotoDB.findOneAndUpdate(
        { _id: photoId },
        {
          $set: {
            repairId: finalRepairId,
            defected: true
          }
        }
      );
    }

    return result;
  }

  mapPhotosWithZone(photos, features, isAreaPhoto = false) {
    return photos.map((photo) => {

      if (!photo.location) {
        return photo;
      }

      const location = [photo.location.lng, photo.location.lat];
      const newFeature = features.find((feature) => {

        if (feature.geojson &&
          feature.geojson.geometry &&
          feature.geojson.geometry.coordinates &&
          feature.geojson.geometry.coordinates.length > 0
        ) {
          const listCoordinates = feature.geojson.geometry.coordinates;
          const checkInsidePolygonReducer = (isInsidePolygon, featureCoordinate, index) => {

            if (index === 0) {
              return isInsidePolygon && inside.default(location, featureCoordinate);
            }

            return isInsidePolygon && !inside.default(location, featureCoordinate);
          };
          return listCoordinates.reduce(checkInsidePolygonReducer, true);
        }

        return false;
      });

      const newZoneId = newFeature ? newFeature.id : photo.zoneId;
      const isUpdated = photo.zoneId !== newZoneId;

      if (isUpdated) {
        const updatedPhoto = {
          ...photo,
          zoneId: newZoneId
        };

        if (isAreaPhoto) {
          updatedPhoto.isUpdated = isUpdated;
        }

        return updatedPhoto;
      }

      return photo;
    });
  }

  async updateZoneOfAreaPhotos(siteArea, newFeatures, s3FolderName) {
    const foundArea = await SiteAreaDB.findOne({ _id: siteArea.id });

    if (foundArea && foundArea.photos && foundArea.photos.length > 0) {
      const photos = this.mapPhotosWithZone(foundArea.photos, newFeatures);

      await SiteAreaDB.update(
        { _id: siteArea.id, deleted: false },
        { $set: { photos } },
        { runValidators: true }
      );
    } else {
      const { title } = siteArea;

      const areaPhotos = await this.areaPhoto.getAreaPhotosOf(s3FolderName, title);
      if (areaPhotos && areaPhotos.photos && areaPhotos.photos.length > 0) {
        const photos = this.mapPhotosWithZone(areaPhotos.photos, newFeatures, true);
        const updatedPhotos = photos.filter(p => p.isUpdated);
        await this.areaPhoto.updateZonePhotos(updatedPhotos);
      }
    }
  }

  async setAreaPhotoDefectedSeverity(doc) {
    const { siteId, areaId, photoId, severity } = doc;

    let result = null;
    if (mongoose.Types.ObjectId.isValid(areaId)) {
      result = await SiteAreaDB.findOneAndUpdate(
        {
          _id: areaId,
          siteId,
          'photos._id': photoId,
          deleted: false
        },
        {
          $set: {
            'photos.$.severity': severity,
            'photos.$.defected': true
          }
        }
      );

      const areaPhoto = await AreaPhotoDB.findOne({ _id: photoId });

      if (areaPhoto) {
        return AreaPhotoDB.findOneAndUpdate(
          { _id: photoId },
          {
            $set: {
              severity: severity,
              defected: true
            }
          }
        );
      }

      return result;
    }

    result = await SiteAreaDB.findOneAndUpdate(
      {
        siteId,
        'photos._id': photoId,
        deleted: false
      },
      {
        $set: {
          'photos.$.severity': severity,
          'photos.$.defected': true
        }
      }
    );

    const areaPhoto = await AreaPhotoDB.findOneAndUpdate(
      { _id: photoId },
      {
        $set: {
          severity: severity,
          defected: true
        }
      }
    );

    if (areaPhoto) {
      return areaPhoto;
    }

    return result;
  }

  async toggleAreaPhotoRepair(doc) {
    const { siteId, areaId, photoId, repair } = doc;

    let result = null;

    if (mongoose.Types.ObjectId.isValid(areaId)) {
      result = await SiteAreaDB.findOneAndUpdate(
        {
          _id: areaId,
          siteId,
          'photos._id': photoId,
          deleted: false
        },
        {
          $set: {
            'photos.$.repair': repair
          }
        }
      );

      const areaPhoto = await AreaPhotoDB.findOne({ _id: photoId });

      if (areaPhoto) {
        return AreaPhotoDB.findOneAndUpdate(
          { _id: photoId },
          {
            $set: {
              'photos.$.repair': repair
            }
          }
        );
      }

      return result;
    }

    const siteAreaPhoto = await SiteAreaDB.findOne({ 'photos._id': photoId });

    if (siteAreaPhoto) {
      result = await SiteAreaDB.findOneAndUpdate(
        { 'photos._id': photoId },
        {
          $set: {
            'photos.$.repair': repair
          }
        }
      );
    }

    const areaPhoto = await AreaPhotoDB.findOne({ _id: photoId });

    if (areaPhoto) {
      result = await AreaPhotoDB.findOneAndUpdate(
        { _id: photoId },
        {
          $set: {
            $set: { repair: repair }
          }
        }
      );
    }

    return result;
  }

  async setAreaPhotoRepairInstance(params) {
    const { siteId, areaId, photoId, repairInstanceId } = params;

    let result = false;
    if (mongoose.Types.ObjectId.isValid(areaId) && areaId !== 'repair') {
      result = await SiteAreaDB.findOneAndUpdate(
        {
          _id: areaId,
          siteId,
          'photos._id': photoId,
          deleted: false
        },
        {
          $set: {
            'photos.$.repairName': repairInstanceId,
            'photos.$.repair': true
          }
        }
      );

      const areaPhoto = await AreaPhotoDB.findOne({ _id: photoId });

      if (areaPhoto) {
        return AreaPhotoDB.findOneAndUpdate(
          { _id: photoId },
          {
            $set: {
              repairName: repairInstanceId,
              repair: true
            }
          }
        );
      }

      return result;
    }

    result = await SiteAreaDB.findOneAndUpdate(
      {
        'photos._id': photoId,
        deleted: false
      },
      {
        $set: {
          'photos.$.repairName': repairInstanceId,
          'photos.$.repair': true
        }
      }
    );

    const areaPhoto = await AreaPhotoDB.findOneAndUpdate(
      { _id: photoId },
      {
        $set: {
          repairName: repairInstanceId,
          repair: true
        }
      }
    );

    if (!areaPhoto) {
      return result;
    }

    return areaPhoto;
  }

  async getRepairsPhotoOfSite(siteId) {
    const query = { deleted: false, siteId: siteId, 'photos.repair': true, title: { $ne: 'Videos' } };

    return SiteAreaDB.aggregate([
      { $match: query },
      {
        $project: {
          _id: 1,
          photos: {
            $filter: {
              input: '$photos',
              as: 'photo',
              cond: {
                $and: [
                  { $eq: ['$$photo.repair', true] },
                  { $eq: ['$$photo.deleted', false] }
                ]
              }
            }
          }
        }
      }
    ]).then((areas) => {
      if (areas.length > 0) {
        return areas.reduce((currentPhotos, area) => {
          const repairPhotos = area.photos.map(photo => ({ ...photo, siteId, areaId: area._id }));
          currentPhotos.push(...repairPhotos);
          return currentPhotos;
        }, []);
      }
      return [];
    })
    .catch((error) => {
      throw new Error(error);
    });
  }

  async getPaginationRepairsPhotoOfSite(siteId, page, pageSize) {
    const query = { deleted: false, siteId: siteId, 'photos.repair': true, title: { $ne: 'Videos' } };
    const pipe1 = { $match: query };
    const pipe2 = {
      $project: {
        _id: 1,
        photos: {
          $filter: {
            input: '$photos',
            as: 'photo',
            cond: {
              $and: [
                { $eq: ['$$photo.repair', true] },
                { $eq: ['$$photo.deleted', false] }
              ]
            }
          }
        }
      }
    };
    const aggregationQuery = [pipe1, pipe2];
    return SiteAreaDB.aggregate(aggregationQuery).then((areas) => {
      if (areas.length > 0) {
        const result = {};
        const photos = areas.reduce((currentPhotos, area) => {
          const repairPhotos = area.photos.map(photo => ({ ...photo, siteId, areaId: area._id }));
          currentPhotos.push(...repairPhotos);
          return currentPhotos;
        }, []);
        result.totalCount = photos.length;
        result.photos = photos;
        if (page && pageSize) {
          result.photos = photos.slice((page - 1) * pageSize, (pageSize * page) - 1);
        }
        return result;
      }
      return {};
    })
    .catch((error) => {
      throw new Error(error);
    });
  }

  async getDefectedPhotoOfSite(siteId) {
    const query = { deleted: false, siteId: siteId, 'photos.defected': true, title: { $ne: 'Videos' } };

    return SiteAreaDB.aggregate([
      { $match: query },
      {
        $project: {
          _id: 1,
          photos: {
            $filter: {
              input: '$photos',
              as: 'photo',
              cond: {
                $and: [
                  { $eq: ['$$photo.defected', true] },
                  { $eq: ['$$photo.deleted', false] }
                ]
              }
            }
          }
        }
      }
    ]).then((areas) => {
      if (areas.length > 0) {
        return areas.reduce((currentPhotos, area) => {
          const defectedPhotos = area.photos.map(photo => ({ ...photo, siteId, areaId: area._id }));
          currentPhotos.push(...defectedPhotos);
          return currentPhotos;
        }, []);
      }
      return [];
    })
    .catch((error) => {
      throw new Error(error);
    });
  }

  async getPaginationDefectedPhotoOfSite(siteId, page, pageSize) {
    const query = { deleted: false, siteId: siteId, 'photos.defected': true, title: { $ne: 'Videos' } };
    const pipe1 = { $match: query };
    const pipe2 = {
      $project: {
        _id: 1,
        photos: {
          $filter: {
            input: '$photos',
            as: 'photo',
            cond: {
              $and: [
                { $eq: ['$$photo.defected', true] },
                { $eq: ['$$photo.deleted', false] }
              ]
            }
          }
        }
      }
    };
    const aggregationQuery = [pipe1, pipe2];
    return SiteAreaDB.aggregate(aggregationQuery).then((areas) => {
      if (areas.length > 0) {
        const result = {};
        const photos = areas.reduce((currentPhotos, area) => {
          const defectedPhotos = area.photos.map(photo => ({ ...photo, siteId, areaId: area._id }));
          currentPhotos.push(...defectedPhotos);
          return currentPhotos;
        }, []);
        result.totalCount = photos.length;
        result.photos = photos;
        if (page && pageSize) {
          result.photos = photos.slice((page - 1) * pageSize, (pageSize * page) - 1);
        }
        return result;
      }
      return {};
    })
    .catch((error) => {
      throw new Error(error);
    });
  }

  async getTotalRepairsOfSite(siteId) {
    const repairs = await this.getRepairsPhotoOfSite(siteId);
    return repairs.length;
  }

  async getTotalDefectsOfSite(siteId) {
    const defected = await this.getDefectedPhotoOfSite(siteId);
    return defected.length;
  }

  async listBySite(site) {
    const query = { deleted: false, siteId: site._id, title: { $ne: 'Videos' } };
    const { rabineS3Folder } = site;

    const areas = SiteAreaDB.aggregate([
      { $match: query },
      {
        $project: {
          _id: 1,
          siteId: 1,
          title: 1,
          createdDate: 1,
          imagesCount: { $size: '$photos' }
        }
      }
    ]).then(areasDB => this._mapModels(areasDB, rabineS3Folder))
      .catch((err) => {
        throw new Error(err);
      });
    return areas;
  }

  async photoCountBy(site, siteS3Folder, type = 'defected') {
    const query = {};

    query[type] = true;

    if (siteS3Folder && typeof siteS3Folder === 'string') {
      query.url = { $regex: siteS3Folder };
      return AreaPhotoDB.count(query);
    }

    return 0;
  }

  // this one will return both photo's areas, and video's areas
  async list(siteId) {

    const site = await this.Site.getById(siteId);
    const photoAreas = await this.listBySite(site);
    const { rabineS3Folder } = site;
    let videoAreas = [];

    if (rabineS3Folder) {
      videoAreas = await this.areaVideo.getSiteVideos(rabineS3Folder);
    }
    const oldRepairPhotos = await this.getTotalRepairsOfSite(siteId);
    const oldDefectPhotos = await this.getTotalDefectsOfSite(siteId);
    const repairPhotoCount = await this.photoCountBy(site, rabineS3Folder, 'repair');
    const defectedPhotoCount = await this.photoCountBy(site, rabineS3Folder, 'defected');
    if (oldRepairPhotos > 0 || repairPhotoCount > 0) {
      photoAreas.push({
        id: 'repair',
        siteId: siteId,
        title: 'repair',
        imagesCount: repairPhotoCount + oldRepairPhotos,
        total: repairPhotoCount + oldRepairPhotos,
        areaName: 'repair',
        type: 'Photo',
        optional: true
      });
    }

    if (oldDefectPhotos > 0 || defectedPhotoCount > 0) {
      photoAreas.push({
        id: 'defected',
        siteId: siteId,
        title: 'defected',
        imagesCount: defectedPhotoCount + oldDefectPhotos,
        total: defectedPhotoCount + oldDefectPhotos,
        areaName: 'defected',
        type: 'Photo',
        optional: true
      });
    }

    return {
      photoAreas,
      videoAreas
    };
  }

  async getById(siteId, areaId, page, pageSize) {
    const site = await this.Site.getById(siteId);
    const { rabineS3Folder } = site;

    if (areaId === 'repair' || areaId === 'defected') {
      const optionalArea = {
        _id: areaId,
        title: areaId,
        areaName: areaId
      };
      if (areaId === 'repair') {
        const repairedInfo = await this.getPaginationRepairsPhotoOfSite(siteId, page, pageSize);
        optionalArea.photos = repairedInfo.photos;
        optionalArea.totalCount = repairedInfo.totalCount;
      } else if (areaId === 'defected') {
        const defectedPhotoInfo = await this.getPaginationDefectedPhotoOfSite(siteId, page, pageSize); // eslint-disable-line
        optionalArea.photos = defectedPhotoInfo.photos;
        optionalArea.totalCount = defectedPhotoInfo.totalCount;
      }
      return this._getPhotosForSiteArea(optionalArea, rabineS3Folder, page, pageSize);
    }
    const query = { _id: areaId, siteId, deleted: false };
    const pipe1 = { $match: query };
    const pipe2 = {
      $project: {
        _id: 1,
        title: 1,
        photos: 1,
        totalCount: { $size: '$photos' }
      }
    };
    const pipe3 = {
      $project: {
        _id: 1,
        title: 1,
        totalCount: 1,
        photos: {
          $slice: ['$photos', (page - 1) * pageSize, pageSize]
        }
      }
    };
    const aggregationQuery = [pipe1, pipe2];
    if (page && pageSize) {
      aggregationQuery.push(pipe3);
    }
    return SiteAreaDB.aggregate(aggregationQuery).then((areas) => {
      return this._getPhotosForSiteArea(areas[0], rabineS3Folder, page, pageSize);
    })
    .catch((error) => {
      throw new Error(error);
    });

  }

  async getBySiteNameAndTitle(siteId, title) {
    return SiteAreaDB.findOne({ siteId, title });
  }

  async getByRepairName(repairName) {
    return SiteAreaDB.findOne({
      'photos.repairName': repairName
    }, {
      'photos.$': 1
    });
  }

  async addSiteArea(siteId, title) {
    return SiteAreaDB({ siteId, title }).save();
  }
}

module.exports = SiteArea;
