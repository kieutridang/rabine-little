const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const { locationSchema } = require('./commonValidation');

const siteSchema = Joi.object({
  name: Joi.string().trim().required()
    .description('Site name')
    .example('Naperville Home Depot'),

  status: Joi.string().trim().required()
    .valid(
      'New_Order',
      'Sent_For_Imagery_Capture',
      'Imagery_Capture_Complete',
      'In_Review_Zone_Map',
      'In_Review_Scope',
      'QC',
      'Transferred_To_Client_Portal',
      'Delivered_To_Client'
    )
    .description('site\'s status')
    .example('New_Order'),

  address: Joi.string().trim().required()
    .description('Site`s address (from google maps)')
    .example('50 San Jose Beach California'),

  location: locationSchema
    .description('site`s location (lat, lng)')
    .example({
      lat: 48.60367083333334,
      lng: -97.2172263888888
    }),

  addressLocation: locationSchema
    .description('site`s location from address input (lat, lng)')
    .example({
      lat: 48.60367083333334,
      lng: -97.2172263888888
    }),

  deadline: Joi.date()
    .description('Site created date')
    .example('2018-03-01T00:00:00.000Z'),

  type: Joi.string().required()
    .description('Site`s type')
    .required()
    .valid('Pavement', 'Roof', 'Other')
    .example('Pavement'),

  cost: Joi.number()
    .allow(null)
    .description('Site`s cost')
    .example('50000'),

  droneCost: Joi.number()
    .description('Site`s Drone Cost')
    .example('3000'),

  sqFoot: Joi.number()
    .description('Square Foot')
    .example('200'),

  notes: Joi.string().trim()
    .description('Site`s notes')
    .example('Near the beach'),

  clientId: Joi.objectId()
    .description('client Id')
    .example('5aa644b414d135507f7c7142'),

  dronePlanId: Joi.objectId()
    .allow(null)
    .description('dronePlanId from DroneDeploy.js')
    .example('5a3995133359c568a880c9f8'),

  dronePlanName: Joi.string().trim()
    .allow(null)
    .description('Drone Plan`s name')
    .example('wmdc6041 - Riverside CA'),

  googleDriveId: Joi.string().description('Linked google drive folder id')
    .example('1zuV1JH0sV4AiM0C22sNVuxWrOCBrCLnZ'),

  rabineS3Folder: Joi.string().description('Linked rabineS3Folder')
    .allow(null)
    .example('rabine_wmdc6094_180322')
});

const postSiteRequestSchema = siteSchema;
const postSiteResponseSchema = siteSchema.keys({
  id: Joi.objectId().required()
  .description('site Id')
  .example('5aa657341a8d0566dc31e374')
});

const getSiteInfoRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const deleteSiteInfoRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const getSiteInfoResponseSchema = siteSchema.keys({
  id: Joi.objectId().required()
  .description('site Id')
  .example('5aa657341a8d0566dc31e374')
});

const deleteSiteInfoResponseSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374')
});

const getSitesRequestSchema = Joi.object({
  name: Joi.string().trim()
  .description('Site name')
  .example('filter by name'),

  clientId: Joi.objectId()
    .description('client Id')
    .example('5aa644b414d135507f7c7142'),

  dronePlanId: Joi.objectId()
  .description('drone Plan Id')
  .example('5aa657341a8d0566dc31e374'),

  status: Joi.string().trim()
  .valid(
    'New_Order',
    'Sent_For_Imagery_Capture',
    'Imagery_Capture_Complete',
    'In_Review_Zone_Map',
    'In_Review_Scope',
    'QC',
    'Transferred_To_Client_Portal',
    'Delivered_To_Client'
  )
  .description('site\'s status')
  .example('New_Order'),

  type: Joi.string().trim()
    .description('Site`s type')
    .valid('Pavement', 'Roof', 'Other')
    .example('Pavement')
});

const getSitesResponseSchema = Joi.array().items(siteSchema.keys({
  completedDate: Joi.date().required()
    .description('date that site has completed repair')
    .example(new Date()),
  totalRepairs: Joi.number().integer()
    .description('Total defects need to repair')
    .example(100)
}));


module.exports = {
  siteSchema,
  postSiteRequestSchema,
  postSiteResponseSchema,
  getSitesRequestSchema,
  getSitesResponseSchema,
  getSiteInfoRequestSchema,
  getSiteInfoResponseSchema,
  deleteSiteInfoRequestSchema,
  deleteSiteInfoResponseSchema
};
