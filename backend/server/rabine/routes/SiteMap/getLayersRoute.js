const Boom = require('boom');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

// const jwtVerify = require('../../../utils/jwtVerify');

const paramsSchema = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('site Id')
    .example('5ad6314fb52e830014348979')
});

const querySchema = Joi.object({
  featureType: Joi.string()
    .description('feature type')
    .optional()
    .valid('PAVEMENT', 'ROOFING')
    .default('PAVEMENT')
    .example('ROOFING'),
  token: Joi.string()
  .trim()
  .optional()
  .description('token in case using in share screen')
  .example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QwMzA0QHlvcG1haWwuY29tIiwiZXhwaXJlVGltZSI6IjA4LzA3LzIwMTggMDI6MDE6MzkiLCJpYXQiOjE1MzA5NDY4OTl9.tPs4H6McgANbW09nNEb79Mp8hdZSwFeDA6br8J3ivz4')
});

const responseSchema = Joi.object({
  layers: Joi.array()
    .required()
    .description('list of layer')
    .example([])
});

const getLayersRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/layers',
  config: {
    tags: ['api', 'site'],
    description: 'Get site map layers',
    notes: 'Get site map layers',
    auth: {
      strategies: ['token'],
      mode: 'try'
    },
    validate: {
      params: paramsSchema,
      query: querySchema
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
      // const { token, featureType } = req.query;
      const { featureType } = req.query;
      const { siteId } = req.params;
      const { site } = req.server;

      // const userId = req.auth.credentials ? req.auth.credentials._id : null;
      //
      // if (!userId) {
      //   if (!token) {
      //     return reply(Boom.unauthorized('Unauthorized'));
      //   }
      //
      //   const decoded = await jwtVerify(token);
      //
      //   if (decoded && decoded.data.siteId.toString() !== siteId.toString()) {
      //     return reply(Boom.badRequest('Mismatch'));
      //   }
      // }

      // const request = { siteId, userId };
      const request = { siteId };

      if (!featureType) {
        request.featureType = 'PAVEMENT';
      } else {
        request.featureType = featureType;
      }

      return site.Map.getLayers(request)
        .then((layers) => {
          if (layers) {
            const indexLayers = layers.map((layer) => {
              return {
                ...layer,
                index: layer.index || 0
              };
            });

            return reply({ layers: indexLayers }).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getLayersRoute;
