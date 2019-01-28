const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const repairRepairCommentSchema = Joi.object({
  comment: Joi.string().allow(null)
    .description('Site repair comment')
    .example('Some is good')
});

const postSiteRepairCommentRequestSchema = repairRepairCommentSchema;
const postSharedSiteRepairCommentRequestSchema = repairRepairCommentSchema.keys({
  authorName: Joi.string().trim().required()
    .description('owner who comment')
    .example('Jim Cook')
});
const postSiteRepairCommentResponseSchema = repairRepairCommentSchema.keys({
  id: Joi.objectId().required()
    .description('activity Id')
    .example('5aa657341a8d0566dc31e374'),
  createdDate: Joi.date()
    .description('Drone created date')
    .example('2018-03-01T00:00:00.000Z')
});

const getSiteRepairCommentsRequestSchema = Joi.object({
  repairInstanceId: Joi.objectId().required()
    .description('repair Instance Id')
    .example('5aa657341a8d0566dc31e374')
});
const getSiteRepairCommentsResponseSchema = Joi.array().items(postSiteRepairCommentResponseSchema);

const getSiteRepairCommentRequestSchema = getSiteRepairCommentsRequestSchema.keys({
  commentId: Joi.objectId().required()
    .description('comment Id')
    .example('5aa657341a8d0566dc31e374')
});

const deleteSiteRepairCommentRequestSchema = getSiteRepairCommentsRequestSchema.keys({
  commentId: Joi.objectId().required()
    .description('comment Id')
    .example('5aa657341a8d0566dc31e374')
});

const deleteSiteRepairCommentResponseSchema = postSiteRepairCommentResponseSchema;

module.exports = {
  repairRepairCommentSchema,

  getSiteRepairCommentsRequestSchema,
  getSiteRepairCommentsResponseSchema,

  postSharedSiteRepairCommentRequestSchema,

  postSiteRepairCommentRequestSchema,
  postSiteRepairCommentResponseSchema,

  getSiteRepairCommentRequestSchema,

  deleteSiteRepairCommentRequestSchema,
  deleteSiteRepairCommentResponseSchema
};
