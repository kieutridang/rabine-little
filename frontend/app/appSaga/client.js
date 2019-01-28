import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/client.reducer';
import { clientApi } from '../appApi/client';

function* addClient(data) {
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

function* editClient(payload) {
  try {
    const { id, ...rest } = payload;
    const clientInfo = yield call(clientApi.getClientById, id) || {};

    const request = { ...clientInfo, ...rest };
    delete request.activeSites;
    delete request.id;

    const response = yield call(clientApi.editClient, id, request);
    yield put(actions.editClientRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.editClientRequestFailed(err.error));
    return false;
  }
}

function* uploadCompanyLogo(data) {
  try {
    const response = yield call(clientApi.uploadCompanyLogo, data);
    yield put(actions.uploadCompanyLogoSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.uploadCompanyLogoFailed(err.error));
    return false;
  }
}

function* deleteCompanyLogo(data) {
  try {
    const response = yield call(clientApi.deleteCompanyLogo, data);
    yield put(actions.deleteCompanyLogoSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.deleteCompanyLogoFailed(err.error));
    return false;
  }
}

function* deleteClientFlow(action) {
  try {
    const { payload: clientId } = action;
    const response = yield call(clientApi.deleteClient, clientId);
    yield put(actions.deleteClientRequestSuccess(response));
    yield put(actions.getClientsRequest());
    return response;
  } catch (err) {
    yield put(actions.deleteClientRequestFailed(err.error));
    return false;
  }
}

function* getClientsFlow(data) {
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


function* uploadCompanyLogoFlow(action) {
  const data = action.payload;
  yield call(uploadCompanyLogo, data);
}

function* editClientFlow(action) {
  const data = action.payload;
  yield call(editClient, data);
}

function* deleteCompanyLogoFlow(action) {
  const data = action.payload;
  yield call(deleteCompanyLogo, data);
}

export function* addClientWatcher() {
  yield takeLatest(actionTypes.ADD_CLIENT_REQUEST, addClientFlow);
}

export function* editClientWatcher() {
  yield takeLatest(actionTypes.EDIT_CLIENT_REQUEST, editClientFlow);
}

export function* addGetClientsWatcher() {
  yield takeLatest(actionTypes.GET_CLIENTS_REQUEST, getClientsFlow);
}

export function* deleteClientsWatcher() {
  yield takeLatest(actionTypes.DELETE_CLIENT_REQUEST, deleteClientFlow);
}

export function* uploadCompanyLogoWatcher() {
  yield takeLatest(actionTypes.UPLOAD_COMPANY_LOGO, uploadCompanyLogoFlow);
}

export function* deleteCompanyLogoWatcher() {
  yield takeLatest(actionTypes.DELETE_COMPANY_LOGO, deleteCompanyLogoFlow);
}

export default {
  addClientWatcher,
  editClientWatcher,
  addGetClientsWatcher,
  deleteClientsWatcher,
  uploadCompanyLogoWatcher,
  deleteCompanyLogoWatcher,
};

