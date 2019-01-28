const Joi = require('joi');

const locationSchema = Joi.object({
  lat: Joi.number().required()
  .description('lat')
  .example('48.60367083333334'),
  lng: Joi.number().required()
  .description('lng')
  .example('-97.21722638888889')
});

const latLngBoxSchema = Joi.object({
  north: Joi.number().required()
    .description('north')
    .example('48.60367083333334'),
  south: Joi.number().required()
    .description('south')
    .example('48.60367083333334'),
  east: Joi.number().required()
    .description('east')
    .example('48.60367083333334'),
  west: Joi.number().required()
    .description('west')
    .example('-97.21722638888889')
});

const tokenSchema = Joi.object({
  Authorization: Joi.string().required()
});

module.exports = {
  locationSchema,
  latLngBoxSchema,
  tokenSchema
};
