const { siteMapValidation } = require('../../validations');
const jwt = require('jsonwebtoken');

const getShareLinkRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/photos/share',
  config: {
    tags: ['api', 'site'],
    description: 'Get site photos shared link',
    notes: 'Get site photos shared link',
    auth: 'token',
    validate: {
      params: siteMapValidation.getSitePhotosShareLinkRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteMapValidation.getSitePhotosShareLinkResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId } = req.params;

      const token = jwt.sign({
        data: { siteId }
      }, 'secret');

      return reply({ token }).code(200);
    }
  }
};

module.exports = getShareLinkRoute;
