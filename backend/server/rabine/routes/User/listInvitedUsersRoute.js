import { userValidation } from '../../validations';

const Boom = require('boom');


const listInvitedUsersRoute = {
  method: 'GET',
  path: '/api/invite-user',
  config: {
    tags: ['api', 'invite-user'],
    description: 'get invited users',
    notes: 'get invited users',
    auth: 'token',
    validate: {
      query: userValidation.getInvitedUsersRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: userValidation.getInvitedUsersResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const filter = req.query;
      const { user } = req.server;
      const { role } = req.auth.credentials;

      if (role === 'admin') {
        return user.listInvitedUser(filter)
          .then(users => reply(users).code(200))
          .catch(err => reply(Boom.badRequest(err.message)));
      }

      return reply(Boom.unauthorized());
    }
  }
};

module.exports = listInvitedUsersRoute;
