import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/siteMetrics.reducer';
import siteApi from '../appApi/site';

function* getSiteMetricsFlow() {
  try {
    const response = yield call(siteApi.getSiteMetrics);
    yield put(actions.getSiteMetricsRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getSiteMetricsRequestFailed(err.error));
    return false;
  }
}

export function* addGetSiteMetricsWatcher() {
  yield takeLatest(actionTypes.GET_SITE_METRICS_REQUEST, getSiteMetricsFlow);
}

export default {
  addGetSiteMetricsWatcher,
};
