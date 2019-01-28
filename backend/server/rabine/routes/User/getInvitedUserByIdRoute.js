const Boom = require('boom');

const { userValidation } = require('../../validations');

const getInvitedUserByIdRoute = {
  method: 'GET',
  path: '/api/invite-user/{id}',
  config: {
    tags: ['api', 'invite-user-id'],
    description: 'get invited user by id',
    notes: 'get invited user by id',
    validate: {
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: userValidation.getUsersResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const params = req.params || {};
      const { user } = req.server;

      return user.listInvitedUser(params, true)
        .then(u => reply(u).code(200))
        .catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = getInvitedUserByIdRoute;
