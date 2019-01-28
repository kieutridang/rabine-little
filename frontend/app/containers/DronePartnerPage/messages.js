/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  clientNameLabel: {
    id: 'boilerplate.containers.AddDronePartnerPage.name.label',
    defaultMessage: 'Partner Name',
  },
  clientNamePlaceHolder: {
    id: 'boilerplate.containers.AddDronePartnerPage.name.placeholder',
    defaultMessage: 'Enter Partner Name',
  },
  emailLabel: {
    id: 'boilerplate.containers.AddDronePartnerPage.email.label',
    defaultMessage: 'Email Address',
  },
  emailPlaceHolder: {
    id: 'boilerplate.containers.AddDronePartnerPage.email.placeholder',
    defaultMessage: 'Enter Email Address',
  },
  addressLabel: {
    id: 'boilerplate.containers.AddDronePartnerPage.address.label',
    defaultMessage: 'Address',
  },
  addressPlaceHolder: {
    id: 'boilerplate.containers.AddDronePartnerPage.address.placeholder',
    defaultMessage: 'Enter Address',
  },
  contactNameLabel: {
    id: 'boilerplate.containers.AddDronePartnerPage.contactName.label',
    defaultMessage: 'Contact Name',
  },
  contactNamePlaceHolder: {
    id: 'boilerplate.containers.AddDronePartnerPage.contactName.placeholder',
    defaultMessage: 'Enter Contact Name',
  },
  phoneLabel: {
    id: 'boilerplate.containers.AddDronePartnerPage.phone.label',
    defaultMessage: 'Phone Number',
  },
  phonePlaceHolder: {
    id: 'boilerplate.containers.AddDronePartnerPage.phone.placeholder',
    defaultMessage: 'Enter Phone Number',
  },
  notesLabel: {
    id: 'boilerplate.containers.AddDronePartnerPage.notes.label',
    defaultMessage: 'Notes',
  },
  notesPlaceHolder: {
    id: 'boilerplate.containers.AddDronePartnerPage.notes.placeholder',
    defaultMessage: 'Enter Notes',
  },
  serverErrorPrefix: {
    id: 'boilerplate.containers.AddDronePartnerPage.backendError.prefix',
    defaultMessage: 'Unexpected Error: ',
  },
  alreadyHaveAccount: {
    id: 'boilerplate.containers.AddDronePartnerPage.dontHaveAccount.specific',
    defaultMessage: 'Already have an account?',
  },
  createClientButton: {
    id: 'boilerplate.containers.AddDronePartnerPage.create.button',
    defaultMessage: 'Add Drone Partner',
  },
  createClientError: {
    id: 'boilerplate.containers.AddDronePartnerPage.createClient.error',
    defaultMessage: 'Unexpected Error: ',
  },
  validationMessage_ClientName_Required: {
    id: 'boilerplate.containers.AddDronePartnerPage.validation.name.required',
    defaultMessage: 'Drone Partner Name is required',
  },
  validationMessage_Email_Required: {
    id: 'boilerplate.containers.AddDronePartnerPage.validation.email.required',
    defaultMessage: 'Email is required',
  },
  validationMessage_Email_InvalidFormat: {
    id: 'boilerplate.containers.AddDronePartnerPage.validation.email.required',
    defaultMessage: 'Please enter a valid email address',
  },
  validationMessage_Phone_Required: {
    id: 'boilerplate.containers.AddDronePartnerPage.validation.phone.required',
    defaultMessage: 'Phone is required',
  },
  validationMessage_Phone_InvalidFormat: {
    id: 'boilerplate.containers.AddDronePartnerPage.validation.phone.required',
    defaultMessage: 'Please enter a valid phone',
  },
});
