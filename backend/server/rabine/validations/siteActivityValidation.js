const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const { ActivityType } = require('../constants');

const activityItemSchema = Joi.object({
  title: Joi.string().trim()
    .description('activity title')
    .example('Order Created'),

  creator: Joi.string().trim().required()
    .description('owner who changed the status')
    .example('Jim Cook'),

  notes: Joi.string().allow(null)
    .description('notes for this activity')
    .example('Drone deployed finish on that site.'),

  oldStatus: Joi.string()
  .valid(
    'New_Order',
    'Sent_For_Imagery_Capture',
    'Imagery_Capture_Complete',
    'In_Review_Zone_Map',
    'In_Review_Scope',
    'QC',
    'Transferred_To_Client_Portal',
    'Delivered_To_Client'
  )
    .description('status of this activity')
    .example('New_Order'),

  newStatus: Joi.string()
    .valid(
      'New_Order',
      'Sent_For_Imagery_Capture',
      'Imagery_Capture_Complete',
      'In_Review_Zone_Map',
      'In_Review_Scope',
      'QC',
      'Transferred_To_Client_Portal',
      'Delivered_To_Client'
    )
    .description('status of this activity')
    .example('New_Order'),

  type: Joi.string().trim().required()
    .description('activity type')
    .valid(ActivityType.StatusChanged, ActivityType.Comment)
    .example('status_changed')
});

const responseActivityItemSchema = activityItemSchema.keys({
  id: Joi.objectId().required()
    .description('activity Id')
    .example('5aa657341a8d0566dc31e374'),
  createdDate: Joi.date()
    .description('Drone created date')
    .example('2018-03-01T00:00:00.000Z'),
  siteId: Joi.objectId().required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374')
});

const putActivityRequestSchema = Joi.object({
  title: Joi.string().trim()
    .description('activity title')
    .example('Order Created'),

  notes: Joi.string().allow(null)
    .description('notes for this activity')
    .example('Drone deployed finish on that site.'),

  oldStatus: Joi.string()
    .valid(
      'New_Order',
      'Sent_For_Imagery_Capture',
      'Imagery_Capture_Complete',
      'In_Review_Zone_Map',
      'In_Review_Scope',
      'QC',
      'Transferred_To_Client_Portal',
      'Delivered_To_Client'
    )
    .description('status of this activity')
    .example('New_Order'),

  newStatus: Joi.string()
  .valid(
    'New_Order',
    'Sent_For_Imagery_Capture',
    'Imagery_Capture_Complete',
    'In_Review_Zone_Map',
    'In_Review_Scope',
    'QC',
    'Transferred_To_Client_Portal',
    'Delivered_To_Client'
  )
    .description('status of this activity')
    .example('New_Order'),

  type: Joi.string().trim().required()
    .description('activity type')
    .valid(ActivityType.StatusChanged, ActivityType.Comment)
    .example('status_changed')
});

const putActivityResponseSchema = responseActivityItemSchema;

const getActivitiesRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374')
});
const getActivitiesResponseSchema = Joi.array().items(responseActivityItemSchema);

const getActivityRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e375'),
  activity: Joi.objectId().required()
    .description('activity Id')
    .example('5aa657341a8d0566dc31e374')
});

const getActivityResponseSchema = responseActivityItemSchema;

module.exports = {
  activityItemSchema,
  responseActivityItemSchema,

  putActivityRequestSchema,
  putActivityResponseSchema,

  getActivitiesRequestSchema,
  getActivitiesResponseSchema,

  getActivityRequestSchema,
  getActivityResponseSchema
};
