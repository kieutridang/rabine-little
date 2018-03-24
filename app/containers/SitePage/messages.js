/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  nameLabel: {
    id: 'boilerplate.containers.AddSitePage.name.label',
    defaultMessage: 'Site Name',
  },
  namePlaceHolder: {
    id: 'boilerplate.containers.AddSitePage.name.placeholder',
    defaultMessage: 'Enter Site Name',
  },
  clientLabel: {
    id: 'boilerplate.containers.AddSitePage.client.label',
    defaultMessage: 'Client',
  },
  dronePlanLabel: {
    id: 'boilerplate.containers.AddSitePage.dronePlan.label',
    defaultMessage: 'Drone Deploy Plan',
  },
  statusLabel: {
    id: 'boilerplate.containers.AddSitePage.status.label',
    defaultMessage: 'Status',
  },
  addressLabel: {
    id: 'boilerplate.containers.AddSitePage.address.label',
    defaultMessage: 'Address',
  },
  addressPlaceHolder: {
    id: 'boilerplate.containers.AddSitePage.address.placeholder',
    defaultMessage: 'Enter Address',
  },
  deadlineLabel: {
    id: 'boilerplate.containers.AddSitePage.deadline.label',
    defaultMessage: 'Deadline',
  },
  deadlinePlaceHolder: {
    id: 'boilerplate.containers.AddSitePage.deadline.placeholder',
    defaultMessage: 'Please Enter Date',
  },
  typeLabel: {
    id: 'boilerplate.containers.AddSitePage.type.label',
    defaultMessage: 'Site Type',
  },
  costLabel: {
    id: 'boilerplate.containers.AddSitePage.cost.label',
    defaultMessage: 'Cost',
  },
  costPlaceHolder: {
    id: 'boilerplate.containers.AddSitePage.cost.label',
    defaultMessage: 'Cost of the projects (in $)',
  },
  notesLabel: {
    id: 'boilerplate.containers.AddSitePage.notes.label',
    defaultMessage: 'Notes',
  },
  notesPlaceHolder: {
    id: 'boilerplate.containers.AddSitePage.notes.placeholder',
    defaultMessage: 'Notes about the site',
  },
  serverErrorPrefix: {
    id: 'boilerplate.containers.AddSitePage.backendError.prefix',
    defaultMessage: 'Unexpected Error: ',
  },
  alreadyHaveAccount: {
    id: 'boilerplate.containers.AddSitePage.dontHaveAccount.specific',
    defaultMessage: 'Already have an account?',
  },
  createSiteButton: {
    id: 'boilerplate.containers.AddSitePage.create.button',
    defaultMessage: 'Add Site',
  },
  createSiteError: {
    id: 'boilerplate.containers.AddSitePage.createSite.error',
    defaultMessage: 'Unexpected Error: ',
  },
  validationMessage_SiteName_Required: {
    id: 'boilerplate.containers.AddSitePage.validation.name.required',
    defaultMessage: 'Site Name is required',
  },
  validationMessage_Client_Required: {
    id: 'boilerplate.containers.AddSitePage.validation.email.required',
    defaultMessage: 'Client is required',
  },
  validationMessage_Email_InvalidFormat: {
    id: 'boilerplate.containers.AddSitePage.validation.email.required',
    defaultMessage: 'Please enter a valid email address',
  },
  validationMessage_Cost_Required: {
    id: 'boilerplate.containers.AddSitePage.validation.cost.required',
    defaultMessage: 'Cost is required',
  },
});
