const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const photoAnnotationSchema = Joi.object({
  photoId: Joi.objectId()
    .required()
    .description('Site area photo id')
    .example('5ab8933ced29ad0014246f0f'),
  title: Joi.string()
    .trim()
    .description('Annotation title')
    .example('Area 1'),
  index: Joi.number()
    .description('Index of annotation')
    .example(1),
  description: Joi.string()
    .trim()
    .description('Annotation description')
    .example('Area 1 description'),
  geojson: Joi.object()
    .description('GEO JSON Annotations')
});

const photoAnnotationResponseSchema = photoAnnotationSchema.keys({
  _id: Joi.objectId()
    .required()
    .description('annotation Id')
    .example('5aa657341a8d0566dc31e374')
});

const getAnnotationRequestSchema = Joi.object({
  photoId: Joi.objectId()
    .required()
    .description('photo Id')
    .example('5aa657341a8d0566dc31e374')
});

const getAnnotationResponseSchema = Joi.array()
  .items(getAnnotationRequestSchema)
  .required()
  .description('list of annotations');

const postAnnotationRequestSchema = getAnnotationRequestSchema;
const postAnnotationResonseSchema = photoAnnotationResponseSchema;

const putAnnotationRequestSchema = getAnnotationRequestSchema.keys({
  photoId: Joi.objectId()
    .required()
    .description('photo Id')
    .example('5aa657341a8d0566dc31e374'),
  annotationId: Joi.objectId()
    .required()
    .description('annotation id')
    .example('5aa657341a8d0566dc31e374')
});
const putAnnotationResonseSchema = photoAnnotationResponseSchema;

const deleteAnnotationRequestSchema = putAnnotationRequestSchema;
const deleteAnnotationResponseSchema = Joi.object({
  _id: Joi.objectId()
    .required()
    .description('annotation id')
    .example('5ab8933ced29ad0014246f0f')
});

module.exports = {
  photoAnnotationSchema,
  photoAnnotationResponseSchema,

  getAnnotationRequestSchema,
  getAnnotationResponseSchema,

  postAnnotationRequestSchema,
  postAnnotationResonseSchema,

  putAnnotationRequestSchema,
  putAnnotationResonseSchema,

  deleteAnnotationRequestSchema,
  deleteAnnotationResponseSchema
};
