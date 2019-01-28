const Boom = require('boom');

const logoutRoute = {
  method: 'GET',
  path: '/api/authentication/logout',
  config: {
    tags: ['api', 'authentication'],
    description: 'Logout',
    notes: 'Logout',
    validate: {
      payload: null,
      query: null,
      headers: null
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: { }
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { sessionId } = req.headers;
      const { authentication } = req.server;

      return authentication
        .logout(sessionId)
        .then(() => {
          return reply({ }).code(200);
        })
        .catch((err) => {
          return reply(Boom.unauthorized(err.message));
        });
    }
  }
};

module.exports = logoutRoute;
