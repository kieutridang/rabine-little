/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  userNameLabel: {
    id: 'boilerplate.containers.InviteUserPage.name.label',
    defaultMessage: 'User Name',
  },
  userNamePlaceHolder: {
    id: 'boilerplate.containers.InviteUserPage.name.placeholder',
    defaultMessage: 'Enter name',
  },
  emailLabel: {
    id: 'boilerplate.containers.InviteUserPage.email.label',
    defaultMessage: 'Email',
  },
  userTypeLabel: {
    id: 'boilerplate.containers.InviteUserPage.email.label',
    defaultMessage: 'User Type',
  },
  coName: {
    id: 'boilerplate.containers.InviteUserPage.email.label',
    defaultMessage: 'Company',
  },
  title: {
    id: 'boilerplate.containers.InviteUserPage.email.label',
    defaultMessage: 'Title',
  },
  addUserButton: {
    id: 'boilerplate.containers.InviteUserPage.invite.button',
    defaultMessage: 'Add User',
  },
  titlePlaceHolder: {
    id: 'boilerplate.containers.InviteUserPage.email.label',
    defaultMessage: 'Enter title',
  },
  emailPlaceHolder: {
    id: 'boilerplate.containers.InviteUserPage.email.placeholder',
    defaultMessage: 'Enter Email',
  },
  serverErrorPrefix: {
    id: 'boilerplate.containers.InviteUserPage.backendError.prefix',
    defaultMessage: 'Unexpected Error: ',
  },
  alreadyHaveAccount: {
    id: 'boilerplate.containers.InviteUserPage.dontHaveAccount.specific',
    defaultMessage: 'Already have an account?',
  },
  inviteUserButton: {
    id: 'boilerplate.containers.InviteUserPage.invite.button',
    defaultMessage: 'Invite User',
  },
  inviteUserError: {
    id: 'boilerplate.containers.InviteUserPage.inviteUser.error',
    defaultMessage: 'Unexpected Error: ',
  },
  validationMessage_UserName_Required: {
    id: 'boilerplate.containers.InviteUserPage.validation.userName.required',
    defaultMessage: 'User name is required',
  },
  validationMessage_UserType_Required: {
    id: 'boilerplate.containers.InviteUserPage.validation.userType.required',
    defaultMessage: 'User Type is required',
  },
  validationMessage_CoName_Required: {
    id: 'boilerplate.containers.InviteUserPage.validation.coName.required',
    defaultMessage: 'Client name is required',
  },
  validationMessage_Email_Required: {
    id: 'boilerplate.containers.InviteUserPage.validation.email.required',
    defaultMessage: 'Email is required',
  },
  validationMessage_Email_InvalidFormat: {
    id: 'boilerplate.containers.InviteUserPage.validation.email.required',
    defaultMessage: 'Please enter a valid email address',
  },
});
