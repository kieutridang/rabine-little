const Joi = require('joi');

const syncRequestSchema = Joi.object({
  folder: Joi.string()
    .required()
    .description('folder name')
    .example('ravine_wmdc6071_180326'),
  siteId: Joi.objectId()
    .required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374')
});

const syncResponseSchema = Joi.object({
  command: Joi.string()
    .description('command')
    .example('aws s3 cp s3://upliftdata-rabine/ s3://rabine-uplift/'),
  error: Joi.string()
    .description('error')
    .example('error message'),
  raw: Joi.string()
    .description('raw text')
    .example('Completed copying 323 file'),
  object: Joi.any()
    .description('object return')
    .example({})
});

const getS3InfoRequestSchema = Joi.object({
  folder: Joi.string().required()
    .description('folder name')
    .example('ravine_wmdc6071_180326')
});


const getS3InfoResponseSchema = Joi.object({
  command: Joi.string()
    .description('command')
    .example('aws s3 cp s3://upliftdata-rabine/ s3://rabine-uplift/'),
  error: Joi.string()
    .description('error')
    .example('error message'),
  raw: Joi.string()
    .description('raw text')
    .example('Completed copying 323 file'),
  object: Joi.any()
    .description('object return')
    .example({})
});

module.exports = {
  syncRequestSchema,
  syncResponseSchema,
  getS3InfoRequestSchema,
  getS3InfoResponseSchema
};
