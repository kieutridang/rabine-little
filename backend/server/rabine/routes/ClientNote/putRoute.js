const Boom = require('boom');

const { clientNoteValidation, clientValidation } = require('../../validations');

const putClientNoteRoute = {
  method: 'PUT',
  path: '/api/client/{clientId}/note',
  config: {
    tags: ['api', 'client'],
    description: 'PUT client note',
    auth: 'token',
    notes: 'Put client note',
    validate: {
      params: clientValidation.getClientInfoRequestSchema,
      payload: clientNoteValidation.putNoteRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: clientNoteValidation.putNoteResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { payload, params } = req;
      const { clientNote } = req.server;

      const clientNoteRequest = {
        ...payload,
        clientId: params.clientId
      };
      return clientNote
      .create(clientNoteRequest)
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

module.exports = putClientNoteRoute;
