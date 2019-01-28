const Boom = require('boom');

const { resetPasswordValidation } = require('../../validations');

const resetUserPasswordRoute = {
  method: 'POST',
  path: '/api/reset-password',
  config: {
    tags: ['api', 'reset-password'],
    description: 'Reset a user password',
    notes: 'post reset user password',
    validate: {
      payload: resetPasswordValidation.resetPasswordSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: { description: 'Success' },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { password, resetToken } = req.payload;
      const { user } = req.server;

      return user.resetPassword(password, resetToken)
        .then((updatedUser) => {
          if (updatedUser) {
            return reply(updatedUser).code(200);
          }

          return reply(Boom.internal());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = resetUserPasswordRoute;
