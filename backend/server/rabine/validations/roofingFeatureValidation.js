const Joi = require('joi');

const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const RoofFeaturePayloadSchema = Joi.object({
  title: Joi.string()
    .description('title')
    .example('Top Layer Recoat- Need Depth and Unit of Measurement (SPF Roofs)'),
  rating: Joi.number()
    .integer()
    .description('rating')
    .example(1),
  index: Joi.number()
    .integer()
    .description('index')
    .example(0),
  color: Joi.string()
    .description('color')
    .example('#FF7077'),
  type: Joi.string()
    .description('type')
    .valid('repair', 'zone')
    .example('repair'),
  patchNumber: Joi.string()
    .description('patchNumber')
    .example('1.0'),
  layerId: Joi.string()
    .description('layer')
    .example('5aa657341a8d0566dc31e374'),
  layerType: Joi.string()
    .description('layerType')
    .example('MEASUREMENT_LAYER_ROOFING'),
  featureType: Joi.string()
    .description('feature type')
    .optional()
    .valid('PAVEMENT', 'ROOFING')
    .default('PAVEMENT')
    .example('ROOFING'),
  defectType: Joi.string()
    .description('defectType')
    .example('Ponding Water'),
  typeOfRepair: Joi.string()
    .description('typeOfRepair')
    .example('Capital'),
  repairType: Joi.string()
    .description('repairType')
    .example('Top Layer Recoat- Need Depth and Unit of Measurement (SPF Roofs)'),
  repairCost: Joi.string()
    .description('repairCost')
    .example('2000'),

  zoneId: Joi.string()
    .description('zoneId')
    .example('5aa657341a8d0566dc31e375'),
  zoneType: Joi.string()
    .description('zoneType')
    .example('Single Ply Membrane- EPDM'),
  zoneSubType: Joi.string()
    .allow(null)
    .description('zoneSubType')
    .example('Ballasted'),
  zoneName: Joi.string()
    .description('zoneName')
    .example('Zone 2'),

  siteId: Joi.objectId()
    .description('siteId')
    .example('5aa657341a8d0566dc31e374'),
  geojson: Joi.object()
    .description('GEO JSON Annotations')
    .example({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              -97.536594,
              35.526429
            ],
            [
              -97.536594,
              35.526586
            ],
            [
              -97.536278,
              35.526586
            ],
            [
              -97.536278,
              35.526429
            ],
            [
              -97.536594,
              35.526429
            ]
          ]
        ]
      }
    })
});

const RoofFeatureSchema = RoofFeaturePayloadSchema.keys({
  siteId: Joi.objectId()
    .required()
    .description('siteId')
    .example('5aa657341a8d0566dc31e374')
});

const getRoofsRequest = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('siteId')
    .example('5aa657341a8d0566dc31e374'),
  type: Joi.string()
    .description('roofingFeature type')
    .valid('repair', 'zone', 'all')
    .default('all')
    .example('repair')
});

const getRoofsResponse = Joi.array().items(RoofFeatureSchema)
  .description('array of roofingFeature feature')
  .example([]);

const RoofFeatureParams = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('siteId')
    .example('5aa657341a8d0566dc31e374'),
  id: Joi.objectId()
    .required()
    .description('roofingFeature Item')
    .example('5aa657341a8d0566dc31e375')
});

const postRoofParamRequest = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('siteId')
    .example('5aa657341a8d0566dc31e374')
});
const postRoofPayloadRequest = RoofFeaturePayloadSchema;
const postRoofResponse = RoofFeatureSchema;

const putRoofPayloadRequest = RoofFeaturePayloadSchema;
const putRoofResponse = RoofFeatureSchema;

const getRoofItemRequest = RoofFeatureParams;
const getRoofItemResponse = postRoofResponse;

const syncPavementToRoofingParamRequest = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('siteId')
    .example('5aa657341a8d0566dc31e374')
});
const syncPavementToRoofingResponse = Joi.object({
  features: Joi.array()
    .required()
    .description('features'),
  layers: Joi.array()
    .required()
    .description('layers')
});

module.exports = {
  RoofFeatureParams,

  getRoofsRequest,
  getRoofsResponse,

  postRoofParamRequest,
  postRoofPayloadRequest,
  postRoofResponse,

  getRoofItemRequest,
  getRoofItemResponse,

  putRoofPayloadRequest,
  putRoofResponse,

  syncPavementToRoofingParamRequest,
  syncPavementToRoofingResponse
};
