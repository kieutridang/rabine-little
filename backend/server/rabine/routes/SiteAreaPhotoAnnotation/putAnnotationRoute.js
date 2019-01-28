const Boom = require('boom');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;

const { photoAnnotationValidation } = require('../../validations');
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const putAreaPhotoAnnotationRoute = {
  method: 'PUT',
  path: '/api/photos/{photoId}/annotations/{annotationId}',
  config: {
    tags: ['api', 'area', 'photo', 'annotations'],
    description: 'PUT area photo annotation',
    notes: 'Put area photo annotation',
    auth: 'token',
    validate: {
      params: photoAnnotationValidation.putAnnotationRequestSchema,
      payload: photoAnnotationValidation.photoAnnotationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: photoAnnotationValidation.putAnnotationResonseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const annotationPayload = req.payload;
      const { annotationId } = req.params;
      const { areaPhotoAnnotation } = req.server;

      return areaPhotoAnnotation.update(annotationId, annotationPayload)
        .then((annotation) => {
          if (annotation) {
            return reply(annotation).code(200);
          }

          return reply(Boom.notFound());
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = putAreaPhotoAnnotationRoute;
