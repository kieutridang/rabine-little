const Joi = require('joi');

const loginRequestSchema = Joi.object({
  username: Joi.string().trim().required()
    .description('user\'s name')
    .example('bobdylan@gmail.com'),
  password: Joi.string().trim().required()
    .description('user\'s password')
    .example('cc023faa52196cb72835e159cfa1802c98a926a74ba554698febbb3b529678d0')
});


const loginResponseSchema = Joi.object({
  username: Joi.string().trim().required()
  .description('user\'s name')
  .example('bobdylan@gmail.com'),

  fullName: Joi.string().trim().required()
  .description('user`s fullname')
  .example('Bob Dylan'),

  token: Joi.string().trim().required()
  .description('user`s session')
  .example('cc023faa52196cb72835e159cfa1802c98a926a74ba554698febbb3b529678d0')
});

module.exports = {
  loginRequestSchema,
  loginResponseSchema
};
