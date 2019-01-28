import {
  SEND_REQUEST_STATUS,
  LOGIN_REQUEST,
  SET_AUTH,
  LOGIN_REQUEST_FAILED,
  SIGNUP_REQUEST,
  SIGNUP_REQUEST_FAILED,
  LOGOUT_REQUEST,
  LOGOUT_REQUEST_FAILED,
  RESET_AUTH_STATE,
  UPDATE_AUTHENTICATED_USER,
  GET_INVITED_USER_BY_ID,
  GET_INVITED_USER_BY_ID_SUCCESS,
} from './constants';

export function sendRequest(requestStatus) {
  return {
    type: SEND_REQUEST_STATUS,
    authLoading: requestStatus,
  };
}

export function loginToAuthenticate(username, password, from) {
  return {
    type: LOGIN_REQUEST,
    username,
    password,
    from,
  };
}

export function logout() {
  return {
    type: LOGOUT_REQUEST,
  };
}

export function setAuthState(isAuthenticated, userData = null) {
  return {
    type: SET_AUTH,
    user: userData,
    loggedIn: isAuthenticated,
  };
}

export function loginError(error) {
  return {
    type: LOGIN_REQUEST_FAILED,
    error,
  };
}

export function logOutError(error) {
  return {
    type: LOGOUT_REQUEST_FAILED,
    error,
  };
}

export function signup(username, password, name) {
  return {
    type: SIGNUP_REQUEST,
    username,
    password,
    name,
  };
}

export function signupError(error) {
  return {
    type: SIGNUP_REQUEST_FAILED,
    error,
  };
}

export function resetAuthState() {
  return {
    type: RESET_AUTH_STATE,
  };
}

export function updateAuthenticatedUser(userInfo) {
  return {
    type: UPDATE_AUTHENTICATED_USER,
    userInfo,
  };
}

export function getInvitedUserById(userId) {
  return {
    type: GET_INVITED_USER_BY_ID,
    userId,
  };
}

export function getInvitedUserByIdSuccess(userInfo) {
  return {
    type: GET_INVITED_USER_BY_ID_SUCCESS,
    invitedUser: userInfo,
  };
}
