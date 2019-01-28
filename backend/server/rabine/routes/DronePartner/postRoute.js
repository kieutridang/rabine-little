const Boom = require('boom');

const { dronePartnerValidation } = require('../../validations');

const getDronePartnerInfoRoute = {
  method: 'POST',
  path: '/api/dronePartner',
  config: {
    tags: ['api', 'dronePartner'],
    description: 'Add new dronePartner',
    auth: 'token',
    notes: 'post new dronePartner',
    validate: {
      payload: dronePartnerValidation.postDronePartnerRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: dronePartnerValidation.postDronePartnerResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const dronePartnerRequest = req.payload;
      const { dronePartner } = req.server;

      return dronePartner.create(dronePartnerRequest)
        .then((dronePartnerItem) => {
          if (dronePartnerItem) {
            return reply(dronePartnerItem).code(200);
          }

          return reply(Boom.internal());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getDronePartnerInfoRoute;
