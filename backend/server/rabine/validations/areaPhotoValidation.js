const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);
const { locationSchema } = require('./commonValidation');
const { getSiteAreaResponseSchema } = require('./siteAreaValidation');

const photoItemSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required()
    .description('photo title')
    .example('5XGFAbV.jpg'),
  siteAreaId: Joi.objectId()
    .required()
    .description('Site area id')
    .example('5ab8933ced29ad0014246f0f'),
  url: Joi.string()
    .required()
    .description('photo url')
    .example('https://i.imgur.com/5XGFAbV.jpg'),
  originalUrl: Joi.string()
    .description('original photo umbnail url')
    .example('https://i.imgur.com/5XGFAbV.jpg'),
  thumbnailUrl: Joi.string()
    .description('photo thumbnail url')
    .example('https://i.imgur.com/5XGFAbV.jpg'),
  location: locationSchema
    .required()
    .description('Photo  location')
    .example({
      lat: 48.60367083333334,
      lng: -97.2172263888888
    }),
  defected: Joi.boolean().description('Defected').example(true),
  repairId: Joi.objectId().allow(null).description('Repair type id').example('5ab8933ced29ad0014246f0f'),
  severity: Joi.string()
    .valid('Minimal', 'Moderate', 'Severe')
    .allow(null)
    .description('Defected severity')
    .example('Minimal'),
  croppedUrl: Joi.string()
    .description('s3 cropped url'),
  isCropUploaded: Joi.string()
    .description('s3 crop uploaded state'),
  repair: Joi.boolean().description('repair').example(true),
  repairName: Joi.string().allow('').description('Repair name').example('Infrared'),
  taken: Joi.date()
    .required()
    .description('photo taken date')
    .example('2018-03-01T00:00:00.000Z'),
  droneMake: Joi.string()
    .required()
    .description('photo info: drone make')
    .example('Drone SAP'),
  zoneId: Joi.string()
    .allow('')
    .description('Zone title')
    .example('Zone 1'),
  droneModel: Joi.string()
    .required()
    .description('photo info: drone model')
    .example('EXDRONE-132')
});

const areaPhotoResponseSchema = photoItemSchema.keys({
  id: Joi.objectId()
    .required()
    .description('photo Id')
    .example('5aa657341a8d0566dc31e374'),
  createdDate: Joi.date()
    .description('Photo created date')
    .example('2018-03-01T00:00:00.000Z')
});

const putPhotoRequestSchema = photoItemSchema;
const putPhotoResponseSchema = getSiteAreaResponseSchema;

module.exports = {
  photoItemSchema,
  areaPhotoResponseSchema,

  putPhotoRequestSchema,
  putPhotoResponseSchema
};
