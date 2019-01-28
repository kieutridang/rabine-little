import { call, all, put, takeEvery } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/feature.reducer';
import { actions as sitePhotoActions } from '../appReducer/sitePhoto.reducer';
import featureApi from '../appApi/feature';

function* createFeatureFlow(data) {
  try {
    const { payload } = data;
    const { siteData, featureData } = payload;
    const { siteId } = siteData;

    const response = yield call(featureApi.createFeature, siteId, featureData);
    yield put(actions.createFeatureRequestSuccess(response));

    return response;
  } catch (err) {
    yield put(actions.createFeatureRequestFailed(err.error));
    return false;
  }
}

function* putFeatureFlow(data) {
  try {
    const { payload } = data;
    const { siteData, featureData } = payload;
    const { siteId, token, featureId, selectedAreas } = siteData;

    const response = yield call(featureApi.putFeature, featureId, featureData);
    yield all(Object.keys(selectedAreas).map(
      (areaId) => put(sitePhotoActions.getAreaPhotos({ siteId, areaId, token }))
    ));
    yield put(actions.putFeatureRequestSuccess(response));

    return response;
  } catch (err) {
    yield put(actions.putFeatureRequestFailed(err.error));
    return false;
  }
}

function* deleteFeatureFlow(data) {
  try {
    const { payload } = data;
    const { siteData, type } = payload;
    const { siteId, token, featureId, selectedAreas } = siteData;
    const response = yield call(featureApi.deleteFeature, { featureId, type });

    yield all(Object.keys(selectedAreas).map(
      (areaId) => put(sitePhotoActions.getAreaPhotos({ siteId, areaId, token }))
    ));
    yield put(actions.deleteFeatureRequestSuccess(response));

    return response;
  } catch (err) {
    yield put(actions.deleteFeatureRequestFailed(err.error));
    return false;
  }
}

function* cutFeatureFlow(data) {
  try {
    const { payload } = data;
    const {
      siteData: { siteId, token, selectedAreas },
      featureData: { oldFeatureId, newFeatures },
    } = payload;

    yield all(newFeatures.map(
      (feature) => call(featureApi.createFeature, siteId, { feature })
    ));
    const response = yield call(featureApi.deleteFeature, { featureId: oldFeatureId, type: 'CUT_FEATURE' });
    yield all(Object.keys(selectedAreas).map(
      (areaId) => put(sitePhotoActions.getAreaPhotos({ siteId, areaId, token }))
    ));
    yield put(actions.cutFeatureRequestSuccess(response));

    return response;
  } catch (err) {
    yield put(actions.cutFeatureRequestFailed(err.error));
    return false;
  }
}

export function* createFeatureWatcher() {
  yield takeEvery(actionTypes.CREATE_FEATURE_REQUEST, createFeatureFlow);
}

export function* putFeatureWatcher() {
  yield takeEvery(actionTypes.PUT_FEATURE_REQUEST, putFeatureFlow);
}

export function* deleteFeatureWatcher() {
  yield takeEvery(actionTypes.DELETE_FEATURE_REQUEST, deleteFeatureFlow);
}

export function* cutFeatureWatcher() {
  yield takeEvery(actionTypes.CUT_FEATURE_REQUEST, cutFeatureFlow);
}

export default {
  createFeatureWatcher,
  putFeatureWatcher,
  deleteFeatureWatcher,
  cutFeatureWatcher,
};
