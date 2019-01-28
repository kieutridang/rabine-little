import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/siteRepairs.reducer';
import repairsAPI from '../appApi/repairs';

function* getSiteRepairsFlow(action) {
  try {
    const data = action.payload || {};
    const response = yield call(repairsAPI.getSiteRepairs, data);
    yield put(actions.getSiteRepairsRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getSiteRepairsRequestFailed(err.error));
    return false;
  }
}

function* getSiteRepairPhotosFlow(action) {
  try {
    const { repairId } = action.payload || {};
    const response = yield call(repairsAPI.getSiteRepairPhotos, repairId);
    yield put(actions.getSiteRepairPhotosSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getSiteRepairPhotosFailed(err.error));
    return false;
  }
}

function* setSiteRepairsUnitPriceFlow(action) {
  try {
    const data = action.payload || {};
    const response = yield call(repairsAPI.updateUnitPrice, data);
    yield put(actions.setSiteRepairsUnitPriceSuccess(response));
  } catch (err) {
    yield put(actions.setSiteRepairsUnitPriceFailed(err.error));
  }
}

function* addSiteRepairFlow(action) {
  try {
    const data = action.payload || {};
    const featureType = data.featureType || '';
    delete data.featureType;
    const response = yield call(repairsAPI.addSiteRepair, data);
    yield put(actions.addSiteRepairsRequestSuccess(response));
    yield put(actions.closeAddSiteRepairPane());

    const { siteId } = data;
    yield put(actions.getSiteRepairsRequest({ siteId, featureType }));
    return response;
  } catch (err) {
    yield put(actions.addSiteRepairsRequestFailed(err.error));
    return false;
  }
}

function* deleteSiteRepairFlow(action) {
  try {
    const { id, siteId, featureType = '' } = action.payload || {};
    const response = yield call(repairsAPI.deleteSiteRepair, id);
    yield put(actions.deleteSiteRepairSuccess(response));
    yield put(actions.closeAddSiteRepairPane());

    yield put(actions.getSiteRepairsRequest({ siteId, featureType }));
    return response;
  } catch (err) {
    yield put(actions.deleteSiteRepairError(err.error));
    return false;
  }
}

export function* addGetSiteRepairsWatcher() {
  yield takeLatest(actionTypes.ADD_SITE_REPAIRS_REQUEST, addSiteRepairFlow);
}

export function* deleteSiteRepairWatcher() {
  yield takeLatest(actionTypes.DELETE_SITE_REPAIR, deleteSiteRepairFlow);
}

export function* getGetSiteRepairsWatcher() {
  yield takeLatest(actionTypes.GET_SITE_REPAIRS_REQUEST, getSiteRepairsFlow);
}

export function* getGetSiteRepairPhotosWatcher() {
  yield takeLatest(actionTypes.GET_SITE_REPAIR_PHOTOS_REQUEST, getSiteRepairPhotosFlow);
}

export function* setSiteRepairsUnitPriceWatcher() {
  yield takeLatest(actionTypes.SET_SITE_REPAIRS_UNIT_PRICE, setSiteRepairsUnitPriceFlow);
}

export default {
  addGetSiteRepairsWatcher,
  getGetSiteRepairsWatcher,
  setSiteRepairsUnitPriceWatcher,
  deleteSiteRepairWatcher,
  getGetSiteRepairPhotosWatcher,
};
