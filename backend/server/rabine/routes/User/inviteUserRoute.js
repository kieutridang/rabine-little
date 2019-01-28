const Boom = require('boom');

const { userValidation } = require('../../validations');

const inviteUserRoute = {
  method: 'POST',
  path: '/api/invite-user',
  config: {
    tags: ['api', 'invite-user'],
    description: 'Invite new user',
    notes: 'post new user',
    auth: 'token',
    validate: {
      payload: userValidation.postInvitedUserRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: userValidation.postInvitedUserResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const userRequest = req.payload;
      const { user } = req.server;

      return user.create(userRequest)
        .then((savedUser) => {
          if (savedUser) {
            return reply(savedUser).code(200);
          }

          return reply(Boom.internal());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = inviteUserRoute;
