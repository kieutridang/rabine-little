/**
 * Root saga, it always watch for action, use for special case like login & logout
 */

// vendor
import { call, put, race, take, takeLatest } from 'redux-saga/effects';
// app
import auth from '../appApi/auth';
import { LOGIN_REQUEST, LOGOUT_REQUEST, SIGNUP_REQUEST, UPDATE_AUTHENTICATED_USER, GET_INVITED_USER_BY_ID } from '../containers/App/constants';
import { setAuthState, loginError, signupError, sendRequest, getInvitedUserByIdSuccess } from '../containers/App/actions';
import { userApi } from '../appApi/user';

export function* authorize({ newUser, username, password, name }) {
  yield put(sendRequest(true));
  try {
    let response;
    if (newUser) {
      response = yield call(auth.signup, username, password, name);
    } else {
      response = yield call(auth.login, username, password);
    }
    return response;
  } catch (error) {
    if (newUser) {
      yield put(signupError(error.error));
    } else {
      yield put(loginError(error.error));
    }
    return false;
  } finally {
    yield put(sendRequest(false));
  }
}

export function* loginFlow(action) {
  try {
    const username = action.username;
    const password = action.password;
    const from = action.from || { from: { pathname: '/dashboard' } };
    const newUser = false;

    const winner = yield race({
      auth: call(authorize, { newUser, username, password }),
      logout: take(LOGOUT_REQUEST),
    });

    if (winner.auth != null && winner.auth.username) {
      yield put(setAuthState(true, winner.auth));
      window.browserHistory.push(from);
    }
  } catch (err) {
    yield put(loginError(err));
  }
}

export function* signupFlow(action) {
  try {
    const name = action.name;
    const username = action.username;
    const password = action.password;
    const newUser = true;
    const response = yield call(authorize, { newUser, username, password, name });
    if (response) {
      yield put(setAuthState(true, response));
      window.browserHistory.push('/dashboard');
    }
  } catch (err) {
    yield put(signupError(err));
  }
}

export function* logout() {
  yield put(sendRequest(true));
  try {
    const response = yield call(auth.logout);

    yield put(sendRequest(false));

    return response;
  } catch (error) {
    yield put(sendRequest(false));
    console.error('logout with error:', error); // eslint-disable-line no-console
    return false;
  }
}

export function* logoutFlow() {
  yield put(setAuthState(false));
  yield call(logout);
  window.browserHistory.push('/login');
}

export function* updateAuthenticatedUserFlow(action) {
  yield put(setAuthState(true, action.userInfo));
}

export function* getInvitedUserByIdFlow(action) {
  const response = yield call(userApi.getInvitedUserById, action.userId);
  if (response && response.length > 0) {
    const { id, username, fullName } = response[0];
    yield put(getInvitedUserByIdSuccess({ id, username, fullName }));
  }
}

// Watchers
export function* loginWatcher() {
  yield takeLatest(LOGIN_REQUEST, loginFlow);
}

export function* signupWatcher() {
  yield takeLatest(SIGNUP_REQUEST, signupFlow);
}

export function* logoutWatcher() {
  yield takeLatest(LOGOUT_REQUEST, logoutFlow);
}

export function* updateUserWatcher() {
  yield takeLatest(UPDATE_AUTHENTICATED_USER, updateAuthenticatedUserFlow);
}

export function* getInvitedUserByIdWatcher() {
  yield takeLatest(GET_INVITED_USER_BY_ID, getInvitedUserByIdFlow);
}
