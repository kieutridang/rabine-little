const Boom = require('boom');

const MAX_BYTES = 1024 * 1024 * 10;

const postCompanyLogoRoute = {
  method: 'POST',
  path: '/api/client/company-logo',
  config: {
    tags: ['api', 'client', 'companylogo'],
    description: 'Add company logo',
    notes: 'post new company logo',
    auth: 'token',
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
      const request = req.payload;
      const { companyLogo } = req.server;

      return companyLogo.uploadLogo(request.companyLogo)
      .then((logoInfo) => {
        return reply(logoInfo).code(200);
      })
      .catch((err) => {
        return reply(Boom.badRequest(err.message));
      });
    }
  }
};

module.exports = postCompanyLogoRoute;
