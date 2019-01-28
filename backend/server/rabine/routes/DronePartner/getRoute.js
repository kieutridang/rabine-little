const Boom = require('boom');

const { dronePartnerValidation: droneValidation } = require('../../validations');

const getDronePartnerInfoRoute = {
  method: 'GET',
  path: '/api/dronePartner/{dronePartnerId}',
  config: {
    tags: ['api', 'dronePartner'],
    description: 'Get dronePartner info',
    notes: 'Get dronePartner info',
    auth: 'token',
    validate: {
      params: droneValidation.getDronePartnerInfoRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: droneValidation.getDronePartnerInfoResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { dronePartnerId } = req.params;
      const { dronePartner } = req.server;

      return dronePartner
        .getById(dronePartnerId)
        .then((dronePartnerItem) => {
          if (dronePartnerItem) {
            return reply(dronePartnerItem).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getDronePartnerInfoRoute;
