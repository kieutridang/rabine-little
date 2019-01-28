import Joi from 'joi';
import mongoose from 'mongoose';

import { SiteOrderNoteSchema } from '~/schemas/SiteOrderNote';

const { ObjectId } = mongoose.Types;

Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const listOrderNotesRequestSchema = Joi.object({
  siteId: Joi.objectId().required(),
  orderId: Joi.objectId().required()
});

const listOrderNotesResponseSchema = Joi.object({
  notes: Joi.array()
});

const postOrderNotesRequestSchema = Joi.object({
  siteId: Joi.objectId().required(),
  orderId: Joi.objectId().required(),
  content: Joi.string().required()
});

const postOrderNotesResponseSchema = SiteOrderNoteSchema;

module.exports = {
  listOrderNotesRequestSchema,
  listOrderNotesResponseSchema,

  postOrderNotesRequestSchema,
  postOrderNotesResponseSchema
};
