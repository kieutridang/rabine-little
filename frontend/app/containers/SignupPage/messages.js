/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage
 */

import { defineMessages } from 'react-intl';

export default defineMessages({
  nameLabel: {
    id: 'boilerplate.containers.SignupPage.name.label',
    defaultMessage: 'Name',
  },
  namePlaceHolder: {
    id: 'boilerplate.containers.SignupPage.name.placeholder',
    defaultMessage: 'Enter Name',
  },
  emailLabel: {
    id: 'boilerplate.containers.SignupPage.email.label',
    defaultMessage: 'Email',
  },
  emailPlaceHolder: {
    id: 'boilerplate.containers.SignupPage.email.placeholder',
    defaultMessage: 'Enter Email',
  },
  passwordLabel: {
    id: 'boilerplate.containers.SignupPage.password.label',
    defaultMessage: 'Password',
  },
  passwordPlaceHolder: {
    id: 'boilerplate.containers.SignupPage.password.placeholder',
    defaultMessage: 'Enter Password',
  },
  repeatPasswordLabel: {
    id: 'boilerplate.containers.SignupPage.repeatPassword.label',
    defaultMessage: 'Repeat Password',
  },
  repeatPasswordPlaceHolder: {
    id: 'boilerplate.containers.SignupPage.repeatPassword.placeholder',
    defaultMessage: 'Confirm your typed password',
  },
  serverErrorPrefix: {
    id: 'boilerplate.containers.SignupPage.backendError.prefix',
    defaultMessage: 'Unexpected Error: ',
  },
  alreadyHaveAccount: {
    id: 'boilerplate.containers.SignupPage.dontHaveAccount.specific',
    defaultMessage: 'Already have an account?',
  },
  signinLink: {
    id: 'boilerplate.containers.SignupPage.signin.link',
    defaultMessage: 'Sign in',
  },
  signupButton: {
    id: 'boilerplate.containers.SignupPage.signup.button',
    defaultMessage: 'Create Account',
  },
  validationMessage_Name_Required: {
    id: 'boilerplate.containers.SignupPage.validation.email.required',
    defaultMessage: 'Name is required',
  },
  validationMessage_Email_Required: {
    id: 'boilerplate.containers.SignupPage.validation.email.required',
    defaultMessage: 'Email is required',
  },
  validationMessage_Email_InvalidFormat: {
    id: 'boilerplate.containers.SignupPage.validation.email.required',
    defaultMessage: 'Please enter a valid email address',
  },
  validationMessage_Password_Required: {
    id: 'boilerplate.containers.SignupPage.validation.email.required',
    defaultMessage: 'Password is required',
  },
  validationMessage_Password_LengthMinium: {
    id: 'boilerplate.containers.SignupPage.validation.email.required',
    defaultMessage: 'Password legnth must be greater than 5 letter',
  },
  validationMessage_RepeatPassword_NotMatch: {
    id: 'boilerplate.containers.SignupPage.validation.email.required',
    defaultMessage: 'Repeat password not match with password',
  },
});
