const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const siteRepairRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('SiteId')
    .example('5aa657341a8d0566dc31e374'),
  title: Joi.string().required()
    .description('site repair title')
    .example('2\' Asphalt Mill & Overlay'),
  year: Joi.string()
    .description('year of site repair')
    .example('2018'),
  unit: Joi.string().required()
    .description('site repair unit')
    .example('SF'),
  unitPrice: Joi.number()
    .description('Manually input price for this site repair')
    .example('0.12'),
  qty: Joi.string()
    .description('quantity of site repair')
    .example('100'),
  zone: Joi.string()
    .description('site repair zone')
    .example('2018'),
  type: Joi.string().required()
    .description('site repair type')
    .example('Repair')
    .default('Repair')
});

const siteRepairResponseSchema = siteRepairRequestSchema.keys({
  id: Joi.objectId().required()
    .description('id')
    .example('5aa657341a8d0566dc31e374')
});


const repairInputRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('feature Id')
    .example('5aa657341a8d0566dc31e371'),
  featureId: Joi.string().required()
    .description('feature Id')
    .example('5aa657341a8d0566dc31e374'),
  unitPrice: Joi.number()
    .description('price')
    .example('100'),
  qty: Joi.number()
  .description('numner of items')
  .example('10')
});

const repairInputResponseSchema = repairInputRequestSchema.keys({
  id: Joi.objectId().required()
    .description('id')
    .example('5aa657341a8d0566dc31e374'),
  total: Joi.number()
    .description('total')
    .example('10000'),
  createdDate: Joi.date().required()
    .description('created date')
    .example('2018-03-01T00:00:00.000Z')
});

const repairExportRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374'),
  type: Joi.string()
    .description('export type')
    .valid('repairs', 'zone')
    .example('repairs')
});

const repairRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374')
});

const repairExportBySiteIdsSchema = Joi.object().keys({
  siteIds: Joi.array().items(Joi.objectId()).optional()
});

const repairItemSchema = Joi.object({
  id: Joi.objectId().required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374'),
  repairType: Joi.string()
    .description('Type of repair')
    .example('Maintenance'),
  title: Joi.string()
    .description('site title')
    .example('Asphalt Mill & Overlay'),
  year: Joi.number().integer()
    .description('Year')
    .example('2019'),
  unit: Joi.string()
    .description('repair unit')
    .example('SF'),
  qty: Joi.number()
    .description('quantity')
    .example('700'),
  unitPrice: Joi.number()
    .description('unitPrice')
    .example('700'),
  total: Joi.number()
    .description('total')
    .example('700'),
  zone: Joi.string()
    .description('zone')
    .example('2017'),
  isManually: Joi.boolean()
    .description('repair is manually')
    .example(true)
});

const repairResponseSchema = Joi.array().items(repairItemSchema)
  .description('repairResponseSchema')
  .example([
    {
      id: '5ae7293d6c5ada00148bc16c',
      title: '2\' Asphalt Mill & Overlay',
      year: '2021',
      unit: 'SF',
      qty: '700',
      zone: 'Rabine site'
    },
    {
      id: '5ae73c236ca1250014340a30',
      title: '4\' Asphalt Remove & Replace',
      year: '2019',
      unit: 'SF',
      qty: '700',
      zone: '2019'
    },
    {
      id: '5ae73c236ca1250014340a2d',
      title: '4\' Asphalt Remove & Replace',
      year: '2019',
      unit: 'SF',
      qty: '700',
      zone: '2019'
    },
    {
      id: '5ae73c236ca1250014340a2a',
      title: '4\' Asphalt Remove & Replace',
      year: '2019',
      unit: 'SF',
      qty: '700',
      zone: '2019'
    },
    {
      id: '5ae73c236ca1250014340a27',
      title: '4\' Asphalt Remove & Replace',
      year: '2019',
      unit: 'SF',
      qty: '700',
      zone: 'Asphalt'
    },
    {
      id: '5ae73c236ca1250014340a21',
      title: '4\' Asphalt Remove & Replace',
      year: '2020',
      unit: 'SF',
      qty: '700',
      zone: 'Asphalt Mill'
    }]);

