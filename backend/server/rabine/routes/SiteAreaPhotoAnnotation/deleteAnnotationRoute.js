const Boom = require('boom');
const Joi = require('joi');

const { photoAnnotationValidation } = require('../../validations');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const deleteAreaPhotoAnnotationRoute = {
  method: 'DELETE',
  path: '/api/photos/{photoId}/annotations/{annotationId}',
  config: {
    tags: ['api', 'area', 'photo', 'annotations'],
    description: 'DELETE area photo annotation',
    notes: 'DELETE area photo annotation',
    auth: 'token',
    validate: {
      params: photoAnnotationValidation.deleteAnnotationRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: photoAnnotationValidation.deleteAnnotationResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { photoId, annotationId } = req.params;
      const { areaPhotoAnnotation } = req.server;

      return areaPhotoAnnotation.remove(annotationId, photoId)
        .then((response) => {
          return reply(response).code(200);
        })
        .catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};

module.exports = deleteAreaPhotoAnnotationRoute;
