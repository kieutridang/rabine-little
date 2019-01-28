const Boom = require('boom');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const paramsSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const payloadSchema = Joi.object({
  order: Joi.object().required().description('SiteMapLayersOrder')
});

const responseSchema = Joi.object({
  isUpdated: Joi.boolean().required()
});

module.exports = {
  method: 'PUT',
  path: '/api/site/{siteId}/layers/reorder',
  config: {
    tags: ['api', 'site', 'layer'],
    description: 'PUT site map layers reorder',
    notes: 'Put site map layers reorder',
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
        payload: { order = {} },
        server: { site },
        params: { siteId }
      } = req;

      const userId = req.auth.credentials ? req.auth.credentials._id : null;

      return site.Map.updateLayersOrder({ siteId, userId, order })
        .then((isUpdated) => {
          if (isUpdated) {
            return reply({ isUpdated }).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
