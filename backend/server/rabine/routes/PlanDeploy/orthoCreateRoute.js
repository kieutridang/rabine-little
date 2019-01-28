const Boom = require('boom');

const { orthoPhotoValidation } = require('../../validations');

const orthoCreateRoute = {
  method: 'POST',
  path: '/api/plan/{planId}/ortho/photos',
  config: {
    tags: ['api', 'plan deploy'],
    description: 'add ortho photos to plan',
    notes: 'after imported to S3, these ortho photos will be associated with plan',
    validate: {
      params: orthoPhotoValidation.postOrthoPhotosParamSchema,
      payload: orthoPhotoValidation.postOrthoPhotosRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: orthoPhotoValidation.postOrthoPhotosResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { planId } = req.params;
      const photosRequest = req.payload;
      const { planDeploy } = req.server;

      return planDeploy
        .addPhotos(planId, photosRequest)
        .then((photos) => {
          if (photos) {
            return reply(photos).code(200);
          }

          return reply(Boom.notFound());

        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = orthoCreateRoute;
