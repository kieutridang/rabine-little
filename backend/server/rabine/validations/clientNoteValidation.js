const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectId);

const noteItemSchema = Joi.object({
  client: Joi.string().trim().required()
    .description('owner who create the note')
    .example('Jim Cook'),

  notes: Joi.string().allow(null)
    .description('notes for this client')
    .example('Have not set the drone yet')
});

const responseNoteItemSchema = noteItemSchema.keys({
  id: Joi.objectId().required()
    .description('note Id')
    .example('5aa657341a8d0566dc31e374'),
  clientId: Joi.objectId().required()
    .description('client Id')
    .example('5aa657341a8d0566dc31e374'),
  createdDate: Joi.date()
    .description('Drone created date')
    .example('2018-03-01T00:00:00.000Z')
});

const putNoteRequestSchema = noteItemSchema;
const putNoteResponseSchema = responseNoteItemSchema;

const getNotesRequestSchema = Joi.object({
  clientId: Joi.objectId().required()
    .description('client Id')
    .example('5aa657341a8d0566dc31e374')
});
const getNotesResponseSchema = Joi.array().items(responseNoteItemSchema);

const getNoteRequestSchema = Joi.object({
  clientId: Joi.objectId().required()
    .description('client Id')
    .example('5aa657341a8d0566dc31e375'),
  note: Joi.objectId().required()
    .description('note Id')
    .example('5aa657341a8d0566dc31e374')
});

const getNoteResponseSchema = responseNoteItemSchema;

module.exports = {
  noteItemSchema,
  responseNoteItemSchema,

  putNoteRequestSchema,
  putNoteResponseSchema,

  getNotesRequestSchema,
  getNotesResponseSchema,

  getNoteRequestSchema,
  getNoteResponseSchema
};
