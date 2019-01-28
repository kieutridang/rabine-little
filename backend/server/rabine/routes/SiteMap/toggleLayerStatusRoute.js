const Boom = require('boom');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const paramsSchema = Joi.object({
  layerId: Joi.objectId().required()
});

const payloadSchema = Joi.object({
  isActive: Joi.boolean().description('SiteMapLayerStatus')
});

const responseSchema = Joi.object({
  isUpdated: Joi.boolean().required()
});

module.exports = {
  method: 'PUT',
  path: '/api/layers/{layerId}/toggle-status',
  config: {
    tags: ['api', 'site', 'layer'],
    description: 'PUT site map layer',
    notes: 'Put site map layer',
    auth: 'token',
    validate: {
      params: paramsSchema,
      payload: payloadSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: responseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const {
        payload: { isActive = false },
        server: { site },
        params: { layerId }
      } = req;

      const userId = req.auth.credentials ? req.auth.credentials._id : null;

      return site.Map.toggleLayerStatus({ layerId, userId, isActive })
        .then((isUpdated) => {
          if (isUpdated) {
            return reply({ isUpdated: !!isUpdated }).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
