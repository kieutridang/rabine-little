const Boom = require('boom');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const paramsSchema = Joi.object({
  layerId: Joi.objectId().required()
});

const responseSchema = Joi.object({
  layerId: Joi.objectId().required(),
  isDeleted: Joi.boolean().required()
});

module.exports = {
  method: 'DELETE',
  path: '/api/layers/{layerId}',
  config: {
    tags: ['api', 'site', 'layer'],
    description: 'DELETE site map layer',
    notes: 'DELETE site map layer',
    auth: 'token',
    validate: {
      params: paramsSchema
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
        server: { site },
        params: { layerId }
      } = req;

      const userId = req.auth.credentials ? req.auth.credentials._id : null;

      return site.Map.deleteLayerById({ layerId, userId })
        .then((isDeleted) => {
          return reply({ isDeleted }).code(200);
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
