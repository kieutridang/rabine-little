const Boom = require('boom');
const Joi = require('joi');

const { mapLayerValidation } = require('../../validations');

const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

module.exports = {
  method: 'POST',
  path: '/api/site/{siteId}/map/layer',
  config: {
    tags: ['api', 'site', 'layer', 'roofingFeature'],
    description: 'POST site map layer',
    notes: 'POST site map layer',
    auth: 'token',
    validate: {
      params: mapLayerValidation.paramsSchema,
      payload: mapLayerValidation.payloadSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: mapLayerValidation.responseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const {
        payload: { layer },
        server: { site },
        params: { siteId }
      } = req;

      if (!siteId) {
        return reply(Boom.badRequest());
      }

      const userId = req.auth.credentials ? req.auth.credentials._id : null;

      return site.Map.createLayer({ siteId, userId, layer })
        .then((createdLayer) => {
          if (createdLayer) {
            return reply({ layer: createdLayer }).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
