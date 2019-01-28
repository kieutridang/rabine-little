import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/site.reducer';
import siteApi from '../appApi/site';

import { actions as s3Actions } from '../appReducer/s3.reducer';

function* deleteSite(action) {
  try {
    const { payload: siteId } = action;
    const response = yield call(siteApi.deleteSite, siteId);
    yield put(actions.deleteSiteRequestSuccess(response));
    yield put(actions.getSitesRequest());
    return response;
  } catch (err) {
    yield put(actions.deleteSiteRequestFailed(err.error));
    return false;
  }
}

function* addSite(data) {
  try {
    const response = yield call(siteApi.createSite, data);
    yield put(actions.addSiteRequestSuccess(response));
    yield put(actions.showAddSite(false));
    yield put(actions.getSitesRequest());

    if (response) {
      const { rabineS3Folder } = response;
      if (rabineS3Folder) {
        yield put(s3Actions.getS3SyncInfoRequest(rabineS3Folder));
      }
    }

    return response;
  } catch (err) {
    yield put(actions.addSiteRequestFailed(err.error));
    return false;
  }
}

function* editSiteFlow({ payload }) {
  try {
    const { id, ...rest } = payload;
    const siteInfo = yield call(siteApi.getSiteById, id) || {};

    const request = { ...siteInfo, ...rest };
    delete request.googleDriveId;
    delete request.completedDate;
    delete request.totalRepairs;
    delete request.id;

    const response = yield call(siteApi.updateSiteInfo, id, request);
    yield put(actions.editSiteRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.editSiteRequestFailed(err.error));
    return false;
  }
}

function* getSitesFlow(action) {
  try {
    const data = action.payload || {};
    const response = yield call(siteApi.getSites, data);
    yield put(actions.getSitesSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getSitesError(err));
    return false;
  }
}


function* getSiteOrtho(action) {
  try {
    const data = action.payload || {};
    const response = yield call(siteApi.getSiteOrtho, data);
    yield put(actions.getSiteOrthoSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getSiteOrthoError(err));
    return false;
  }
}

function* addSiteFlow(action) {
  const data = action.payload;
  yield call(addSite, data);
}

export function* deleteSiteWatcher() {
  yield takeLatest(actionTypes.DELETE_SITE_REQUEST, deleteSite);
}

export function* addSiteWatcher() {
  yield takeLatest(actionTypes.ADD_SITE_REQUEST, addSiteFlow);
}

export function* editSiteWatcher() {
  yield takeLatest(actionTypes.EDIT_SITE_REQUEST, editSiteFlow);
}

export function* addGetSitesWatcher() {
  yield takeLatest(actionTypes.GET_SITES_REQUEST, getSitesFlow);
}

export function* addGetSiteOrthoWatcher() {
  yield takeLatest(actionTypes.GET_SITE_ORTHO_REQUEST, getSiteOrtho);
}

export default {
  addSiteWatcher,
  editSiteWatcher,
  addGetSitesWatcher,
  addGetSiteOrthoWatcher,
  deleteSiteWatcher,
};
