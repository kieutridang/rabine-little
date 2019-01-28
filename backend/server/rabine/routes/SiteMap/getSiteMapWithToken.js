const Boom = require('boom');

const { siteMapValidation } = require('../../validations');
const jwtVerify = require('../../../utils/jwtVerify');

const getSiteMapWithTokenRoute = {
  method: 'GET',
  path: '/api/siteWithToken/{token}',
  config: {
    tags: ['api', 'site'],
    description: 'Get site map with token',
    notes: 'Get site map with token',
    validate: {
      params: siteMapValidation.getSiteMapWithTokenRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteMapValidation.getSiteMapWithTokenResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { token } = req.params;
      const { site } = req.server;

      let payload = {};

      return jwtVerify(token).then((decoded) => {
        return site.getSiteMapInfo(decoded.data.siteId);
      }).then((found) => {
        if (!found) {
          return reply(Boom.notFound());
        }

        payload = Object.assign({}, found);
        return found;
      }).then((found) => {
        return site.Map.listOrthoPhoto(found.siteId);
      })
      .then((photos) => {
        if (photos) {
          payload.orthoPhotos = photos;
        }

        return reply(payload).code(200);
      })
      .catch((err) => {
        return reply(Boom.badRequest(err.message));
      });
    }
  }
};

module.exports = getSiteMapWithTokenRoute;
