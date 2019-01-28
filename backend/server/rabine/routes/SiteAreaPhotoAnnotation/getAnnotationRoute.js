const Boom = require('boom');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;

const { photoAnnotationValidation } = require('../../validations');
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

module.exports = {
  method: 'GET',
  path: '/api/photos/{photoId}/annotations',
  config: {
    tags: ['api', 'area', 'photo', 'annotations'],
    description: 'GET area photo`s annotations',
    notes: 'GET area photo\'s annotations',
    auth: 'token',
    validate: {
      params: photoAnnotationValidation.getAnnotationRequestSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: photoAnnotationValidation.getAnnotationResponseSchema
          },
          404: { description: 'Not Found', schema: {} },
          500: { description: 'Internal Error', schema: {} }
        }
      }
    },
    handler: (req, reply) => {
      const { photoId } = req.params;
      const { areaPhotoAnnotation } = req.server;

      return areaPhotoAnnotation.getAnnotationsOfPhoto(photoId)
        .then((annotations) => {
          if (annotations) {
            return reply(annotations).code(200);
          }

          return reply(Boom.notFound());
        }).catch((err) => {
          return reply(Boom.badRequest(err.message));
        });
    }
  }
};
