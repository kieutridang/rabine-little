/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  nameLabel: {
    id: 'boilerplate.containers.LoginPage.name.label',
    defaultMessage: 'Name',
  },
  namePlaceHolder: {
    id: 'boilerplate.containers.LoginPage.name.placeholder',
    defaultMessage: 'Enter Name',
  },
  emailLabel: {
    id: 'boilerplate.containers.LoginPage.email.label',
    defaultMessage: 'Email',
  },
  emailPlaceHolder: {
    id: 'boilerplate.containers.LoginPage.email.placeholder',
    defaultMessage: 'Enter Email',
  },
  passwordLabel: {
    id: 'boilerplate.containers.LoginPage.password.label',
    defaultMessage: 'Password',
  },
  passwordPlaceHolder: {
    id: 'boilerplate.containers.LoginPage.password.placeholder',
    defaultMessage: 'Enter Password',
  },
  serverErrorPrefix: {
    id: 'boilerplate.containers.LoginPage.backendError.prefix',
    defaultMessage: 'Unexpected Error: ',
  },
  dontHaveAccount: {
    id: 'boilerplate.containers.LoginPage.dontHaveAccount.specific',
    defaultMessage: 'Don\'t have an account?',
  },
  createAccountLink: {
    id: 'boilerplate.containers.LoginPage.createAccount.link',
    defaultMessage: 'Create Account',
  },
  forgotPasswordLink: {
    id: 'boilerplate.containers.LoginPage.forgotPassword.link',
    defaultMessage: 'Forgot Password?',
  },
  loginButton: {
    id: 'boilerplate.containers.LoginPage.login.button',
    defaultMessage: 'Login',
  },
  validationMessage_Email_Required: {
    id: 'boilerplate.containers.LoginPage.validation.email.required',
    defaultMessage: 'Please fill in your email',
  },
  validationMessage_Email_InvalidFormat: {
    id: 'boilerplate.containers.LoginPage.validation.email.required',
    defaultMessage: 'Please enter a valid email address',
  },
  validationMessage_Password_Required: {
    id: 'boilerplate.containers.LoginPage.validation.email.required',
    defaultMessage: 'Please fill in your password',
  },
});
