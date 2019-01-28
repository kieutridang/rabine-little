const Boom = require('boom');
const jwtVerify = require('../../../utils/jwtVerify');

const { siteAreaValidation } = require('../../validations');

const getSiteAreaRoute = {
  method: 'GET',
  path: '/api/siteWithToken/{token}/areas/{areaId}',
  config: {
    tags: ['api', 'site'],
    description: 'Get siteArea info',
    notes: 'Get siteArea info',
    validate: {
      params: siteAreaValidation.getSiteAreaWithTokenRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteAreaValidation.getSiteAreaResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { areaId, token } = req.params;
      const { site } = req.server;
      let { page, pageSize } = req.query;
      page = page ? Number(page) : null;
      pageSize = pageSize ? Number(pageSize) : null;

      return jwtVerify(token).then((decoded) => {
        return site.Area.getById(decoded.data.siteId, areaId, page, pageSize);
      }).then((area) => {
        if (area) {
          return reply(area).code(200);
        }

        return reply(Boom.notFound());
      }).catch((err) => {
        return reply(Boom.badRequest(err.message));
      });
    }
  }
};

module.exports = getSiteAreaRoute;
