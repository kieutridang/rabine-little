import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/dronePlan.reducer';
import dronePlanApi from '../appApi/dronePlan';

function* getDronePlansFlow() { // eslint-disable-line consistent-return
  try {
    const response = yield call(dronePlanApi.getDronePlans);
    yield put(actions.getDronePlansRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getDronePlansRequestFailed(err.error));
    return false;
  }
}

export function* addGetDronePlansWatcher() {
  yield takeLatest(actionTypes.GET_PLANS_REQUEST, getDronePlansFlow);
}

export default {
  addGetDronePlansWatcher,
};