const zoneItemSchema = Joi.object({
  id: Joi.objectId().required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374'),
  title: Joi.string()
    .description('site title')
    .example('Asphalt Mill & Overlay'),
  area: Joi.number()
    .description('area')
    .example('900'),
  surfaceType: Joi.string()
    .description('Surface Type')
    .example('Asphalt'),
  trafficType: Joi.string()
    .description('Traffic Type')
    .example('Employee Parking')
});

const zoneRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('site Id')
    .example('5aa657341a8d0566dc31e374')
});

const zoneResponseSchema = Joi.array().items(zoneItemSchema)
  .description('zone map response schema')
  .example([
    {
      id: '5ae7293d6c5ada00148bc16c',
      title: '2\' Asphalt Mill & Overlay',
      area: '700'
    },
    {
      id: '5ae73c236ca1250014340a30',
      title: '4\' Asphalt Remove & Replace',
      area: '9000'
    }
  ]);

const zoneOptionResponseSchema = Joi.object({
  id: Joi.objectId().required()
      .description('site Id')
      .example('5aa657341a8d0566dc31e374'),
  title: Joi.string()
      .description('site title')
      .example('Asphalt Mill & Overlay')
});

const deleteRepairRequestSchema = Joi.object({
  id: Joi.objectId().required()
    .description('repair Id')
    .example('5aa657341a8d0566dc31e374')
});

const deleteRepairResponseSchema = Joi.object({
  id: Joi.objectId().required()
    .description('repair Id')
    .example('5aa657341a8d0566dc31e374')
});


const updateSiteRepairRequestSchema = Joi.object({
  id: Joi.objectId().required()
    .description('id')
    .example('5aa657341a8d0566dc31e374'),
  siteId: Joi.objectId().required()
    .description('SiteId')
    .example('5aa657341a8d0566dc31e374'),
  title: Joi.string().required()
    .description('site repair title')
    .example('2\' Asphalt Mill & Overlay'),
  year: Joi.string()
    .description('year of site repair')
    .example('2018'),
  unit: Joi.string().required()
    .description('site repair unit')
    .example('SF'),
  unitPrice: Joi.number()
    .description('Manually input price for this site repair')
    .example('0.12'),
  qty: Joi.string()
    .description('quantity of site repair')
    .example('100'),
  zone: Joi.string()
    .description('site repair zone')
    .example('2018'),
  type: Joi.string().required()
    .description('site repair type')
    .example('Repair')
    .default('Repair')
});

const updateSiteRepairResponseSchema = updateSiteRepairRequestSchema;

const getRepairCropUploadURLResponseSchema = Joi.object({
  signedUrl: Joi.string().required(),
  readUrl: Joi.string().required()
});

const getRepairCropUploadURLRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('SiteId')
    .example('5aa657341a8d0566dc31e374'),
  repairName: Joi.string()
    .required()
    .description('repair name')
    .example('5aa657341a8d0566dc31e374')
});

const setCropUploadedURLRequestSchema = Joi.object({
  siteId: Joi.objectId().required()
    .description('SiteId')
    .example('5aa657341a8d0566dc31e374'),
  repairName: Joi.string()
    .required()
    .description('repair name')
    .example('5aa657341a8d0566dc31e374')
});

const setCropUploadedURLResponseSchema = Joi.object({
  updated: Joi.boolean()
});

module.exports = {
  repairExportRequestSchema,
  repairRequestSchema,
  repairResponseSchema,
  repairInputRequestSchema,
  repairInputResponseSchema,
  zoneRequestSchema,
  zoneResponseSchema,

  zoneOptionResponseSchema,

  siteRepairRequestSchema,
  siteRepairResponseSchema,

  repairExportBySiteIdsSchema,

  deleteRepairRequestSchema,
  deleteRepairResponseSchema,

  updateSiteRepairRequestSchema,
  updateSiteRepairResponseSchema,

  getRepairCropUploadURLRequestSchema,
  getRepairCropUploadURLResponseSchema,

  setCropUploadedURLRequestSchema,
  setCropUploadedURLResponseSchema
};
