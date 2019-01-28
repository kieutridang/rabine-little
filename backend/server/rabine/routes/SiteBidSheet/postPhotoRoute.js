const Boom = require('boom');

const { siteBidSheetValidation } = require('../../validations');

const MAX_BYTES = 1024 * 1024 * 20;

const postPhotoRoute = {
  method: 'POST',
  path: '/api/site/{siteId}/snapshot/{layerId}',
  config: {
    tags: ['api', 'site', 'bid sheet', 'photo'],
    description: 'Add photo to site bid sheet',
    notes: 'post a form data to site bidSheet photo',
    auth: 'token',
    validate: {
      params: siteBidSheetValidation.postBidSheetPhotoRequestSchema
    },
    payload: {
      allow: 'multipart/form-data',
      maxBytes: MAX_BYTES,
      output: 'file',
      parse: true
    },
    plugins: {
      'hapi-swagger': {
        response: {
          200: { description: 'Success', schema: {} },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { photo, repairId } = req.payload;
      const { siteId, layerId } = req.params;
      const { site } = req.server;

      const payload = {
        siteId,
        layerId,
        repairId,
        photo
      };

      return site.SiteBidSheet.uploadPhoto(payload)
        .then((photoInfo) => {
          return reply(photoInfo).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = postPhotoRoute;
