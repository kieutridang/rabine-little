const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const { siteSchema } = require('./siteValidation');
const { responseActivityItemSchema } = require('./siteActivityValidation');

const getSiteDesignInfoRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
});

const getSiteDesignInfoResponseSchema = siteSchema.keys({
  dronePartnerName: Joi.string().trim().required()
  .description('MIT Drone')
  .example('MIT Drone Partner'),

  clientName: Joi.string().trim().required()
  .description('Client name')
  .example('Walmart San Jose'),

  activities: Joi.array().items(responseActivityItemSchema).required()
  .description('Activities of Site design')
  .example([{
    id: '5aa657341a8d0566dc31e371',
    siteId: '5aa657341a8d0566dc31e374',
    title: 'New_Order',
    creator: 'Peter',
    createdDate: '2018-03-01T00:00:00.000Z',
    newStatus: 'New_Order',
    type: 'status_changed'
  }, {
    id: '5aa657341a8d0566dc31e372',
    siteId: '5aa657341a8d0566dc31e374',
    title: 'New_Order',
    creator: 'Hien Phan',
    createdDate: '2018-03-01T00:00:00.000Z',
    notes: 'Maybe you`ve heard these difference marketing terms. But let me clarify again.',
    type: 'comment'
  }])
});

module.exports = {
  getSiteDesignInfoRequestSchema,
  getSiteDesignInfoResponseSchema
};
