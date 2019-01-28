const Joi = require('joi');

const registerRequestSchema = Joi.object({
  username: Joi.string().trim().required()
    .description('user\'s name')
    .example('bobdylan@gmail.com'),
  password: Joi.string().trim().required()
    .description('user\'s password')
    .example('cc023faa52196cb72835e159cfa1802c98a926a74ba554698febbb3b529678d0'),
  fullName: Joi.string().trim().required()
  .description('user`s fullname')
  .example('Bob Dylan')
});


const registerResponseSchema = Joi.object({
  username: Joi.string().trim().required()
  .description('user\'s name')
  .example('bobdylan@gmail.com'),

  fullName: Joi.string().trim().required()
  .description('user`s fullname')
  .example('Bob Dylan'),

  sessionId: Joi.string().trim().required()
  .description('user`s session')
  .example('cc023faa52196cb72835e159cfa1802c98a926a74ba554698febbb3b529678d0')
});

module.exports = {
  registerRequestSchema,
  registerResponseSchema
};
