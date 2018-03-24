import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/site.reducer';
import siteApi from '../appApi/site';

function* addSite(data) { // eslint-disable-line consistent-return
  try {
    const response = yield call(siteApi.createSite, data);
    yield put(actions.addSiteRequestSuccess(response));
    yield put(actions.showAddSite(false));
    yield put(actions.getSitesRequest());
    return response;
  } catch (err) {
    yield put(actions.addSiteRequestFailed(err.error));
    return false;
  }
}

function* getSitesFlow(data) { // eslint-disable-line consistent-return
  try {
    const response = yield call(siteApi.getSites, data);
    yield put(actions.getSitesSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.addSiteRequestFailed(err.error));
    return false;
  }
}

function* addSiteFlow(action) {
  const data = action.payload;
  yield call(addSite, data);
}

export function* addSiteWatcher() {
  yield takeLatest(actionTypes.ADD_SITE_REQUEST, addSiteFlow);
}

export function* addGetSitesWatcher() {
  yield takeLatest(actionTypes.GET_SITES_REQUEST, getSitesFlow);
}

export default {
  addSiteWatcher,
  addGetSitesWatcher,
};

