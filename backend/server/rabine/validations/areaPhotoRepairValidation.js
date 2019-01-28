const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const areaPhotoRepairParamSchema = Joi.object({
  photoId: Joi.string()
    .trim()
    .description('area photo Id')
    .example('5ab8933ced29ad0014246f0e')
});

const areaPhotoRepairSchema = Joi.object({
  repairId: Joi.string()
    .description('Site area photo id')
    .example('5ab8933ced29ad0014246f0e'),
  repairName: Joi.string()
    .trim()
    .description('AreaPhotoRepair title')
    .example('Area 1'),
  index: Joi.number()
    .description('Index of AreaPhotoRepair')
    .example(1)
});

const areaPhotoRepairResponseSchema = areaPhotoRepairSchema.keys({
  _id: Joi.objectId()
    .required()
    .description('area photo repair Id')
    .example('5aa657341a8d0566dc31e374'),
  photoId: Joi.objectId()
    .required()
    .description('Site area photo id')
    .example('5ab8933ced29ad0014246f0f')
});

const getAreaPhotoRepairsRequestSchema = areaPhotoRepairParamSchema;

const getAreaPhotoRepairsResponseSchema = Joi.array()
  .items(areaPhotoRepairResponseSchema)
  .required()
  .description('list of area photo Items');

const postAreaPhotoRepairRequestSchema = areaPhotoRepairSchema;
const postAreaPhotoRepairResponseSchema = areaPhotoRepairResponseSchema;

const deleteAreaPhotoRepairParamSchema = areaPhotoRepairParamSchema.keys({
  repairId: Joi.string()
    .required()
    .description('Site area photo repair')
    .example('5ab8933ced29ad0014246f0e')
});

const deleteAreaPhotoRepairResponseSchema = areaPhotoRepairResponseSchema;

module.exports = {
  areaPhotoRepairParamSchema,
  areaPhotoRepairSchema,

  getAreaPhotoRepairsRequestSchema,
  getAreaPhotoRepairsResponseSchema,

  postAreaPhotoRepairRequestSchema,
  postAreaPhotoRepairResponseSchema,

  deleteAreaPhotoRepairParamSchema,
  deleteAreaPhotoRepairResponseSchema
};
