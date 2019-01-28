import mongoose from 'mongoose';

import RoofingFeatureDB from '~/schemas/RoofingFeature';
import SiteMapLayerDB from '~/schemas/SiteMapLayer';
import SiteMapFeatureDB from '~/schemas/SiteMapFeature';

import logger from 'utils/logger';

const MISSING = null;

class SyncFeatureToRoofing {
  constructor(opts) {
    Object.assign(this, opts);
  }

  loadOption(opts) {
    Object.assign(this, opts);
  }

  async deleteOldSyncedData(siteId) {
    const query = { siteId, layerType: 'MEASUREMENT_LAYER_ROOFING' };
    await RoofingFeatureDB.remove(query);

    const layerQuery = { siteId, featureType: 'ROOFING' };
    await SiteMapLayerDB.remove(layerQuery);
  }
  async sync(request) {
    try {

      const { siteId } = request;

      await this.deleteOldSyncedData(siteId);

      const featureQuery = { siteId };
      featureQuery.$or = [{ featureType: { $exists: false } }, { featureType: 'PAVEMENT' }];
      const features = await SiteMapFeatureDB.find(featureQuery);

      const layerQuery = { siteId };
      layerQuery.$or = [{ featureType: { $exists: false } }, { featureType: 'PAVEMENT' }];
      const layers = await SiteMapLayerDB.find(layerQuery);

      // it is manually repairs
      // const repairQuery = { siteId };
      // repairQuery.$or = [{ featureType: { $exists: false } }, { featureType: 'PAVEMENT' }];
      // const repairs = await SiteRepairDB.find(repairQuery);

      // copy from features into roofingFeature
      // clone layers for type ROOFING
      const roofingLayers = await Promise.all(layers.map(async (layer) => {
        const {
          _id,
          siteId: existingSiteId,
          name,
          index
        } = layer;


        return {
          siteId: existingSiteId,
          name,
          index,
          featureType: 'ROOFING',
          oldId: _id
        };
      }));
      const savedLayers = await SiteMapLayerDB.insertMany(roofingLayers);


      const roofingFeatures = await Promise.all(features.map(async (feature) => {
        const {
          createdAt,
          updatedAt,
          geojson,
          title,
          color,
          index,
          repairType,
          surfaceType,
          siteId: existingSiteId,
          layerId,
          zoneId
        } = feature;

        let zone = { };
        if (zoneId && mongoose.Types.ObjectId.isValid(zoneId)) {
          zone = await SiteMapFeatureDB.findOne({ _id: mongoose.Types.ObjectId(zoneId) }) || {};
        }

        let type = null;
        let layer = { };
        let newLayerId = layerId;

        if (layerId) {
          layer = savedLayers.find(i => i.oldId.toString() === layerId.toString());

          if (layer) {
            newLayerId = layer._id;
            if (!repairType && layer.name &&
              (layer.name.toLowerCase().includes('zone ') || layer.name.toLowerCase() === 'zone')) {
              type = 'zone';
            } else {
              type = 'repair';
            }
          }
        }

        return {
          index,
          title,
          geojson,
          color,
          layerId: newLayerId,
          layerType: 'MEASUREMENT_LAYER_ROOFING',
          type,
          surfaceType,
          typeOfRepair: repairType,
          defectType: MISSING,
          repairType: title || zone.title,
          repairCost: MISSING,

          zoneId,
          zoneName: zone.title,
          zoneType: MISSING,
          zoneSubType: MISSING,

          siteId: existingSiteId,
          createdAt,
          updatedAt,
          deleted: false,
          featureType: 'ROOFING'
        };
      }));

      logger.info('Before>>>>>>>>>', roofingFeatures);
      logger.info('roofingFeatures', roofingFeatures);
      const saveFeatured = await RoofingFeatureDB.insertMany(roofingFeatures);

      return {
        features: saveFeatured,
        layers: savedLayers
      };
    } catch (err) {
      logger.info('There is error', err);

      return {
        err
      };
    }
  }

}

module.exports = SyncFeatureToRoofing;
