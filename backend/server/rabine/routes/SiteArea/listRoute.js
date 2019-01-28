const Boom = require('boom');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const jwtVerify = require('../../../utils/jwtVerify');

const paramsSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const responseSchema = Joi.object({
  photoAreas: Joi.array().required(),
  videoAreas: Joi.array().required()
});

const getAreasRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/areas',
  config: {
    tags: ['api', 'site'],
    description: 'Get site map areas',
    notes: 'Get site map areas',
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
      const { token } = req.query;
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

      return site.Area.list(siteId)
        .then((areas) => {
          if (areas) {
            return reply(areas).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getAreasRoute;
