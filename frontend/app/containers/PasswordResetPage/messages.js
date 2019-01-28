/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  passwordLabel: {
    id: 'boilerplate.containers.PasswordResetPage.password.label',
    defaultMessage: 'New password',
  },
  passwordPlaceHolder: {
    id: 'boilerplate.containers.PasswordResetPage.password.placeholder',
    defaultMessage: 'Enter Password',
  },
  repeatPasswordLabel: {
    id: 'boilerplate.containers.PasswordResetPage.repeatpassword.label',
    defaultMessage: 'Repeat New password',
  },
  serverErrorPrefix: {
    id: 'boilerplate.containers.PasswordResetPage.backendError.prefix',
    defaultMessage: 'Unexpected Error: ',
  },
  resetPasswordButton: {
    id: 'boilerplate.containers.PasswordResetPage.resetpassword.button',
    defaultMessage: 'Reset Password',
  },
  validationMessage_Password_Required: {
    id: 'boilerplate.containers.PasswordResetPage.validation.password.required',
    defaultMessage: 'Please fill in your password',
  },
  validationMessage_RepeatPassword_Required: {
    id: 'boilerplate.containers.PasswordResetPage.validation.repeatpassword.required',
    defaultMessage: 'Please fill in repeat new password',
  },
  validationMessage_RepeatPassword_Validate: {
    id: 'boilerplate.containers.PasswordResetPage.validation.repeatpassword.required',
    defaultMessage: 'Repeat password not match with password',
  },
  changePassword_Success: {
    id: 'boilerplate.containers.PasswordResetPage.change.passsword.required',
    defaultMessage: 'Change password succesfully !',
  },
  changePassword_Fail: {
    id: 'boilerplate.containers.PasswordResetPage.change.passsword.required',
    defaultMessage: 'invalid token',
  },
});
