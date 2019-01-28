const Boom = require('boom');

const { s3FolderValidation } = require('../../validations');
const { AWSRabineUpliftSrc } = require('../../config');

const getSiteS3FoldersRoute = {
  method: 'GET',
  path: '/api/s3',
  config: {
    tags: ['api', 's3'],
    description: 'Get all s3 folders',
    notes: 'Get all s3 folders',
    validate: {
      query: s3FolderValidation.getS3RequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: s3FolderValidation.listS3ResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { s3Folder } = req.server;
      const { name, all = false } = req.query;

      return s3Folder.listS3(null, AWSRabineUpliftSrc, all, name)
        .then((folders) => {
          if (folders) {
            return reply(folders).code(200);
          }

          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getSiteS3FoldersRoute;
