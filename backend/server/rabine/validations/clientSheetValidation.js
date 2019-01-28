const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;

Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const clientBidSheetSchema = Joi.object({
  id: Joi.objectId()
    .required()
    .description('generated Id')
    .example('5aa657341a8d0566dc31e374'),
  clientId: Joi.objectId()
    .description('Client Id')
    .example('5aa657341a8d0566dc31e371'),
  bidSheetData: Joi.any()
    .required()
    .description('data to use for the generated bid sheet')
    .example({ }),
  createdDate: Joi.date()
    .required()
    .description('client bid sheet created date')
    .example('2018-03-01T00:00:00.000Z')
});

const getClientBidSheetRequestSchema = Joi.object({
  clientId: Joi.objectId().required()
    .description('Client Id')
    .example('5aa657341a8d0566dc31e371')
});

const getClientBidSheetResponseSchema = clientBidSheetSchema;

const postClientBidSheetRequestSchema = Joi.object({
  bidSheetData: Joi.any()
    .required()
    .description('data to use for the generated bid sheet')
    .example({ })
});

const postClientBidSheetResponseSchema = clientBidSheetSchema;

module.exports = {
  getClientBidSheetRequestSchema,
  getClientBidSheetResponseSchema,

  postClientBidSheetRequestSchema,
  postClientBidSheetResponseSchema,
  clientBidSheetSchema
};
