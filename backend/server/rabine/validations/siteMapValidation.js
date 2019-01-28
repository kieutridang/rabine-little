const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const getSiteMapInfoRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const getSiteMapInfoResponseSchema = Joi.object({
  _id: Joi.objectId().required(),
  siteId: Joi.objectId().required(),
  layers: Joi.array().required().description('MeasurementLayers'),
  features: Joi.array().required().description('GeoJSON Features')
});

const putSiteMapInfoRequestSchema = Joi.object({
  layers: Joi.array().required().description('MeasurementLayers'),
  features: Joi.array().required().description('GeoJSON Features')
});

const putSiteMapInfoResponseSchema = Joi.object({
  layers: Joi.array().required().description('MeasurementLayers'),
  features: Joi.array().required().description('GeoJSON Features')
});

const getSitePhotosShareLinkRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const getSitePhotosShareLinkResponseSchema = Joi.object({
  shareLinkUrl: Joi.string().required()
});

const getSiteMapShareLinkRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const getSiteMapShareLinkResponseSchema = Joi.object({
  shareLinkUrl: Joi.string().required()
});

const getSiteMapWithTokenRequestSchema = Joi.object({
  token: Joi.string().required()
});

const getSiteMapWithTokenResponseSchema = Joi.object({
  orthoPhotos: Joi.array(),
  siteId: Joi.objectId().required(),
  layers: Joi.array().required().description('MeasurementLayers'),
  features: Joi.array().required().description('GeoJSON Features')
});

module.exports = {
  getSiteMapInfoRequestSchema,
  getSiteMapInfoResponseSchema,

  putSiteMapInfoRequestSchema,
  putSiteMapInfoResponseSchema,

  getSitePhotosShareLinkRequestSchema,
  getSitePhotosShareLinkResponseSchema,

  getSiteMapShareLinkRequestSchema,
  getSiteMapShareLinkResponseSchema,

  getSiteMapWithTokenRequestSchema,
  getSiteMapWithTokenResponseSchema
};
