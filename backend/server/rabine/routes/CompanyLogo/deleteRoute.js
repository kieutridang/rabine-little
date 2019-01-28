const Boom = require('boom');

const deleteCompanyLogoRoute = {
  method: 'DELETE',
  path: '/api/client/company-logo/{logoKey}',
  config: {
    tags: ['api', 'client', 'companylogo'],
    description: 'Delete company logo',
    notes: 'delete company logo',
    auth: 'token',
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
      const { logoKey } = req.params;
      const { companyLogo } = req.server;
      return companyLogo
      .delete(logoKey)
      .then(() => {
        return reply().code(200);
      })
      .catch((err) => {
        return reply(Boom.badRequest(err.message));
      });
    }
  }
};

module.exports = deleteCompanyLogoRoute;
