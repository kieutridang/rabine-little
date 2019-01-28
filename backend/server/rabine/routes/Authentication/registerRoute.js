const Boom = require('boom');

const { registerValidation } = require('../../validations');
const { multipleRoute } = require('../../../utils/routeUtils');

const loginRoute = {
  method: 'POST',
  path: ['/api/register', '/api/authentication/register'],
  config: {
    tags: ['api', 'authentication'],
    description: 'Register new user',
    notes: 'Register',
    validate: {
      payload: registerValidation.registerRequestSchema,
      query: null,
      headers: null
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: registerValidation.registerResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const registerRequest = req.payload;
      const { authentication } = req.server;

      return authentication
        .register(registerRequest)
        .then((user) => {
          return reply(user).code(200);
        })
        .catch((err) => {
          return reply(Boom.notAcceptable(err.message));
        });
    }
  }
};

module.exports = multipleRoute(loginRoute);
