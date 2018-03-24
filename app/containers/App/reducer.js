/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import {
  SEND_REQUEST_STATUS,
  SET_AUTH,
  LOGIN_REQUEST,
  LOGIN_REQUEST_FAILED,
  SIGNUP_REQUEST_FAILED,
  SIGNUP_REQUEST,
  LOGOUT_REQUEST,
  LOGOUT_REQUEST_FAILED,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: '',
  authLoading: false,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOGOUT_REQUEST:
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
      return state.set('error', {});

    case SEND_REQUEST_STATUS:
      return state
        .set('authLoading', action.authLoading);

    case SET_AUTH:
      return state
        .set('loggedIn', action.loggedIn)
        .set('user', action.user);

    case LOGOUT_REQUEST_FAILED:
    case LOGIN_REQUEST_FAILED:
    case SIGNUP_REQUEST_FAILED:
    default:
      return state;
  }
}

export default appReducer;
