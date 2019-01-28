const Boom = require('boom');
const Joi = require('joi'); const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const paramsSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const payloadSchema = Joi.object({
  feature: Joi.object().required().description('SiteMapFeature')
});

const responseSchema = Joi.object({
  isCreated: Joi.boolean().required()
});

module.exports = {
  method: 'POST',
  path: '/api/site/{siteId}/map/feature',
  config: {
    tags: ['api', 'site', 'feature'],
    description: 'POST site map feature',
    notes: 'POST site map feature',
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
        params: { siteId }
      } = req;

      if (!siteId) {
        return reply(Boom.badRequest());
      }

      const userId = req.auth.credentials ? req.auth.credentials._id : null;

      return site.Map.createFeature({ siteId, userId, feature })
        .then((createdFeature) => {
          if (createdFeature) {
            return reply({ feature: createdFeature }).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
