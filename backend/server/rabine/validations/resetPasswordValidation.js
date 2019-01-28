const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const { userSchema } = require('./userValidation');

const resetPasswordRequestSchema = Joi.object({
  email: Joi.string()
    .trim()
    .required()
    .description('Email')
    .example('bobdylan@gmail.com')
});

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .trim()
    .required()
    .description('New password')
    .example('cc023faa52196cb72835e159cfa1802c98a926a74ba554698febbb3b529678d0'),

  resetToken: Joi.string()
    .trim()
    .required()
    .description('Password reset token that can be get from email link')
    .example('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QwMzA0QHlvcG1haWwuY29tIiwiZXhwaXJlVGltZSI6IjA4LzA3LzIwMTggMDI6MDE6MzkiLCJpYXQiOjE1MzA5NDY4OTl9.tPs4H6McgANbW09nNEb79Mp8hdZSwFeDA6br8J3ivz4')
});

const resetPasswordResponseSchema = userSchema;

module.exports = {
  resetPasswordRequestSchema,
  resetPasswordSchema,
  resetPasswordResponseSchema
};
