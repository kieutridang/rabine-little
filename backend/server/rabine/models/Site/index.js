import axios from 'axios';
import randomJS from 'random-js';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import head from 'lodash/head';
import has from 'lodash/has';

import SiteDB from '~/schemas/Site';
import { googleApiKey } from '~/constants';

import { AWSRabineUpliftSrc } from '~/config';
import logger from 'utils/logger';

import Activity from '~/models/Site/Activity';
import Area from '~/models/Site/Area';
import Map from '~/models/Site/Map';
import Repair from '~/models/Site/Repair';
import MapComment from '~/models/Site/MapComment';
import SiteBidSheet from '~/models/Site/SiteBidSheet';
import RepairComment from '~/models/Site/RepairComment';
import Order from '~/models/Site/Order';

import MapLayer from '~/models/Site/MapLayer';
import AreaPhotoRepair from '~/models/AreaPhotoRepair';

const random = randomJS();

class Site {
  constructor(opts) {
    Object.assign(this, opts);

    this.Activity = new Activity();
    this.Area = new Area(opts);
    this.Map = new Map(opts);
    this.Repair = new Repair(opts);
    this.MapComment = new MapComment(opts);
    this.MapLayer = new MapLayer(opts);
    this.RepairComment = new RepairComment(opts);
    this.SiteBidSheet = new SiteBidSheet(opts);
    this.AreaPhotoRepair = new AreaPhotoRepair(opts);
    this.Site = this;
    this.Order = new Order(opts);

    this.Activity.loadOption(this);
    this.Area.loadOption(this);
    this.Map.loadOption(this);
    this.Repair.loadOption(this);
    this.MapComment.loadOption(this);
    this.RepairComment.loadOption(this);
    this.MapLayer.loadOption(this);
    this.AreaPhotoRepair.loadOption(this);
    this.SiteBidSheet.loadOption({ site: this.Site });
    this.Order.loadOption(this);
  }

