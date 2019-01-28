const Boom = require('boom');

const { siteBidSheetValidation } = require('../../validations');

const listSiteRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/snapshot',
  config: {
    tags: ['api', 'site', 'bid sheet', 'photo'],
    description: 'Add photo to site bid sheet',
    notes: 'post a form data to site bidSheet photo',
    auth: 'token',
    validate: {
      query: siteBidSheetValidation.getSiteBidSheetPhotoRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteBidSheetValidation.getSiteBidSheetPhotoResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId } = req.query;
      const { site } = req.server;

      return site.SiteBidSheet.getBySite(siteId)
        .then((photos) => {
          return reply(photos).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = listSiteRoute;
