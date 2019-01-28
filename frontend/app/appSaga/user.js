import { call, put, takeLatest } from 'redux-saga/effects';
import jwtDecode from 'jwt-decode';

import { actions, actionTypes } from '../appReducer/user.reducer';
import { loginToAuthenticate } from '../containers/App/actions';
import { userApi } from '../appApi/user';
import { clientApi } from '../appApi/client';

function* inviteUser(data) {
  try {
    const response = yield call(userApi.inviteUser, data);

    yield put(actions.inviteUserRequestSuccess(response));
    yield put(actions.getUsersRequest());
    yield put(actions.getInvitedUsersRequest());

    return response;
  } catch (err) {
    yield put(actions.inviteUserRequestFailed(err.error));
    return false;
  }
}

function* resetPassword(data) {
  try {
    const response = yield call(userApi.resetPasswordUser, data);

    yield put(actions.resetPasswordSuccess(response.token));

    return response;
  } catch (err) {
    yield put(actions.resetPasswordFailed(err.error));
    return false;
  }
}

function* changePassword(data) {
  try {
    const { email } = jwtDecode(data.resetToken);

    const response = yield call(userApi.changePasswordUser, data);

    yield put(actions.changePasswordSuccess(true));
    yield put(loginToAuthenticate(email, data.password));

    window.browserHistory.push('/login');

    return response;
  } catch (err) {
    yield put(actions.changePasswordFailed(err.error));

    return false;
  }
}

function* getUsersFlow(data) {
  try {
    const response = yield call(userApi.getUsers, data);

    yield put(actions.getUsersSuccess(response));

    return response;
  } catch (err) {
    yield put(actions.inviteUserRequestFailed(err.error));
    return false;
  }
}

function* getClientsCollectionFlow(data = {}) {
  try {
    const response = yield call(clientApi.getClients, data);
    yield put(actions.getClientsCollectionSuccess(response));
    return response;
  } catch (err) {
    return false;
  }
}

function* getInvitedUsersFlow(data = {}) {
  try {
    const response = yield call(userApi.getInvitedUsers, data);
    yield put(actions.getInvitedUsersRequestSuccess(response));
    return response;
  } catch (err) {
    return false;
  }
}

function* inviteUserFlow(action) {
  const data = action.payload;
  yield call(inviteUser, data);
}

function* resetPasswordFlow(action) {
  const data = action.payload;
  yield call(resetPassword, data);
}

function* changePasswordFlow(action) {
  const data = action.payload;
  yield call(changePassword, data);
}

export function* inviteUserWatcher() {
  yield takeLatest(actionTypes.INVITE_USER_REQUEST, inviteUserFlow);
}

export function* resetPasswordWatcher() {
  yield takeLatest(actionTypes.RESET_PASSWORD_REQUEST, resetPasswordFlow);
}

export function* changetPasswordWatcher() {
  yield takeLatest(actionTypes.CHANGE_PASSWORD_REQUEST, changePasswordFlow);
}

export function* addGetUsersWatcher() {
  yield takeLatest(actionTypes.GET_USERS_REQUEST, getUsersFlow);
}

export function* getClientsCollectionWatcher() {
  yield takeLatest(actionTypes.GET_CLIENTS_COLLECTION, getClientsCollectionFlow);
}

export function* getInvitedUsersWatcher() {
  yield takeLatest(actionTypes.GET_INVITED_USERS_REQUEST, getInvitedUsersFlow);
}

export default {
  inviteUserWatcher,
  addGetUsersWatcher,
  getClientsCollectionWatcher,
  getInvitedUsersWatcher,
  resetPasswordWatcher,
  changetPasswordWatcher,
};
