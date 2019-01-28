const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const metricsResponseSchema = Joi.object({
  totalOrders: Joi.number()
    .description('The total number of sites in the platform')
    .example('126'),
  openOrders: Joi.number()
    .description('Total orders - orders completed')
    .example('89'),
  totalRevenue: Joi.number()
    .description('The sum of the cost from all sites')
    .example('304450'),
  ordersCompleted: Joi.number()
    .description('The total number of order that have reached the last step of the stepper status: Delivered_To_Client')
    .example('102')
});

const getMetricsResponseSchema = Joi.array().items(metricsResponseSchema);

module.exports = {
  metricsResponseSchema,
  getMetricsResponseSchema
};
