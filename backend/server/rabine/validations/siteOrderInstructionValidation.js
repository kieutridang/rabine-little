import Joi from 'joi';
import mongoose from 'mongoose';

import { SiteOrderNoteSchema } from '~/schemas/SiteOrderNote';

const { ObjectId } = mongoose.Types;

Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const listOrderInstructionsRequestSchema = Joi.object({
  siteId: Joi.objectId().required(),
  orderId: Joi.objectId().required()
});

const listOrderInstructionsResponseSchema = Joi.object({
  instructions: Joi.array()
});

const listOrderActivityRequestSchema = Joi.object({
  siteId: Joi.objectId().required(),
  orderId: Joi.objectId().required()
});

const listOrderActivityResponseSchema = Joi.object({
  activity: Joi.array()
});

const postOrderInstructionsRequestSchema = Joi.object({
  siteId: Joi.objectId().required(),
  orderId: Joi.objectId().required(),
  email: Joi.string().required(),
  deadline: Joi.string().required(),
  content: Joi.string().required(),
  screenshotURL: Joi.string().required(),
  fileURL: Joi.string()
});

const postOrderInstructionsResponseSchema = SiteOrderNoteSchema;

const putOrderInstructionsSendResponseSchema = Joi.object({
  isSent: Joi.boolean().required(),
  sentAt: Joi.string().required()
});

const getSignedURLFileRequestSchema = Joi.object({
  fileName: Joi.string().required(),
  fileType: Joi.string().required()
});

const getSignedURLFileResponseSchema = Joi.object({
  signedURL: Joi.string().required(),
  publicURL: Joi.string().required()
});

const getSignedURLScreenshotRequestSchema = Joi.object({
  fileName: Joi.string().required(),
  fileType: Joi.string().required()
});

const getSignedURLScreenshotResponseSchema = Joi.object({
  signedURL: Joi.string().required(),
  publicURL: Joi.string().required()
});

module.exports = {
  listOrderInstructionsRequestSchema,
  listOrderInstructionsResponseSchema,

  listOrderActivityRequestSchema,
  listOrderActivityResponseSchema,

  postOrderInstructionsRequestSchema,
  postOrderInstructionsResponseSchema,

  putOrderInstructionsSendResponseSchema,

  getSignedURLFileRequestSchema,
  getSignedURLFileResponseSchema,
  getSignedURLScreenshotRequestSchema,
  getSignedURLScreenshotResponseSchema
};
