const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const { latLngBoxSchema } = require('./commonValidation');

const orthoPhotoSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required()
    .description('photo title')
    .example('5XGFAbV.jpg'),
  planId: Joi.objectId()
    .required()
    .description('Site area id')
    .example('5ab8933ced29ad0014246f0f'),
  url: Joi.string()
    .required()
    .description('photo url')
    .example('https://i.imgur.com/5XGFAbV.jpg'),
  latLngBox: latLngBoxSchema
    .required()
    .description('LatLngBox (east, west, south, north)')
    .example({
      north: 41.9990486906,
      west: -87.9692451519,
      south: -41.92,
      east: -86.9692451519
    }),
  taken: Joi.date()
    .required()
    .description('photo taken date')
    .example('2018-03-01T00:00:00.000Z'),
  kmlOrigin: Joi.string()
    .required()
    .description('photo tfw origin file')
    .example(`<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://earth.google.com/kml/2.2">
  <Document>
      <GroundOverlay>
        <Icon>
          <href>WoodDale115mm_Orthomosaic_export_TueApr10.tif</href>
        </Icon>
        <LatLonBox>
          <north>41.9791444444</north>
          <south>41.978125</south>
          <east>-87.9678722222</east>
          <west>-87.9695888889</west>
        </LatLonBox>
        <name>WoodDale115mm_Orthomosaic_export_TueApr10.tif</name>
        <drawOrder>1</drawOrder>
      </GroundOverlay>
  </Document>
</kml>`)
});

const orthoPhotoResponseSchema = orthoPhotoSchema.keys({
  id: Joi.objectId()
    .required()
    .description('photo Id')
    .example('5aa657341a8d0566dc31e374'),
  createdDate: Joi.date()
    .description('Photo created date')
    .example('2018-03-01T00:00:00.000Z')
});

const postOrthoPhotosRequestSchema = Joi.array().items(orthoPhotoSchema).required();
const postOrthoPhotosResponseSchema = Joi.array().items(orthoPhotoResponseSchema).required();

const postOrthoPhotosParamSchema = Joi.object({
  planId: Joi.objectId()
  .required()
  .description('planId')
  .example('5aa657341a8d0566dc31e374')
});

module.exports = {
  postOrthoPhotosParamSchema,

  postOrthoPhotosRequestSchema,
  postOrthoPhotosResponseSchema,
  orthoPhotoResponseSchema
};
