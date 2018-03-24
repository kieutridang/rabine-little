import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/client.reducer';
import { clientApi } from '../appApi/client';

function* addClient(data) { // eslint-disable-line consistent-return
  try {
    const response = yield call(clientApi.createClient, data);
    yield put(actions.addClientRequestSuccess(response));
    yield put(actions.showAddClient(false));
    yield put(actions.getClientsRequest());
    return response;
  } catch (err) {
    yield put(actions.addClientRequestFailed(err.error));
    return false;
  }
}

function* getClientsFlow(data) { // eslint-disable-line consistent-return
  try {
    const response = yield call(clientApi.getClients, data);
    yield put(actions.getClientsSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.addClientRequestFailed(err.error));
    return false;
  }
}

function* addClientFlow(action) {
  const data = action.payload;
  yield call(addClient, data);
}

export function* addClientWatcher() {
  yield takeLatest(actionTypes.ADD_CLIENT_REQUEST, addClientFlow);
}

export function* addGetClientsWatcher() {
  yield takeLatest(actionTypes.GET_CLIENTS_REQUEST, getClientsFlow);
}

export default {
  addClientWatcher,
  addGetClientsWatcher,
};

