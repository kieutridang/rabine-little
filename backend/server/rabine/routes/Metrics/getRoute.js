const Boom = require('boom');
const { metricsValidation } = require('../../validations');

const getMetricsRoute = {
  method: 'GET',
  path: '/api/metrics',
  config: {
    tags: ['api', 'metrics'],
    description: 'Get metrics info',
    notes: 'Get metrics info',
    auth: 'token',
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: metricsValidation.getMetricsResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { site } = req.server;

      return site.getSiteMetrics().then((metrics) => {
        if (metrics) {
          return reply(metrics).code(200);
        }

        return reply(Boom.notFound());
      }).catch((err) => {
        return reply(Boom.badRequest(err.message));
      });
    }
  }
};

module.exports = getMetricsRoute;
