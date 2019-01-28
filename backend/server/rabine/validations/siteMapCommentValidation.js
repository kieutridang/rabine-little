const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const siteMapCommentSchema = Joi.object({
  comment: Joi.string().allow(null)
    .description('Site map comment')
    .example('Some is good')
});

const postSiteMapCommentRequestSchema = siteMapCommentSchema;
const postSharedSiteMapCommentRequestSchema = siteMapCommentSchema.keys({
  authorName: Joi.string().trim().required()
    .description('owner who comment')
    .example('Jim Cook')
});
const postSiteMapCommentResponseSchema = siteMapCommentSchema.keys({
  id: Joi.objectId().required()
    .description('activity Id')
    .example('5aa657341a8d0566dc31e374'),
  createdDate: Joi.date()
    .description('Drone created date')
    .example('2018-03-01T00:00:00.000Z')
});

const getSiteMapCommentsRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374')
});
const getSiteMapCommentsResponseSchema = Joi.array().items(postSiteMapCommentResponseSchema);

const getSiteMapCommentRequestSchema = getSiteMapCommentsRequestSchema.keys({
  commentId: Joi.objectId().required()
    .description('comment Id')
    .example('5aa657341a8d0566dc31e374')
});

const deleteSiteMapCommentRequestSchema = getSiteMapCommentsRequestSchema.keys({
  commentId: Joi.objectId().required()
    .description('comment Id')
    .example('5aa657341a8d0566dc31e374')
});

const deleteSiteMapCommentResponseSchema = postSiteMapCommentResponseSchema;

module.exports = {
  siteMapCommentSchema,

  getSiteMapCommentsRequestSchema,
  getSiteMapCommentsResponseSchema,

  postSharedSiteMapCommentRequestSchema,

  postSiteMapCommentRequestSchema,
  postSiteMapCommentResponseSchema,

  getSiteMapCommentRequestSchema,

  deleteSiteMapCommentRequestSchema,
  deleteSiteMapCommentResponseSchema
};
