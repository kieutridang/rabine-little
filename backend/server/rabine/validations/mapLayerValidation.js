const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const layerSchema = Joi.object({
  _id: Joi.objectId()
    .required()
    .description('layer Id')
    .required()
    .example('5ad6322fb52e83001434891c'),
  name: Joi.string()
    .allow('')
    .description('name')
    .example(''),
  featureType: Joi.string()
    .allow('')
    .optional()
    .description('featureType')
    .valid('ROOFING', 'PAVEMENT')
    .default('PAVEMENT')
    .example('PAVEMENT'),
  index: Joi.number()
    .description('number')
    .default(0)
    .example(0),
  isActive: Joi.boolean()
    .description('isActive')
    .default(false)
    .example(false),
  type: Joi.string()
    .optional()
    .description('action creation type')
    .allow(null)
    .valid('CREATE_LAYER', 'RESTORE_LAYER')
});

const paramsSchema = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('params')

});

const payloadSchema = Joi.object({
  layer: layerSchema.required()
    .description('map layer payload')
});

const responseSchema = Joi.object({
  isCreated: Joi.boolean()
    .required()
    .description('is map created')
});

module.exports = {
  layerSchema,
  paramsSchema,
  payloadSchema,
  responseSchema
};
