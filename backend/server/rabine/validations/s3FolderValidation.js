const Joi = require('joi');

const listS3RequestSchema = Joi.object({
});

const listS3ResponseSchema = Joi.object({
  id: Joi.string()
    .description('folderId')
    .example('5aa657341a8d0566dc31e374'),

  name: Joi.string()
    .description('folder name')
    .example('rabine_wmdc6006_180322')
});


const getS3RequestSchema = Joi.object({
  name: Joi.string().trim()
    .description('Plan Deploy name')
    .example('filter by name'),
  all: Joi.boolean()
    .description('All plan deploy')
    .example(true)
});

module.exports = {
  getS3RequestSchema,
  listS3RequestSchema,
  listS3ResponseSchema
};
