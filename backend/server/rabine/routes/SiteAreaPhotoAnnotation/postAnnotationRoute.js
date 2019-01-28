const Boom = require('boom');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
const { photoAnnotationValidation } = require('../../validations');
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

module.exports = {
  method: 'POST',
  path: '/api/photos/{photoId}/annotations',
  config: {
    tags: ['api', 'area', 'photo', 'annotations'],
    description: 'POST area photo annotation',
    notes: 'POST area photo annotation',
    auth: 'token',
    validate: {
      params: photoAnnotationValidation.postAnnotationRequestSchema,
      payload: photoAnnotationValidation.photoAnnotationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: photoAnnotationValidation.photoAnnotationResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { photoId } = req.params;
      const annotationPayload = req.payload;
      const { areaPhotoAnnotation } = req.server;

      return areaPhotoAnnotation.create(photoId, annotationPayload)
        .then((annotation) => {
          if (annotation) {
            return reply(annotation).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
