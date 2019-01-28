import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, actionTypes } from '../appReducer/sitePdf.reducer';
import SitePdfAPI from '../appApi/sitePdf';

function* addPdfSite(data) {
  const params = data.payload;
  try {
    const response = yield call(SitePdfAPI.addSitePdf, params);
    yield put(actions.addSitePdfRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.addSitePdfRequestFailed(err.error));
    return false;
  }
}

function* getPdfSite(data) {
  try {
    const response = yield call(SitePdfAPI.getSitePdf, data);
    yield put(actions.getSitePdfRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getSitePdfRequestFailed(err.error));
    return false;
  }
}

export function* addPdfSiteWatcher() {
  yield takeLatest(actionTypes.ADD_SITE_PDF_REQUEST, addPdfSite);
}

export function* getPdfSiteWatcher() {
  yield takeLatest(actionTypes.GET_SITE_PDF_REQUEST, getPdfSite);
}

export default {
  addPdfSiteWatcher,
  getPdfSiteWatcher,
};
