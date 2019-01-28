const Boom = require('boom');

const { clientNoteValidation: noteValidation } = require('../../validations');

const getClientNoteRoute = {
  method: 'GET',
  path: '/api/client/{clientId}/note/{noteId}',
  config: {
    tags: ['api', 'client'],
    description: 'Get clientNote info',
    notes: 'Get clientNote info',
    auth: 'token',
    validate: {
      params: noteValidation.getNoteRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: noteValidation.getNoteResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { noteId, clientId } = req.params;
      const { clientNote } = req.server;

      return clientNote
        .getById(noteId, clientId)
        .then((note) => {
          if (note) {
            return reply(note).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getClientNoteRoute;
