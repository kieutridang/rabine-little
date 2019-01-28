const Boom = require('boom');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;

Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const jwtVerify = require('../../../utils/jwtVerify');

const paramsSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const responseSchema = Joi.object({
  changes: Joi.array().required(),
  total: Joi.number().required()
});

const getChangesRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/changes',
  config: {
    tags: ['api', 'site'],
    description: 'Get site map changes',
    notes: 'Get site map changes',
    auth: {
      strategies: ['token'],
      mode: 'try'
    },
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
    handler: async (req, reply) => {
      const { limit, after, token } = req.query;
      const { siteId } = req.params;
      const { site } = req.server;

      const userId = req.auth.credentials ? req.auth.credentials._id : null;

      if (!userId) {
        if (!token) {
          throw new Error('Unauthorized');
        }

        const decoded = await jwtVerify(token);

        if (decoded && decoded.data.siteId.toString() !== siteId.toString()) {
          throw new Error('Mismatch');
        }
      }

      return site.Map.getChanges({ siteId, limit, after }).then((changes) => {
        if (changes) {
          return reply(changes).code(200);
        }

        return reply(Boom.notFound());
      }).catch((err) => {
        return reply(Boom.badRequest(err.message));
      });
    }
  }
};

module.exports = getChangesRoute;
