import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/siteScreenshot.reducer';
import SiteScreenshotAPI from '../appApi/siteScreenshot';

function* addScreenshotSite(data) {
  const params = data.payload;

  try {
    const response = yield call(SiteScreenshotAPI.addSiteScreenshot, params);
    yield put(actions.addSiteScreenshotSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.addSiteScreenshotFailed(err.error));
    return false;
  }
}

function* getScreenshotsSite(data) {
  const { siteId } = data.payload;

  try {
    const response = yield call(SiteScreenshotAPI.getSiteScreenshots, siteId);
    yield put(actions.getSiteScreenshotSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getSiteScreenshotFailed(err.error));
    return false;
  }
}

export function* addScreenshotSiteWatcher() {
  yield takeLatest(actionTypes.ADD_SITE_SCREENSHOT_REQUEST, addScreenshotSite);
}

export function* getScreenshotsSiteWatcher() {
  yield takeLatest(actionTypes.GET_SITE_SCREENSHOTS_REQUEST, getScreenshotsSite);
}

export default {
  addScreenshotSiteWatcher,
  getScreenshotsSiteWatcher,
};
