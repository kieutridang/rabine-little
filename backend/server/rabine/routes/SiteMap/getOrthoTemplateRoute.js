const Boom = require('boom');

const { siteDesignValidation, orthoPhotoValidation } = require('../../validations');

const jwtVerify = require('../../../utils/jwtVerify');

const getOrthoTemplateRoute = {
  method: 'GET',
  path: '/api/site/{siteId}/map/ortho',
  config: {
    tags: ['api', 'site'],
    description: 'Get site map ortho photo',
    notes: 'Get photo of site map',
    auth: {
      strategies: ['token'],
      mode: 'try'
    },
    validate: {
      params: siteDesignValidation.getSiteDesignInfoRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: orthoPhotoValidation.orthoPhotoResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: async (req, reply) => {
      const { token } = req.query;
      const { siteId } = req.params;
      const { site } = req.server;

      const userId = req.auth.credentials ? req.auth.credentials._id : null;

      if (!userId) {
        if (!token) {
          throw new Error('Unauthorized');
        }

        const decoded = await jwtVerify(token);

        if (decoded && decoded.data.siteId.toString() !== siteId.toString()) {
          throw new Error('Mismatch');
        }
      }

      return site.Map.getOrthoTemplate(siteId)
        .then((response) => {
          if (response) {
            return reply(response).code(200);
          }

          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = getOrthoTemplateRoute;
