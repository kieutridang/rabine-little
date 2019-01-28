const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const { areaPhotoResponseSchema } = require('./areaPhotoValidation');

const siteAreaSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required()
    .description('area title')
    .example('South Session'),
  siteId: Joi.objectId()
  .required()
  .description('site Id')
  .example('5aa657341a8d0566dc31e374')
});

const siteAreaResponseSchema = siteAreaSchema.keys({
  id: Joi.objectId()
    .required()
    .description('areas Id')
    .example('5aa657341a8d0566dc31e374'),
  imagesCount: Joi.number()
    .integer()
    .description('images count')
    .example(56),
  type: Joi.string()
    .valid('Photo', 'Video')
    .required()
    .description('area type')
    .default('Photo')
    .example('Video'),
  createdDate: Joi.date()
    .description('Site area created date')
    .example('2018-03-01T00:00:00.000Z')
});

const putSiteAreaRequestSchema = siteAreaSchema;
const putSiteAreaResponseSchema = siteAreaResponseSchema;

const getSiteAreasRequestSchema = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374')
});
const getSiteAreasResponseSchema = Joi.object({
  photoAreas: Joi.array()
    .items(siteAreaResponseSchema)
    .description('photo areas'),
  videoAreas: Joi.array()
    .items(siteAreaResponseSchema)
    .description('video areas')
});

const getSiteAreaRequestSchema = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e375'),
  areaId: Joi.alternatives([
    Joi.string().valid('defected', 'repair'),
    Joi.objectId()
  ]).required()
    .description('area Id')
    .example('5b1fd9c3ea08fd008b23d8b1')
});

const toggleAreaPhotoRequestSchema = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e375'),
  areaId: Joi.alternatives([
    Joi.string().valid('defected', 'repair'),
    Joi.objectId()
  ]).required()
    .description('area Id')
    .example('5b1fd9c3ea08fd008b23d8b1'),
  photoId: Joi.objectId()
    .required()
    .description('photo Id')
    .example('5aa657341a8d0566dc31e374'),
  defected: Joi.bool()
    .required()
    .description('defected')
    .example(true)
});

const toggleAreaPhotoResponseSchema = Joi.object({
  success: Joi.boolean().required()
});

const setAreaPhotoDefectedTypeRequestSchema = Joi.object({
  siteId: Joi.objectId().required(),
  photoId: Joi.objectId().required(),
  areaId: Joi.alternatives([
    Joi.string().valid('defected', 'repair'),
    Joi.objectId()
  ]).required()
    .description('area Id')
    .example('5b1fd9c3ea08fd008b23d8b1'),
  repairId: [Joi.objectId(), Joi.string()]
});

const setAreaPhotoDefectedTypeResponseSchema = Joi.object({
  success: Joi.boolean().required()
});

const setAreaPhotoDefectedSeverityRequestSchema = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('site Id')
    .example('5ae6e37c6c5ada00148bbe1b'),
  areaId: Joi.alternatives([
    Joi.string().valid('defected', 'repair'),
    Joi.objectId()
  ]).required()
    .description('area Id')
    .example('5b1fd9c3ea08fd008b23d8b1'),
  photoId: Joi.objectId()
    .required()
    .description('photo Id')
    .example('5b10611a2315156eb0fbffdd'),
  severity: Joi.string()
    .valid('Minimal', 'Moderate', 'Severe')
    .allow(null)
    .description('Defected severity')
    .example('Minimal')
});

const setAreaPhotoDefectedSeverityResponseSchema = Joi.object({
  success: Joi.boolean().required()
});

const toggleAreaPhotoRepairRequestSchema = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e375'),
  areaId: Joi.alternatives([
    Joi.string(),
    Joi.objectId()
  ]).required()
    .description('area Id')
    .example('5aa657341a8d0566dc31e374'),
  photoId: Joi.objectId()
    .required()
    .description('area Id')
    .example('5aa657341a8d0566dc31e374'),
  repair: Joi.bool()
    .required()
    .description('repair')
    .example(true)
});

const toggleAreaPhotoRepairResponseSchema = Joi.object({
  success: Joi.boolean().required()
});

const setAreaPhotoRepairNameRequestSchema = Joi.object({
  siteId: Joi.objectId().required(),
  photoId: Joi.objectId().required(),
  areaId: Joi.alternatives([
    Joi.string().valid('defected', 'repair'),
    Joi.objectId()
  ]).required()
    .description('area Id')
    .example('5b1fd9c3ea08fd008b23d8b1'),
  repairInstanceId: Joi.string().allow('').example('Infrared')
});

const setAreaPhotoRepairNameResponseSchema = Joi.object({
  success: Joi.boolean().required()
});

const getSiteAreaWithTokenRequestSchema = Joi.object({
  token: Joi.string().required(),
  areaId: Joi.alternatives([
    Joi.string().valid('defected', 'repair'),
    Joi.objectId()
  ]).required()
    .description('area Id')
    .example('5b1fd9c3ea08fd008b23d8b1')
});

const getSiteAreaResponseSchema = siteAreaResponseSchema.keys({
  photos: Joi.array()
    .items(areaPhotoResponseSchema)
    .required()
    .description('area photos')
    .example([{
      id: '5aa657341a8d0566dc31e374',
      title: '5XGFAbV.jpg',
      siteAreaId: '5ab8933ced29ad0014246f0f',
      url: 'https://i.imgur.com/5XGFAbV.jpg',
      location: {
        lat: 499,
        lng: -97.292
      },
      taken: '2018-03-01T00:00:00.000Z',
      droneMake: 'DRONE SAP',
      droneModel: 'EXDRONE-132',
      zoneId: '5aa657341a8d0566dc31e373',
      createdDate: '2018-03-01T00:00:00.000Z'
    }, {
      id: '5aa657341a8d0566dc31e375',
      title: '5XGFAbK.jpg',
      siteAreaId: '5ab8933ced29ad0014246f0e',
      url: 'https://i.imgur.com/5XGFAbK.jpg',
      location: {
        lat: 498,
        lng: -97.291
      },
      taken: '2018-04-01T00:00:00.000Z',
      droneMake: 'DRONE SAP 123',
      droneModel: 'EXDRONE-123',
      zoneId: '5aa657341a8d0566dc31e371',
      createdDate: '2018-04-01T00:00:00.000Z'
    }
    ])
});

module.exports = {
  siteAreaSchema,
  siteAreResponseSchema: siteAreaResponseSchema,

  putSiteAreaRequestSchema,
  putSiteAreaResponseSchema,

  getSiteAreasRequestSchema,
  getSiteAreasResponseSchema,

  getSiteAreaRequestSchema,
  getSiteAreaWithTokenRequestSchema,
  getSiteAreaResponseSchema,

  toggleAreaPhotoRequestSchema,
  toggleAreaPhotoResponseSchema,

  setAreaPhotoDefectedTypeRequestSchema,
  setAreaPhotoDefectedTypeResponseSchema,

  setAreaPhotoDefectedSeverityRequestSchema,
  setAreaPhotoDefectedSeverityResponseSchema,

  toggleAreaPhotoRepairRequestSchema,
  toggleAreaPhotoRepairResponseSchema,

  setAreaPhotoRepairNameRequestSchema,
  setAreaPhotoRepairNameResponseSchema
};
