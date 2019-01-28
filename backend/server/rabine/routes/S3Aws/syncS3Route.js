const Boom = require('boom');

const { syncValidation } = require('../../validations');

const syncS3Route = {
  method: 'POST',
  path: '/api/s3/sync',
  config: {
    tags: ['api', 'sync', 's3'],
    description: 'Sync S3 folder',
    notes: 'sync S3 folders',
    validate: {
      payload: syncValidation.syncRequestSchema,
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
      const siteInfo = req.payload;
      const result = await s3aws.copyFolder(siteInfo);

      if (result) {
        return reply(result);
      }

      return reply(Boom.badRequest('siteId or folder is not correct'));
    }
  }
};

module.exports = syncS3Route;
