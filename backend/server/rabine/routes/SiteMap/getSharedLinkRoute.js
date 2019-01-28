const { siteMapValidation } = require('../../validations');
const jwt = require('jsonwebtoken');

const getSiteMapInfoRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/map/share',
  config: {
    tags: ['api', 'site'],
    description: 'Get site map shared link',
    notes: 'Get site map shared link',
    auth: 'token',
    validate: {
      params: siteMapValidation.getSiteMapShareLinkRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteMapValidation.getSiteMapShareLinkResponseSchema
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

module.exports = getSiteMapInfoRoute;
