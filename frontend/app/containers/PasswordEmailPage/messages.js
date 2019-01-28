/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'boilerplate.containers.PasswordEmailPage.title.label',
    defaultMessage: 'Please enter your email and we’ll send you a link to reset your password',
  },
  emailLabel: {
    id: 'boilerplate.containers.PasswordEmailPage.email.label',
    defaultMessage: 'Email',
  },
  emailPlaceHolder: {
    id: 'boilerplate.containers.PasswordEmailPage.email.placeholder',
    defaultMessage: 'Enter email',
  },
  serverErrorPrefix: {
    id: 'boilerplate.containers.PasswordEmailPage.backendError.prefix',
    defaultMessage: 'Unexpected Error: ',
  },
  rememberYourPassword: {
    id: 'boilerplate.containers.PasswordEmailPage.dontHaveAccount.specific',
    defaultMessage: 'Remembered your password? ',
  },
  signInLink: {
    id: 'boilerplate.containers.PasswordEmailPagee.createAccount.link',
    defaultMessage: 'Sign in',
  },
  resetPasswordButton: {
    id: 'boilerplate.containers.PasswordEmailPage.login.button',
    defaultMessage: 'Reset Password',
  },
  validationMessage_Email_Required: {
    id: 'boilerplate.containers.PasswordEmailPage.validation.email.required',
    defaultMessage: 'Please fill in your email',
  },
  validationMessage_Email_InvalidFormat: {
    id: 'boilerplate.containers.PasswordEmailPage.validation.email.required',
    defaultMessage: 'Please enter a valid email address',
  },
  send_Email: {
    id: 'boilerplate.containers.PasswordEmailPage.send.email',
    defaultMessage: 'The email was sent. Please check your email',
  },
});
