const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const userSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .description('Full name')
    .example('John'),

  username: Joi.string()
    .trim()
    .description('User username')
    .example('john@launchdeck.org'),

  role: Joi.string()
    .trim()
    .valid('normal', 'admin')
    .description('User role')
    .example('normal'),

  siteAssigned: Joi.number()
    .description('site assigned')
    .example('10')
});

const invitedUserSchema = userSchema.keys({
  userType: Joi.string()
    .trim()
    .description('User Type')
    .example('User'),
  company: Joi.string()
    .trim()
    .description('Company')
    .example('Rabine'),
  clientTitle: Joi.string()
    .trim()
    .description('clientTitle')
    .example('Developer')
});

const getUsersRequestSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .description('User full name')
    .example('filter by full name')
});

const getUsersResponseSchema = Joi.array()
  .items(userSchema)
  .description('get invited users response');

const getInvitedUsersRequestSchema = getUsersRequestSchema;
const getInvitedUsersResponseSchema = Joi.array()
  .items(invitedUserSchema)
  .description('Get invited user request');


const postInvitedUserRequestSchema = invitedUserSchema;
const postInvitedUserResponseSchema = invitedUserSchema;

module.exports = {
  userSchema,

  getUsersRequestSchema,
  getUsersResponseSchema,

  getInvitedUsersRequestSchema,
  getInvitedUsersResponseSchema,

  postInvitedUserRequestSchema,
  postInvitedUserResponseSchema
};
