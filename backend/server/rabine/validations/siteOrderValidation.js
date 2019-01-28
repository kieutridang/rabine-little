import Joi from 'joi';
import mongoose from 'mongoose';

import { SiteOrderSchema } from '~/schemas/SiteOrder';

const { ObjectId } = mongoose.Types;

Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const listOrdersRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const listOrdersResponseSchema = Joi.object({
  orders: Joi.array()
});

const getOrderRequestSchema = Joi.object({
  siteId: Joi.objectId().required(),
  _id: Joi.objectId().required()
});

const postOrdersRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const putOrdersRequestSchema = Joi.object({
  siteId: Joi.objectId().required(),
  _id: Joi.objectId().required()
});

const putOrdersPayloadSchema = Joi.object({
  service: Joi.object({
    type: Joi.string().required(),
    status: Joi.string().required()
  })
});

module.exports = {
  listOrdersRequestSchema,
  listOrdersResponseSchema,

  getOrderRequestSchema,
  getOrderResponseSchema: SiteOrderSchema,

  postOrdersRequestSchema,
  postOrdersResponseSchema: SiteOrderSchema,

  putOrdersRequestSchema,
  putOrdersPayloadSchema,
  putOrdersResponseSchema: SiteOrderSchema
};
