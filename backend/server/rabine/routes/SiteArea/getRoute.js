const Boom = require('boom');
const { siteAreaValidation } = require('../../validations');

const jwtVerify = require('../../../utils/jwtVerify');

const getSiteAreaRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/areas/{areaId}',
  config: {
    tags: ['api', 'site'],
    description: 'Get siteArea info',
    notes: 'Get siteArea info',
    auth: {
      strategies: ['token'],
      mode: 'try'
    },
    validate: {
      params: siteAreaValidation.getSiteAreaRequestSchema
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
    handler: async (req, reply) => {
      const { token } = req.query;
      let { page, pageSize } = req.query;
      const { areaId, siteId } = req.params;
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
      page = page ? Number(page) : null;
      pageSize = pageSize ? Number(pageSize) : null;
      return site.Area.getById(siteId, areaId, page, pageSize)
        .then((area) => {
          if (area) {
            return reply(area).code(200);
          }

          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getSiteAreaRoute;
