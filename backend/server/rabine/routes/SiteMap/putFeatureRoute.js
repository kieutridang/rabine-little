const Boom = require('boom');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const paramsSchema = Joi.object({
  featureId: Joi.objectId().required()
});

const payloadSchema = Joi.object({
  feature: Joi.object().required().description('SiteMapFeature')
});

const responseSchema = Joi.object({
  siteId: Joi.objectId(),
  feature: Joi.object().required().description('SiteMapFeature')
});

module.exports = {
  method: 'PUT',
  path: '/api/features/{featureId}',
  config: {
    tags: ['api', 'site', 'feature'],
    description: 'PUT site map feature',
    notes: 'Put site map feature',
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
        payload: { feature },
        server: { site },
        params: { featureId }
      } = req;

      const userId = req.auth.credentials ? req.auth.credentials._id : null;

      return site.Map.updateFeatureById({ featureId, userId, feature })
        .then(async (updatedSiteMap) => {
          if (updatedSiteMap) {
            return reply(updatedSiteMap).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
