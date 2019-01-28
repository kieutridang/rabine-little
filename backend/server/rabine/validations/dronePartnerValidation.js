const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const dronePartnerSchema = Joi.object({
  name: Joi.string().trim().required()
  .description('DronePartner name')
  .example('Naperville Home Depot'),

  contactName: Joi.string().trim().required()
  .description('contact \'s name')
  .example('John'),

  phone: Joi.string().trim()
  .description('dronePartner\'s phone number')
  .example('938372662'),

  email: Joi.string().trim().required()
  .description('email')
  .example('hien@launchdeck.org'),

  notes: Joi.string().trim().required()
  .description('notes')
  .example('from San Jose media group')
});

const postDronePartnerRequestSchema = dronePartnerSchema;
const postDronePartnerResponseSchema = dronePartnerSchema.keys({
  _id: Joi.objectId().required()
});

const getDronePartnerInfoRequestSchema = postDronePartnerResponseSchema;
const getDronePartnerInfoResponseSchema = dronePartnerSchema;

const getDronePartnersRequestSchema = Joi.object({
  dronePartnerId: Joi.objectId()
    .description('dronePartner Id')
    .example('5aa657341a8d0566dc31e374'),
  name: Joi.string().trim()
  .description('dronePartner name')
  .example('San Jose'),
  contactName: Joi.string().trim()
  .description('contact Name')
  .example('John')
});

const getDronePartnersResponseSchema = Joi.array().items(dronePartnerSchema.keys({
  activeJobs: Joi.number().integer()
    .description('number of active jobs')
    .example(20),
  createdDate: Joi.date().required()
    .description('Drone created date')
    .example('2018-03-01T00:00:00.000Z'),
  completedJobs: Joi.number().integer()
    .description('number of completed jobs')
    .example(10),
  averageTurnAround: Joi.string().trim()
    .description('Average turn around of drone')
    .example('29 days')
}));

module.exports = {
  getDronePartnersRequestSchema,
  getDronePartnersResponseSchema,
  getDronePartnerInfoRequestSchema,
  getDronePartnerInfoResponseSchema,
  postDronePartnerRequestSchema,
  postDronePartnerResponseSchema
};
