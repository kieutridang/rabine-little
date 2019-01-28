const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const videoItemSchema = Joi.object({
  title: Joi.string()
    .trim()
    .description('video title')
    .example('5XGFAbV.jpg'),
  url: Joi.string()
    .description('video url')
    .example('wmdc7024_sterlingil/Videos/Thermal_Videos/DJI_0084.mp4')
});

const videoItemResponseSchema = videoItemSchema.keys({
  id: Joi.objectId()
    .required()
    .description('video Id')
    .example('5aa657341a8d0566dc31e374'),
  fullUrl: Joi.string()
    .description('video url')
    .example('https://rabine-uplift-dev.s3.us-west-2.amazonaws.com/wmdc7024_sterlingil/Videos/Thermal_Videos/DJI_0085.mp4'),
  createdDate: Joi.date()
    .description('video created date')
    .example('2018-03-01T00:00:00.000Z')
});

const videoItemsResponseSchema = Joi.array()
  .items(videoItemResponseSchema)
  .description('array of video items');

const listVideoRequestSchema = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374'),
  areaName: Joi.string()
    .trim()
    .description('area name of the videos')
    .example('thermal')
});

const listVideoResponseSchema = Joi.object({
  siteId: Joi.objectId()
    .required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374'),
  areaName: Joi.string()
    .trim()
    .description('area name of the videos')
    .example('thermal'),
  videos: videoItemsResponseSchema
});

module.exports = {
  videoItemSchema,
  videoItemResponseSchema,
  videoItemsResponseSchema,

  listVideoRequestSchema,
  listVideoResponseSchema
};
