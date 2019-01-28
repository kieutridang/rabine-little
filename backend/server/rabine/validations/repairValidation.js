const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const areaPhotoValidation = require('./areaPhotoValidation');

const repairSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required()
    .description('repair title')
    .example('alligator cracking')
});

const repairResponseSchema = repairSchema.keys({
  id: Joi.objectId()
    .required()
    .description('repair Id')
    .example('5aa657341a8d0566dc31e374'),
  createdDate: Joi.date()
    .description('repair created date')
    .example('2018-03-01T00:00:00.000Z')
});

const getRepairPhotosResponse = Joi.array().items(areaPhotoValidation.photoItemSchema);

const putRepairRequestSchema = repairSchema;

const getRepairListResponseSchema = Joi.array().items(repairResponseSchema);

const getRepairPhotosRequest = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374'),
  repairId: Joi.objectId()
    .required()
    .description('repair Id')
    .example('5aa657341a8d0566dc31e374')
});

module.exports = {
  repairSchema,
  repairResponseSchema,

  putRepairRequestSchema,

  getRepairListResponseSchema,

  getRepairPhotosRequest,
  getRepairPhotosResponse
};
