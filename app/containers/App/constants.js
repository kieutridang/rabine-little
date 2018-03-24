/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const DEFAULT_LOCALE = 'en';

export const SEND_REQUEST_STATUS = 'SEND_REQUEST_STATUS';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const SET_AUTH = 'SET_AUTH';
export const LOGIN_REQUEST_FAILED = 'LOGIN_REQUEST_FAILED';

export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_REQUEST_FAILED = 'SIGNUP_REQUEST_FAILED';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_REQUEST_FAILED = 'LOGOUT_REQUEST_FAILED';
