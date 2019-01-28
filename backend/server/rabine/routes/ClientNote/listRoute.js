const Boom = require('boom');

const { clientNoteValidation: noteValidation } = require('../../validations');

const getClientNotesRoute = {
  method: 'GET',
  path: '/api/client/{clientId}/note',
  config: {
    tags: ['api', 'client'],
    description: 'Get clientNote info',
    notes: 'Get clientNote info',
    auth: 'token',
    validate: {
      params: noteValidation.getNotesRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: noteValidation.getNotesResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { clientId } = req.params;
      const { clientNote } = req.server;

      return clientNote
      .list(clientId)
      .then((notes) => {
        if (notes) {
          return reply(notes).code(200);
        }

        return reply(Boom.notFound());

      })
      .catch((err) => {
        return reply(Boom.badRequest(err.message));
      });
    }
  }
};

module.exports = getClientNotesRoute;
