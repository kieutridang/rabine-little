const Boom = require('boom');
const { siteRepairValidation } = require('../../validations');

const getCropUploadURLRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/repairs/{repairName}/s3/getSignedURL',
  config: {
    tags: ['api', 'repair'],
    description: 'Get repair s3 signed url for upload',
    notes: 'Get repair s3 signed url for upload',
    validate: {
      params: siteRepairValidation.getRepairCropUploadURLRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairValidation.getRepairCropUploadURLResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { repairName, siteId } = req.params;
      const { fileName, type = 'image/jpg' } = req.query;
      const { site } = req.server;

      const payload = {
        siteId,
        repairName,
        fileName,
        type
      };

      return site.Repair.getCropUploadURL(payload)
        .then((payloadItem) => {
          if (payloadItem) {
            return reply(payloadItem).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getCropUploadURLRoute;
