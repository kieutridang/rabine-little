import axios from 'axios';
import get from 'lodash/get';

import DroneDeployRequestDB from '~/schemas/DroneDeployRequest';
import OrthoPhotoDB from '~/schemas/OrthoPhoto';
import PlanDeployDB from '~/schemas/PlanDeploy';

import { droneKey } from '~/constants';
import logger from 'utils/logger';

const APPINFO_DRONE_UPDATED_TIME_KEY = '___DRONE_DEPLOY_CALLING___';
const oneHourSpan = 60 * 60 * 1000;

class PlanDeploy {
  constructor(opts) {
    Object.assign(this, opts);
  }

  _buildListURL(url) {
    return `https://public-api.dronedeploy.com/v2/${url}?api_key=${droneKey}`;
  }

  _buildGetDetailURL(url, planId) {
    return `https://public-api.dronedeploy.com/v2/${url}/${planId}?api_key=${droneKey}`;
  }

  _buildGetTilesTemplateURL(url, planId) {
    return `https://public-api.dronedeploy.com/v2/${url}/${planId}?api_key=${droneKey}`;
  }

  async _mapTilesModel(tiles = {}) {
    if (!tiles || !tiles.templates) {
      return null;
    }
    const { orthomosaic } = tiles.templates;
    return {
      template: orthomosaic,
      location: tiles.location
    };
  }

  async _mapModel(planData = {}) {
    const {
      _id,
      id,
      name,
      location: { lat, lng },
      image_count: imageCount,
      date_creation: createdDate
    } = planData;
    return {
      _id,
      id,
      name,
      location: { lat, lng },
      imageCount,
      createdDate: new Date(createdDate)
    };
  }

  async _mapModels(data = []) {
    return data.map((item) => {
      const {
        _id,
        id,
        name,
        location: { lat, lng },
        image_count: imageCount,
        date_creation: createdDate
      } = item;

      return {
        _id,
        id,
        name,
        location: { lat, lng },
        imageCount,
        createdDate: new Date(createdDate)
      };
    });
  }

  async _mapOrthoModel(item) {
    const {
      _id,
      planId,
      siteId,
      droneDeployExportRequestId,
      droneDeployStatus,
      droneDeployUpdatedDate,
      createdDate,
      deleted
    } = item;

    return {
      id: _id,
      planId,
      siteId,
      droneDeployExportRequestId,
      droneDeployStatus,
      droneDeployUpdatedDate,
      createdDate,
      deleted
    };
  }

  _mapOrthoPhotosModel(data) {
    if (!data) {
      return null;
    }

    return data.map(this._mapOrthoPhotoModel);
  }

