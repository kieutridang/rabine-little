import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/bidSheet.reducer';
import { bidSheetAPI } from '../appApi/bidSheet';

function* addBidSheetValues(data) {
  const { clientId, body } = data.payload;
  try {
    const response = yield call(bidSheetAPI.addValues, clientId, body);
    yield put(actions.addBidSheetSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.addBidSheetFailed(err.error));
    return false;
  }
}

function* getBidSheetValues(data) {
  const clientId = data.payload;
  try {
    const response = yield call(bidSheetAPI.getValues, clientId);
    yield put(actions.getBidSheetSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getBidSheetFailed(err.error));
    return false;
  }
}

export function* addBidSheetValuesWatcher() {
  yield takeLatest(actionTypes.ADD_BID_SHEET_VALUES_REQUEST, addBidSheetValues);
}

export function* getBidSheetValuesWatcher() {
  yield takeLatest(actionTypes.GET_BID_SHEET_VALUES_REQUEST, getBidSheetValues);
}

export default {
  addBidSheetValuesWatcher,
  getBidSheetValuesWatcher,
};
