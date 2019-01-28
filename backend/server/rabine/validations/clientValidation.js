const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const clientSchema = Joi.object({
  name: Joi.string().trim().required()
  .description('Client name')
  .example('Naperville Home Depot'),

  address: Joi.string().trim()
  .allow('')
  .allow(null)
  .description('Client address')
  .example('50 Beach San Jose, California'),

  contactName: Joi.string().trim()
  .allow('')
  .allow(null)
  .description('contact \'s name')
  .example('John'),

  phone: Joi.string().trim()
  .allow('')
  .allow(null)
  .description('client\'s phone number')
  .example('938372662'),

  email: Joi.string().trim()
  .allow('')
  .allow(null)
  .description('email')
  .example('hien@launchdeck.org'),

  notes: Joi.string().trim()
  .allow('')
  .allow(null)
  .description('notes')
  .example('from San Jose media group'),

  companyLogoKey: Joi.string().trim()
  .allow('')
  .allow(null)
  .description('company logo url')
});

const postClientRequestSchema = clientSchema;

const postClientResponseSchema = clientSchema.keys({
  _id: Joi.objectId().required()
});

const getClientInfoRequestSchema = Joi.object({
  clientId: Joi.objectId().required()
});

const getClientInfoResponseSchema = clientSchema;

const getClientsRequestSchema = Joi.object({
  clientId: Joi.objectId()
    .description('client Id')
    .example('5aa657341a8d0566dc31e374'),
  name: Joi.string().trim()
  .description('client name')
  .example('San Jose'),
  contactName: Joi.string().trim()
  .description('contact Name')
  .example('John')
});

const getClientsResponseSchema = Joi.array().items(clientSchema.keys({
  activeSites: Joi.number().integer()
    .description('number of active sites client requests')
    .example(17)
}));

const deleteClientRequestSchema = Joi.object({
  clientId: Joi.objectId().required()
});

const deleteClientResponseSchema = Joi.object({
  _id: Joi.objectId().required()
    .description('client Id')
    .example('5aa657341a8d0566dc31e374')
});

module.exports = {
  getClientsRequestSchema,
  getClientsResponseSchema,
  getClientInfoRequestSchema,
  getClientInfoResponseSchema,
  postClientRequestSchema,
  postClientResponseSchema,
  deleteClientRequestSchema,
  deleteClientResponseSchema
};