  _mapOrthoPhotoModel(item) {
    if (!item) {
      return null;
    }

    const {
      _id, title, planId, url, taken, kmlOrigin, latLngBox, deleted
    } = item;

    return {
      id: _id,
      planId,
      title,
      url,
      taken,
      kmlOrigin,
      latLngBox,
      deleted
    };
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async removeExistingPhotos(planId) {
    OrthoPhotoDB.findAndUpdate({ planId: planId, deleted: false }, { deleted: true });
  }

  async addPhotos(existingPlanId, planPhotos) {
    return this.getById(existingPlanId)
      .then((plan) => {
        if (plan) {
          const photos = [];

          planPhotos.forEach((planPhoto) => {
            const {
              title,
              planId,
              url,
              taken,
              kmlOrigin,
              latLngBox
            } = planPhoto;

            const photo = new OrthoPhotoDB({
              title,
              planId,
              url,
              taken,
              kmlOrigin,
              latLngBox
            });
            photo.save();
            photos.push(this._mapOrthoPhotoModel(photo));
          });

          return photos;
        }

        throw new Error('There is no selected plan');
      });
  }

  async _createRequest(response, payload, siteId) {
    const {
      data: { id }
    } = response;
    const requestItem = {
      planId: payload.plan_id,
      droneDeployExportRequestId: id,
      droneDeployStatus: 'Processing'
    };

    if (siteId) {
      requestItem.siteId = siteId;
    }

    const extractRequest = new DroneDeployRequestDB(requestItem);
    return extractRequest.save();
  }

  async loadNextPaging(response, currentPlans = []) {
    const nextPlans = await this._mapModels(response.data);

    if (nextPlans && nextPlans.length > 0) {
      currentPlans.push(...nextPlans);
    }

    const link = get(response, 'headers.link');
    if (link) {
      const indexLast = link.indexOf('>');
      const nextUrl = link.substring(1, indexLast);
      return axios.get(nextUrl)
        .then(nextResponse => this.loadNextPaging(nextResponse, currentPlans))
        .catch(err => err);
    }

    return currentPlans;
  }

  async list(name, all = false) {
    let shouldGetNew = false;

    const app = await this.appInfo.getById(APPINFO_DRONE_UPDATED_TIME_KEY);

    if (app && app.updatedAt) {
      const lastUpdatedDateWith1Hour = new Date(app.updatedAt);
      lastUpdatedDateWith1Hour.setTime(lastUpdatedDateWith1Hour.getTime() + oneHourSpan);

      const now = new Date();

      if (lastUpdatedDateWith1Hour < now) {
        shouldGetNew = true;
      }
    } else {
      shouldGetNew = true;
    }

    let newPlans = null;

    if (shouldGetNew) {
      const url = this._buildListURL('plans');
      const existingPlans = await this.getAllPlanDeploys();
      const appInfoRequest = { key: APPINFO_DRONE_UPDATED_TIME_KEY };

      newPlans = await axios.get(url)
        .then(response => this.loadNextPaging(response))
        .then(planDeploys => planDeploys)
        .catch((err) => {
          logger.error('There is error when receiving plans', err);
        });

      if (newPlans) {
        await this.syncAllPlanDeploys(newPlans, existingPlans);
        await this.appInfo.createOrUpdate(appInfoRequest);
      }
    }

    let resultPlans = await this.getAllPlanDeploys();
    if (!all) {
      const { site } = this;
      const filter = {};
      const existingSites = await site.list(filter);
      const existingPlanIds = existingSites.map(i => `${i.dronePlanId}`);
      resultPlans = resultPlans.filter(plan => !existingPlanIds.includes(plan.id));
    }

    if (name && resultPlans) {
      resultPlans = resultPlans.filter(i => i.name && i.name.includes(name));
    }

    return resultPlans;
  }

  async getOrthoPhotosByPlan(planId) {
    return OrthoPhotoDB.find({ planId: planId, deleted: false }).then(data =>
      this._mapOrthoPhotosModel(data));
  }

  async getOrthoTemplateByPlan(id) {
    const url = this._buildGetTilesTemplateURL('tiles', id);

    return axios.get(url)
      .then(response => this._mapTilesModel(response.data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getById(id) {
    const url = id && this._buildGetDetailURL('plans', id);

    return url && axios.get(url)
      .then(response => this._mapModel(response.data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  mapPlanDeployModel(planDeployDB) {
    const { id, name, location, imageCount, createdDate, _id } = planDeployDB;

    return {
      _id,
      id,
      name,
      location,
      imageCount,
      createdDate
    };
  }

  async getAllPlanDeploys() {
    const query = { };
    query.$or = [{ deleted: { $exists: false } }, { deleted: false }];

    return PlanDeployDB.find(query)
      .then(plans => plans.map(plan => this.mapPlanDeployModel(plan)))
      .catch(err => err);
  }

  async syncAllPlanDeploys(planDeploys = [], existingPlans = []) {
    logger.info('There is planDeploys', planDeploys.length);
    logger.info('There is existingPlans', existingPlans.length);

    const deletedPlanIds = existingPlans.filter(plan =>
      planDeploys.findIndex(planDeploy => planDeploy.id === plan.id) < 0)
      .map(plan => plan.id);

    logger.info('deletedPlans', deletedPlanIds.length);

    if (deletedPlanIds && deletedPlanIds.length > 0) {
      logger.info('delete', deletedPlanIds);
      PlanDeployDB.deleteMany({ id: { $in: deletedPlanIds } });
    }

    const newPlans = planDeploys.filter(plan =>
      existingPlans.findIndex(planDeploy => planDeploy.id === plan.id) < 0);

    logger.info('newPlans', newPlans.length);

    if (newPlans && newPlans.length > 0) {
      newPlans.forEach((newPlan) => {
        logger.info('newPlan:', newPlan);
        const { id, name, location, imageCount } = newPlan;

        PlanDeployDB.findOneAndUpdate(
          {
            id
          },
          {
            id,
            name,
            location: { lat: location.lat || 0, lng: location.lng || 0 },
            imageCount
          },
          { upsert: true, new: true }
        ).then((plan) => {
          logger.info('there is new plan:', plan);
        })
          .catch((err) => {
            logger.error('error when new plan:', err);
          });
      });
    }

    const updatedPlans = planDeploys.filter(plan =>
      existingPlans.findIndex(planDeploy => planDeploy.id === plan.id) >= 0);

    logger.info('updatedPlans', updatedPlans.length);

    if (updatedPlans && updatedPlans.length > 0) {
      Promise.all(updatedPlans.forEach(async (updatedPlan) => {
        const existingPlan = existingPlans.find(p => p.id === updatedPlan.id);
        const { _id } = existingPlan;
        const { name, location, imageCount } = updatedPlan;
        logger.info('update', _id, name);

        if (existingPlan) {
          await PlanDeployDB.findOneAndUpdate(
            { _id },
            {
              name,
              location: { lat: location.lat || 0, lng: location.lng || 0 },
              imageCount
            }
          );
        }
      }));
    }
  }
}

module.exports = PlanDeploy;
