const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const { locationSchema } = require('./commonValidation');

const planDeploySchema = Joi.object({
  id: Joi.objectId().required()
  .description('Plan Deploy Id')
  .example('5aa657341a8d0566dc31e374'),

  name: Joi.string().trim().required()
  .description('Plan Deploy name')
  .example('Agriculture WalMart'),

  location: locationSchema
  .description('Plan deploy location')
  .example({
    lat: 48.60367083333334,
    lng: -97.2172263888888
  }),

  imageCount: Joi.number().integer()
  .description('Number of images for this plan')
  .example(200)

});

const getPlanDeploysRequestSchema = Joi.object({
  name: Joi.string().trim()
  .description('Plan Deploy name')
  .example('filter by name'),
  all: Joi.boolean()
    .description('All plan deploy')
    .example(true)
});

const getPlanDeploysResponseSchema = Joi.array().items(planDeploySchema);

const exportOrthoRequestSchema = Joi.object({
  planId: Joi.objectId().required()
  .description('Plan Deploy Id')
  .example('5aa657341a8d0566dc31e374'),
  siteId: Joi.objectId()
  .description('Plan Deploy Id')
  .example('5aa657341a8d0566dc31e375')
});

const exportOrthoResponseSchema = Joi.object({
  id: Joi.objectId().required()
  .description('Id')
  .example('5aa657341a8d0566dc31e371'),
  siteId: Joi.objectId()
  .description('Site Id')
  .example('5aa657341a8d0566dc31e374'),
  planId: Joi.objectId().required()
  .description('Plan Deploy Id')
  .example('5aa657341a8d0566dc31e375'),
  droneDeployExportRequestId: Joi.objectId().required()
  .description('Plan Deploy Id')
  .example('5ac39a9a960c7e000199bc6c'),
  droneDeployStatus: Joi.string().trim().required()
  .description('drone deploy status')
  .example('Order Created'),
  droneDeployUpdatedDate: Joi.date().required()
  .description('Drone request updated date')
  .example('2018-03-01T00:00:00.000Z'),
  createdDate: Joi.date().required()
  .description('Drone request created date')
  .example('2018-03-01T00:00:00.000Z')

});

module.exports = {
  planDeploySchema,

  getPlanDeploysRequestSchema,
  getPlanDeploysResponseSchema,

  exportOrthoRequestSchema,
  exportOrthoResponseSchema
};
