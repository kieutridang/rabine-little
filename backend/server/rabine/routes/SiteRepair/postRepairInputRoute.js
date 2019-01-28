const Boom = require('boom');
const { siteRepairValidation } = require('../../validations');

const postRepairInputRoute = {
  method: 'POST',
  path: '/api/repair/price',
  config: {
    tags: ['api', 'repair', 'input'],
    description: 'Get repair input',
    notes: 'Get repair input',
    validate: {
      payload: siteRepairValidation.repairInputRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: siteRepairValidation.repairInputResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { siteId, featureId, unitPrice, qty } = req.payload;
      const { site } = req.server;
      const inputPrice = { siteId, featureId, unitPrice, qty };

      return site.Repair.updateRepairInputPrice(inputPrice)
        .then((price) => {
          if (price) {
            return reply(price).code(200);
          }

          return reply(Boom.notFound());
        }).catch(err => reply(Boom.badRequest(err.message)));
    }
  }
};

module.exports = postRepairInputRoute;
