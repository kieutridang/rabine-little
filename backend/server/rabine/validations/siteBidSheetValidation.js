const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);


const postBidSheetPhotoRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('Site Id')
    .example('5ad629b9b52e830014348943'),
  layerId: Joi.string().trim()
    .description('layer Id')
    .example('5ad629b9b52e830014348943')
});

const getSiteBidSheetPhotoRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('Site Id')
    .example('5ad629b9b52e830014348943')
});

const getSiteBidSheetPhotoResponseSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('Site Id')
    .example('5ad629b9b52e830014348943'),
  layerId: Joi.string()
    .description('layerId')
    .example('5aa657341a8d0566dc31e372'),
  bidSheetPhotoKey: Joi.string()
    .description('photo key')
    .example('bidsheet/102020'),
  bidSheetPhotoUrl: Joi.string()
    .description('photo url')
    .example('https://abc.img')
});


module.exports = {
  postBidSheetPhotoRequestSchema,
  getSiteBidSheetPhotoRequestSchema,
  getSiteBidSheetPhotoResponseSchema
};
