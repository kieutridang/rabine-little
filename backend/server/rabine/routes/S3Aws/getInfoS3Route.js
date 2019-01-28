import Boom from 'boom';

import { syncValidation } from '~/validations';

const getInfoS3Route = {
  method: 'GET',
  path: '/api/s3/info',
  config: {
    tags: ['api', 'info'],
    description: 'Get info S3 folder',
    notes: 'Get S3 folder info',
    validate: {
      query: syncValidation.getS3InfoRequestSchema,
      headers: null
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: syncValidation.getS3InfoResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { s3aws } = req.server;
      const getInfoRequest = req.query;
      const result = await s3aws.getInfo(getInfoRequest);

      if (result) {
        return reply(result);
      }

      return reply(Boom.badRequest('folder is not correct'));
    }
  }
};

module.exports = getInfoS3Route;