  _buildGeoCodeUrl(address) {
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`;
  }

  _mapLocationData(googleResponseData = {}) {
    const {
      results,
      status
    } = googleResponseData;

    if (!isEmpty(results) && isEqual('OK', status)) {
      const firstResult = head(results);
      if (firstResult && has(firstResult, 'geometry.location')) {
        return get(firstResult, 'geometry.location');
      }
    }

    return null;
  }

  async _getDesignInfo(site) {
    const activities = await this.Activity.list(site.id);
    const client = await this.client.getById(site.clientId);
    let dronePlan;
    try {
      dronePlan = await this.planDeploy.getById(site.dronePlanId);
    } catch (error) {
      logger.error(error);
    }

    const siteDesign = {
      ...site,
      activities,
      clientName: client ? client.name : null,
      dronePlanName: dronePlan ? dronePlan.name : null
    };
    return siteDesign;
  }

  async _getSiteMapInfo(siteId) {
    const mapData = await this.Map.getById(siteId);
    return { ...mapData };
  }

  async _mapModel(siteDB) {
    if (!siteDB) {
      return null;
    }
    const {
      _id,
      name,
      status,
      address,
      location,
      addressLocation,
      deadline,
      type,
      cost,
      droneCost,
      sqFoot,
      email,
      notes,
      clientId,
      dronePlanId,
      dronePlanName,
      googleDriveId,
      rabineS3Folder
    } = siteDB;

    return {
      id: _id,
      name,
      status,
      address,
      location: location || addressLocation,
      deadline,
      type,
      cost,
      droneCost,
      sqFoot,
      email,
      notes,
      clientId,
      dronePlanId,
      dronePlanName,
      googleDriveId,
      rabineS3Folder,
      completedDate: new Date(),
      totalRepairs: random.integer(1, 100)
    };
  }

  async _mapModels(sitesDB) {
    const sites = sitesDB.map((site) => {
      const {
        _id,
        name,
        status,
        address,
        deadline,
        type,
        cost,
        droneCost,
        sqFoot,
        email,
        notes,
        location,
        addressLocation,
        clientId,
        dronePlanId,
        dronePlanName,
        googleDriveId,
        rabineS3Folder
      } = site;

      return {
        id: _id,
        name,
        status,
        address,
        deadline,
        type,
        cost,
        droneCost,
        sqFoot,
        email,
        notes,
        location: location || addressLocation,
        googleDriveId,
        clientId,
        rabineS3Folder,
        dronePlanId,
        dronePlanName,
        completedDate: new Date(),
        totalRepairs: random.integer(1, 100)
      };
    });

    const clientIds = sites.filter(site => site.clientId).map(site => site.clientId);
    const clients = await this.client.list({ clientIds });

    const sitesWithClients = sites.map((site) => {
      const { clientId } = site;
      const client = clientId
        ? clients.find(item => item.id.toString() === clientId.toString())
        : null;

      return {
        ...site,
        clientName: client && client.name ? client.name : null
      };
    });

    return sitesWithClients;
  }

  async _getGeoCodeByAddress(address) {
    if (!address || isEmpty(address)) {
      return null;
    }

    const geoCodeUrl = this._buildGeoCodeUrl(address);
    return axios.get(geoCodeUrl)
      .then(response => this._mapLocationData(response.data))
      .catch((error) => {
        throw new Error(error);
      });
  }

  async _getGeoCodeOfDronePlan(dronePlanId) {
    let dronePlan;
    try {
      dronePlan = await this.planDeploy.getById(dronePlanId);
    } catch (error) {
      logger.error(error);
    }

    if (dronePlan && !isEmpty(dronePlan) && has(dronePlan, 'location')) {
      return get(dronePlan, 'location');
    }

    return null;
  }

  async create(siteRequest, user) {
    const {
      name,
      status,
      address,
      deadline,
      type,
      cost,
      droneCost,
      sqFoot,
      clientId,
      dronePlanId,
      dronePlanName,
      rabineS3Folder
    } = siteRequest;

    const addressLocation = await this._getGeoCodeByAddress(address);
    const dronePlanLocation = await this._getGeoCodeOfDronePlan(dronePlanId);

    const sitePayload = {
      name,
      status,
      address,
      location: dronePlanLocation,
      addressLocation,
      deadline,
      type,
      cost,
      droneCost,
      sqFoot,
      clientId,
      dronePlanId,
      dronePlanName,
      rabineS3Folder
    };

    const site = new SiteDB(sitePayload);

    const siteDB = await site.save();
    if (siteDB) {
      const { _id: siteId, rabineS3Folder: s3Folder } = siteDB;

      await this.Order.createOrder({
        user,
        payload: {
          siteId,
          ...sitePayload
        }
      });

      await this.MapLayer.populateWithInitialLayers(
        siteId,
        'PAVEMENT',
        ['Zone Map', '2018', '2019', '2020', '2021', '2022', '2023']
      );
      await this.MapLayer.populateWithInitialLayers(
        siteId,
        'ROOFING',
        ['Zone Map', '2018', '2019', '2020', '2021', '2022', '2023']
      );

      if (s3Folder) {
        // get area, checking to make sure it works
        const folders = await this.s3Folder.list(s3Folder, AWSRabineUpliftSrc);

        const handleAreas = async () => {
          const handled = await Promise.all(folders.map(async ({ name: areaName }) => {
            const siteArea = await this.Area.getBySiteNameAndTitle(siteId, areaName);

            if (!siteArea) {
              const created = await this.Area.addSiteArea(siteId, areaName);
              return created;
            }

            return siteArea;
          }));

          return handled;
        };

        handleAreas().then(() => {
          this.s3aws.copyFolder({ siteId, folder: s3Folder });
        });
      }
    }

    return this._mapModel(siteDB);
  }

  async list(filter) {
    const query = { deleted: false };
    const {
      name,
      clientId,
      dronePartnerId,
      status,
      type,
      dronePlanId
    } = filter;

    if (clientId) {
      query.clientId = clientId;
    }

    if (dronePartnerId) {
      query.dronePartnerId = dronePartnerId;
    }

    if (name && typeof name === 'string') {
      query.name = { $regex: name };
    }

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    if (dronePlanId) {
      query.dronePlanId = dronePlanId;
    }

    return SiteDB.find(query)
      .then(data => this._mapModels(data))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getSiteDesignInfo(siteId) {
    return SiteDB.findOne({ _id: siteId, deleted: false })
      .then(this._mapModel)
      .then(site => this._getDesignInfo(site))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getSiteMapInfo(siteId) {
    return this.getById(siteId)
      .then(this._mapModel)
      .then(site => this._getSiteMapInfo(site.id))
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getSiteInfo(siteId) {
    return this.getById(siteId)
      .then(this._mapModel)
      .catch((err) => {
        throw new Error(err);
      });
  }

  async deleteSite(siteId) {
    return SiteDB.findOneAndUpdate({ _id: siteId, deleted: false }, { deleted: true })
      .then(this._mapModel)
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getById(siteId) {
    return SiteDB.findOne({ _id: siteId, deleted: false })
    .then((found) => {
      if (!found) { throw new Error('Not found'); }
      return found;
    });
  }

  async getByIds(siteIds) {
    const sites = await Promise.all(siteIds.map(async (siteId) => {
      const site = this.getById(siteId);
      return site;
    }));

    return sites;
  }

  async syncSiteAreas(siteId, rabineS3Folder) {
    // get area, checking to make sure it works
    const folders = await this.s3Folder.list(rabineS3Folder, AWSRabineUpliftSrc);

    return Promise.all(folders.map(async ({ name: areaName }) => {
      const siteArea = await this.Area.getBySiteNameAndTitle(siteId, areaName);

      if (!siteArea) {
        await this.Area.addSiteArea(siteId, areaName);
      }
    }));
  }

  async findAndUpdate(siteId, newData) {
    const { address, dronePlanId, rabineS3Folder } = newData;

    const addressLocation = await this._getGeoCodeByAddress(address);
    const dronePlanLocation = await this._getGeoCodeOfDronePlan(dronePlanId);
    const updateData = { ...newData, addressLocation, location: dronePlanLocation };

    if (rabineS3Folder) {
      this.syncSiteAreas(siteId, rabineS3Folder)
        .then(() => {
          this.s3aws.copyFolder({ siteId, folder: rabineS3Folder });
        });
    }

    return SiteDB.findOneAndUpdate({ _id: siteId, deleted: false }, updateData, { new: true })
      .then(this._mapModel)
      .catch((err) => {
        throw new Error(err);
      });
  }

  async updateSiteInfo(site) {
    return site.save();
  }

  async _getTotalOrders() {
    return SiteDB.count({ deleted: false })
      .catch((error) => {
        throw new Error(error);
      });
  }

  async _getOrdersCompleted() {
    return SiteDB.count({ deleted: false, status: 'Delivered_To_Client' })
      .catch((error) => {
        throw new Error(error);
      });
  }

  async _getTotalRevenue() {
    return SiteDB.aggregate([
      {
        $match: {
          deleted: false
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$cost' }
        }
      }])
      .then(revenues => (revenues ? head(revenues).totalRevenue : 0))
      .catch((error) => {
        throw new Error(error);
      });
  }

  async getSiteMetrics() {
    const totalOrders = await this._getTotalOrders();
    const orderCompleted = await this._getOrdersCompleted();
    const openOrders = totalOrders - orderCompleted;
    const totalRevenue = await this._getTotalRevenue();

    return {
      totalOrders,
      orderCompleted,
      openOrders,
      totalRevenue
    };
  }

  async getSitesByClient(clientId) {
    const query = { clientId: clientId, deleted: false };
    return SiteDB.find(query)
      .then(data => this._mapModels(data))
      .catch((err) => {
        throw new Error(err);
      });
  }
}

module.exports = Site;
