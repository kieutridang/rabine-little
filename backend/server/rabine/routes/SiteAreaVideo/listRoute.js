const Boom = require('boom');

const { areaVideoValidation } = require('../../validations');

const jwtVerify = require('../../../utils/jwtVerify');

const getSiteVideosRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/areas/{areaName}/video',
  config: {
    tags: ['api', 'site'],
    description: 'get videos of site',
    notes: 'get site area video',
    auth: {
      strategies: ['token'],
      mode: 'try'
    },
    validate: {
      params: areaVideoValidation.listVideoRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: areaVideoValidation.listVideoResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { token } = req.query;
      let { page, pageSize } = req.query;

      const { siteId, areaName } = req.params;
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
      return site.Area.getAreaVideo({ siteId, areaName, page, pageSize })
        .then((result) => {
          if (result) {
            const response = {
              siteId,
              areaName,
              videos: result.videos,
              totalCount: result.totalCount
            };

            return reply(response).code(200);
          }

          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getSiteVideosRoute;
