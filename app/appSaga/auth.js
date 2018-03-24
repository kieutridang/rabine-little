/**
 * Root saga, it always watch for action, use for special case like login & logout
 */

// vendor
import { call, put, race, take, takeLatest } from 'redux-saga/effects';
// app
import auth from '../appApi/auth';
import { LOGIN_REQUEST, LOGOUT_REQUEST, SIGNUP_REQUEST } from '../containers/App/constants';
import { setAuthState, loginError, signupError, sendRequest } from '../containers/App/actions';

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
    const newUser = false;

    const winner = yield race({
      auth: call(authorize, { newUser, username, password }),
      logout: take(LOGOUT_REQUEST),
    });

    if (winner.auth != null && winner.auth.username) {
      yield put(setAuthState(true, winner.auth));
      window.browserHistory.push('/dashboard');
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

export function* logout() { // eslint-disable-line consistent-return
  yield put(sendRequest(true));
  try {
    const response = yield call(auth.logout);
    yield put(sendRequest(false));
    return response;
  } catch (error) {
    yield put(sendRequest(false));
    console.error('logout with error:', error); // eslint-disable-line no-console
  }
}

export function* logoutFlow() {
  yield put(setAuthState(false));
  yield call(logout);
  window.browserHistory.push('/login');
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
