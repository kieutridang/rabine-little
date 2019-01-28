import Boom from 'boom';
import logger from 'utils/logger';

import { siteRepairValidation } from '../../validations';

const setCropUploadedURLRoute = {
  method: 'PUT',
  path: '/api/site/{siteId}/repairs/{repairName}/s3/uploaded',
  config: {
    tags: ['api', 'repair'],
    description: 'Set repair s3 cropped url is uploaded',
    notes: 'Set repair s3 cropped url is uploaded',
    validate: {
      params: siteRepairValidation.setCropUploadedURLRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairValidation.setCropUploadedURLResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { repairName, siteId } = req.params;
      const { site } = req.server;

      return site.Repair.setCropUploaded({ siteId, repairName }).then((updated) => {
        if (updated) {
          return reply({ updated }).code(200);
        }

        return reply(Boom.notFound());
      }).catch((err) => {
        logger.info(37, err);
        return reply(Boom.badRequest(err.message));
      });
    }
  }
};

module.exports = setCropUploadedURLRoute;
