const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const HVACPayloadSchema = Joi.object({
  currentUnitCost: Joi.string()
    .description('currentUnitCost')
    .example('50'),
  drigInstallCost: Joi.string()
    .description('currentUnitCost')
    .example('983826'),
  geojson: Joi.object()
    .description('GEO JSON Annotations'),
  invoice: Joi.string()
    .description('invoice')
    .example('5433234'),
  layerType: Joi.string()
    .description('layerType')
    .example('HVAC'),
  manufactureDate: Joi.date()
    .description('repair created date')
    .example('2018-03-01T00:00:00.000Z'),
  modelNumber: Joi.string()
    .description('modelNumber')
    .example('CX938271'),
  pubScore: Joi.string()
    .description('pubScore')
    .example('89'),
  serialNumber: Joi.string()
    .description('serialNumber')
    .example('939847838937'),
  unitNumber: Joi.string()
    .description('unitNumber')
    .example('2'),
  unitTonnage: Joi.string()
    .description('unitTonnage')
    .example('82'),
  unitType: Joi.object()
    .description('unitType')
    .example({
      id: 'HeatingAndAirConditioning',
      value: 'Heating and Air conditioning',
      color: '#00E512'
    })
});

const HVACItemSchema = HVACPayloadSchema.keys({
  siteId: Joi.objectId()
    .description('siteId')
    .example('5aa657341a8d0566dc31e374')
});


const getHVACsRequest = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('siteId')
    .example('5aa657341a8d0566dc31e374')
});

const getHVACItemRequest = getHVACsRequest.keys({
  id: Joi.objectId()
    .required()
    .description('HVAC item id')
    .example('5aa657341a8d0566dc31e374')
});

const getHVACsResponse = Joi.array().items(HVACItemSchema)
  .description('array of hvac')
  .example([]);

const postHVACsPayloadRequest = HVACPayloadSchema;

const deleteHVACRequest = getHVACItemRequest;
const deleteHVACResponse = getHVACItemRequest;

const putHVACRequest = getHVACItemRequest;

const putHVACPayloadRequest = HVACPayloadSchema;
const putHVACRespone = HVACItemSchema;

module.exports = {
  getHVACsRequest,
  getHVACsResponse,

  HVACItemSchema,

  postHVACsPayloadRequest,
  getHVACItemRequest,

  deleteHVACRequest,
  deleteHVACResponse,

  putHVACRequest,
  putHVACPayloadRequest,
  putHVACRespone
};
