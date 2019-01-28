const Boom = require('boom');

const { loginValidation } = require('../../validations');
const { multipleRoute } = require('../../../utils/routeUtils');

const loginRoute = {
  method: 'POST',
  path: ['/api/authentication/login', '/api/login'],
  config: {
    tags: ['api', 'authentication'],
    description: 'Login',
    notes: 'Login',
    validate: {
      payload: loginValidation.loginRequestSchema,
      query: null,
      headers: null
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: loginValidation.loginResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const loginRequest = req.payload;
      const { authentication } = req.server;

      return authentication.login(loginRequest)
        .then((authenticatedUser) => {
          return reply(authenticatedUser).code(200);
        })
        .catch((err) => {
          return reply(Boom.unauthorized(err.message));
        });
    }
  }
};

module.exports = multipleRoute(loginRoute);
