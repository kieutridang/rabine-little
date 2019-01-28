import AWS from 'aws-sdk';
import mongoose from 'mongoose';
import isEmpty from 'lodash/isEmpty';

import UserDB from '~/schemas/User';
import SiteMapDB from '~/schemas/SiteMap';
import SiteMapChangeDB from '~/schemas/SiteMapChange';
import SiteMapFeatureDB from '~/schemas/SiteMapFeature';
import SiteMapLayerStatusDB from '~/schemas/SiteMapLayerStatus';

import {
  AWSAccessKeyId,
  AWSSecretAccessKey,
  AWSRegion,
  AWSAPIVersion,
  AWSBucket
} from '~/constants';

import { findChangedFields } from './utils';

AWS.config.update({
  accessKeyId: AWSAccessKeyId,
  secretAccessKey: AWSSecretAccessKey,
  region: AWSRegion
});

const s3 = new AWS.S3({
  apiVersion: AWSAPIVersion
});

class SiteMap {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async _mapModel(siteMap = {}) {
    const { _id, siteId, layers = [], features = [] } = siteMap;

    return {
      _id,
      siteId,
      layers: layers.filter(l => !!l),
      features: features.filter(f => !!f)
    };
  }

  async _mapModels(data = []) {
    return data.map(this._mapModel);
  }

  async getChanges({ siteId, limit = 10, after }) {
    const where = {
      siteId,
      type: {
        $nin: ['CREATE_FEATURE', 'CUT_FEATURE']
      }
    };
    const sort = {
      createdAt: -1
    };

    const total = await SiteMapChangeDB.find(where).count();

    if (after) {
      const doc = await SiteMapChangeDB.findOne({ _id: after }, { createdAt: 1 });
      where.createdAt = { $lt: doc.createdAt };
    }

    const changes = await SiteMapChangeDB.find(where)
    .sort(sort)
    .limit(Number(limit))
    .then((list) => {
      const withUsers = list.map(async (item) => {
        const doc = item._doc;
        const user = await UserDB.findOne({ _id: item.userId }, { username: 1, fullName: 1 });

        const feature = {
          ...((doc.feature && doc.feature._doc) || {})
        };
        const layer = {
          ...((doc.layer && doc.layer._doc) || {})
        };

        if (feature) {
          if (feature.zoneId) {
            const zone = await this.getFeature(feature.zoneId);
            feature.zoneTitle = zone && zone.title ? zone.title : '';
          }
          if (feature.layerId) {
            const existingLayer = await this.MapLayer.getById(feature.layerId);
            feature.layerName = existingLayer && existingLayer.name ? existingLayer.name : '';
          }
        }

        const changedFields = {
          old: {
            ...((doc.changedFields && doc.changedFields.old._doc) || {})
          },
          new: {
            ...((doc.changedFields && doc.changedFields.new._doc) || {})
          }
        };

        if (changedFields.old.layerId) {
          const id = mongoose.Types.ObjectId(changedFields.old.layerId);
          const existingLayer = await this.MapLayer.getById(id);
          changedFields.old.layerName = existingLayer && existingLayer.name ? existingLayer.name : '';
        }

        if (changedFields.new.layerId) {
          const id = mongoose.Types.ObjectId(changedFields.new.layerId);
          const existingLayer = await this.MapLayer.getById(id);
          changedFields.new.layerName = existingLayer && existingLayer.name ? existingLayer.name : '';
        }

        const payload = {
          ...doc,
          layer,
          feature,
          user,
          changedFields
        };

        return payload;
      });
      return withUsers;
    });

    return {
      total,
      changes: await Promise.all(changes)
    };
  }

  async getFeaturesOfSite(siteId) {
    const query = { siteId };
    const features = await SiteMapFeatureDB.find(query);
    return features;
  }

  async getLayers({ siteId, userId, featureType }) {
    const list = await this.MapLayer.list(siteId, featureType);
    const layers = await Promise.all(list.map(async (layer) => {
      const query = { layerId: layer._id };

      if (userId) {
        query.userId = userId;
      }

      const status = await SiteMapLayerStatusDB.findOne(query);
      return {
        ...layer,
        isActive: !!(status && status.isActive)
      };
    }));

    return layers;
  }

  async getAreas(siteId) {
    const areas = await this.Area.list(siteId);
    return areas;
  }

  async getSiteFeatures(siteId) {
    const features = await this.getFeaturesOfSite(siteId);
    const layers = await this.MapLayer.list(siteId);

    return this._mapModel({ siteId, features, layers });
  }

  async _getSiteAreas(site) {
    const areasMedia = await this.Area.list(site.siteId);

    const newSite = {
      ...site,
      areas: areasMedia.photoAreas,
      videoAreas: areasMedia.videoAreas
    };

    return newSite;
  }

