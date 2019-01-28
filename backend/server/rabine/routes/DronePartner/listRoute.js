const Boom = require('boom');

const { dronePartnerValidation } = require('../../validations');

const listDronePartnerRoute = {
  method: 'GET',
  path: '/api/dronePartner',
  config: {
    tags: ['api', 'dronePartner'],
    description: 'Get dronePartners',
    auth: 'token',
    notes: 'Get dronePartners',
    validate: {
      query: dronePartnerValidation.getDronePartnersRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: dronePartnerValidation.getDronePartnersResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const filter = req.query;
      const { dronePartner } = req.server;

      return dronePartner
        .list(filter)
        .then((dronePartners) => {
          return reply(dronePartners).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = listDronePartnerRoute;
