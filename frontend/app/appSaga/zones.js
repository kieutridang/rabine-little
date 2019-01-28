import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/zones.reducer';
import zonesApi from '../appApi/zones';

function* getZonesFlow(action) {
  try {
    const data = action.payload || {};
    const response = yield call(zonesApi.getZones, data);
    yield put(actions.getZonesRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getZonesRequestFailed(err.error));
    return false;
  }
}

function* getZoneOptionsFlow(action) {
  try {
    const data = action.payload || {};
    const response = yield call(zonesApi.getZoneOptions, data);
    yield put(actions.getZoneOptionsRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getZoneOptionsRequestFailed(err.error));
    return false;
  }
}

export function* addGetZonesWatcher() {
  yield takeLatest(actionTypes.GET_ZONES_REQUEST, getZonesFlow);
}

export function* addGetZoneOptionsWatcher() {
  yield takeLatest(actionTypes.GET_ZONE_OPTIONS_REQUEST, getZoneOptionsFlow);
}

export default {
  addGetZonesWatcher,
  addGetZoneOptionsWatcher,
};
