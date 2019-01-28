const Boom = require('boom');

const { resetPasswordValidation } = require('../../validations');

const requestResetPasswordRoute = {
  method: 'POST',
  path: '/api/request-reset-password',
  config: {
    tags: ['api', 'reset-password'],
    description: 'Request to reset user password',
    notes: 'post to email reset password',
    validate: {
      payload: resetPasswordValidation.resetPasswordRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: resetPasswordValidation.resetPasswordResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const resetPasswordRequest = req.payload;
      const { user } = req.server;

      return user.requestResetPassword(resetPasswordRequest.email)
        .then((resetToken) => {
          if (resetToken) {
            const token = { token: resetToken };
            return reply(token).code(200);
          }

          return reply(Boom.internal());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = requestResetPasswordRoute;
