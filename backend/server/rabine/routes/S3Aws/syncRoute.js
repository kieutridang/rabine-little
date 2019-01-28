const Boom = require('boom');

const { syncValidation } = require('../../validations');

const syncRoute = {
  method: 'GET',
  path: '/api/sync',
  config: {
    tags: ['api', 'sync'],
    description: 'Sync all S3 folder',
    notes: 'sync all S3 folders',
    validate: {
      query: null,
      headers: null
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: syncValidation.syncResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { s3aws } = req.server;
      const result = await s3aws.syncFolder();

      if (result) {
        return reply(result);
      }

      return reply(Boom.badRequest('siteId or folder is not correct'));
    }
  }
};

module.exports = syncRoute;