  async getById(siteId) {
    const features = await this.getFeaturesOfSite(siteId);
    const layers = await this.MapLayer.list(siteId);

    return this._mapModel({ siteId, features, layers })
      .then(site => this._getSiteAreas(site))
      .then(site => this._getSiteOrthoTemplate(site))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async _getSiteOrthoTemplate(site) {
    const { siteId } = site;

    const orthoTemplate = await this.getOrthoTemplate(siteId);
    const { template, location } = orthoTemplate;
    const newSite = {
      ...site,
      template,
      location
    };

    return newSite;
  }

  async updateById({ siteId, layers = [], features = [] }) {
    return SiteMapDB.findOne({ siteId })
      .then((data) => {
        if (!data) {
          return this._create(siteId, layers, features);
        }
        data.features = [...features]; // eslint-disable-line
        data.layers = layers; // eslint-disable-line
        return data.save();
      })
      .then(this._mapModel)
      .catch((err) => {
        throw new Error(err);
      });
  }

  async createLayer({ siteId, userId, layer = {} }) {
    try {
      const createdLayer = await this.MapLayer.create({
        siteId,
        ...layer,
        _id: mongoose.Types.ObjectId(layer._id)
      });

      const type = layer.type === 'RESTORE_LAYER' ? 'RESTORE_LAYER' : 'CREATE_LAYER';

      const change = new SiteMapChangeDB({
        userId,
        siteId,
        type,
        layer: createdLayer
      });

      return change.save();
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateLayersOrder({ siteId, userId, order = {} }) {
    if (isEmpty(order)) {
      return false;
    }

    const layers = await this.MapLayer.listRaw(siteId);
    const reordered = layers.map((layer) => {
      const newIndex = order[layer._id];
      if (newIndex === 'undefined') {
        return null;
      }

      layer.index = newIndex; // eslint-disable-line
      return layer.save();
    }).filter(l => !!l);

    return Promise.all(reordered).then(() => {
      const change = new SiteMapChangeDB({
        userId,
        siteId,
        title: `Reordered ${reordered.length} layers`,
        type: 'REORDER_LAYERS'
      });

      return change.save();
    });
  }
  async updateLayerById({ layerId, userId, layer = {} }) {
    try {
      const existingLayer = await this.MapLayer.getById(layerId);

      if (!existingLayer) {
        throw new Error('not-found');
      }

      const updated = await this.MapLayer.updateRaw(layerId, { name: layer.name });
      if (!updated.ok || !userId) {
        return false;
      }

      const changedFields = findChangedFields(existingLayer, layer);

      if (!isEmpty(changedFields.new)) {
        const change = new SiteMapChangeDB({
          userId,
          siteId: existingLayer.siteId,
          type: 'UPDATE_LAYER',
          layer: {
            ...existingLayer,
            name: layer.name
          },
          changedFields
        });

        return change.save()
          .then(doc => !!doc);
      }

      return updated.ok;
    } catch (err) {
      throw new Error(err);
    }
  }

  async toggleLayerStatus({ layerId, userId, isActive }) {
    return SiteMapLayerStatusDB.findOne({ layerId, userId })
      .then(async (obj) => {
        if (!obj) {
          const newStatus = new SiteMapLayerStatusDB({ layerId, userId, isActive });
          return newStatus.save();
        }

        const updated = await SiteMapLayerStatusDB.update({ layerId, userId }, {
          $set: { isActive: !isActive }
        });

        return !!updated.ok;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async deleteLayerById({ layerId, userId }) {
    try {
      const obj = await this.MapLayer.getById(layerId);

      if (!obj) {
        throw new Error('not-found');
      }

      const deleted = await this.MapLayer.removeById(layerId);
      if (!deleted.ok) {
        return false;
      }

      const change = new SiteMapChangeDB({
        userId,
        siteId: obj.siteId,
        type: 'DELETE_LAYER',
        layer: obj
      });

      await change.save();
      const query = this.getQuery({
        layerId,
        siteId: obj.siteId
      });

      const isDeleted = await SiteMapFeatureDB.updateMany(query, {
        $set: {
          layerId: null
        }
      });

      return isDeleted;
    } catch (err) {
      throw new Error(err);
    }
  }

  async createFeature({ siteId, userId, feature = {} }) {
    const _id = mongoose.Types.ObjectId(feature._id);

    const newFeature = new SiteMapFeatureDB({
      _id,
      siteId,
      featureType: 'PAVEMENT',
      ...feature
    });

    const type = feature.type === 'RESTORE_FEATURE' ? 'RESTORE_FEATURE' : 'CREATE_FEATURE';

    return newFeature.save()
      .then(async (featureDB) => {
        const change = new SiteMapChangeDB({
          userId,
          siteId,
          type,
          feature: featureDB._doc
        });

        await this.updateZoneOfAreaPhoto(featureDB._id);
        return change.save();
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async updateFeaturesOrder({ siteId, userId, layerId, order = {} }) {
    if (isEmpty(order)) {
      return false;
    }

    const query = { siteId, layerId };
    const features = await this.getFeaturesByQuery(query);

    const reordered = features.map((feature) => {
      const newIndex = order[feature._id];
      if (newIndex === 'undefined') {
        return null;
      }

      feature.index = newIndex; // eslint-disable-line
      feature.layerId = layerId; // eslint-disable-line
      return feature.save();
    }).filter(l => !!l);

    return Promise.all(reordered)
      .then(() => {
        const change = new SiteMapChangeDB({
          userId,
          siteId,
          title: `Reordered ${reordered.length} features`,
          type: 'REORDER_FEATURES'
        });

        return change.save();
      });
  }

  async updateFeatureById({ featureId, userId, feature = {} }) {
    return this.getFeature(featureId)
      .then(async (obj) => {
        if (!obj) {
          throw new Error('not-found');
        }

        const changedFields = findChangedFields(obj._doc, feature);

        const payload = {
          ...feature,
          layerId: feature.layerId || null
        };

        delete payload.createdAt;
        delete payload.updatedAt;

        const updatedQuery = this.getFeatureQuery(obj._id);

        const updated = await SiteMapFeatureDB.update(updatedQuery, {
          $set: { ...payload }
        });

        if (!updated.ok) {
          return false;
        }

        const wasUpdated = Date.parse(obj._doc.createdAt) !== Date.parse(obj._doc.updatedAt);

        const isFirstEdit = !wasUpdated;

        const change = new SiteMapChangeDB({
          isFirstEdit,
          userId,
          siteId: obj.siteId,
          type: 'UPDATE_FEATURE',
          feature: {
            ...obj._doc,
            ...payload
          },
          changedFields
        });
        await this.updateZoneOfAreaPhoto(featureId);
        return change.save();
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async updateZoneOfAreaPhoto(featureId, type) {
    const feature = await this.getFeature(featureId);
    const { siteId } = feature;
    const site = await this.Site.getById(siteId);
    const { rabineS3Folder } = site;
    const areas = await this.Area.listBySite(site);
    let features = [];

    if (type === 'DELETE') {
      features = await this.getFeaturesOfSiteExcept(featureId, siteId);
    } else {
      features = await this.getFeaturesOfSite(siteId);
    }

    areas.map((area) => {
      return this.Area.updateZoneOfAreaPhotos(area, features, rabineS3Folder);
    });
  }

  getFeaturesOfSiteExcept(featureId, siteId) {
    const query = { siteId, _id: { $ne: featureId } };
    query.$or = [{ featureType: { $exists: false } }, { featureType: 'PAVEMENT' }];

    return SiteMapFeatureDB.find(query);
  }

  getQuery(getQuery) {
    const query = getQuery;
    query.$or = [{ featureType: { $exists: false } }, { featureType: 'PAVEMENT' }];

    return query;
  }

  getFeatureQuery(featureId) {
    const query = { _id: featureId };

    return this.getQuery(query);
  }

  getFeaturesByQuery(query) {
    const featuresQuery = this.getQuery(query);

    return SiteMapFeatureDB.find(featuresQuery);
  }

  getFeature(featureId) {
    const query = this.getFeatureQuery(featureId);

    return SiteMapFeatureDB.findOne(query);
  }

  removeFeature(featureId) {
    const query = this.getFeatureQuery(featureId);

    return SiteMapFeatureDB.remove(query);
  }

  async deleteFeatureById({ featureId, userId, type }) {
    return this.updateZoneOfAreaPhoto(featureId, 'DELETE')
      .then(() => this.getFeature(featureId))
      .then(async (obj) => {
        if (!obj) {
          throw new Error('not-found');
        }

        const deleted = await this.removeFeature(featureId);
        if (!deleted.ok) {
          return false;
        }

        const validType = type && type === 'CUT_FEATURE' ? 'CUT_FEATURE' : 'DELETE_FEATURE';

        const change = new SiteMapChangeDB({
          userId,
          siteId: obj._doc.siteId,
          type: validType,
          feature: obj._doc
        });

        return change.save();
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getOrthoTemplate(siteId) {
    return this.Site.getById(siteId)
      .then((site) => {
        const { dronePlanId } = site;
        if (dronePlanId) {
          return this.planDeploy.getOrthoTemplateByPlan(dronePlanId);
        }

        return { location: site.addressLocation };
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  async listOrthoPhoto(siteId) {
    return this.Site.getById(siteId)
      .then((site) => {
        const { dronePlanId } = site;
        return this.planDeploy.getOrthoPhotosByPlan(dronePlanId);
      })
      .then((photos) => {
        const allPhotos = photos.map((photo) => {
          const { planId, title } = photo;
          const params = { Bucket: AWSBucket, Key: `${planId}/${title}`, Expires: 600 };
          return new Promise((resolve) => {
            s3.getSignedUrl('getObject', params, (err, url) => {
              if (url) {
                const newPhoto = {
                  ...photo,
                  url
                };
                resolve(newPhoto);
              }
              return resolve(photo);
            });
          });
        });
        return Promise.all(allPhotos);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
}

module.exports = SiteMap;
