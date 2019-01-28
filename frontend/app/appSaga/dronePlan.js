import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/dronePlan.reducer';
import dronePlanApi from '../appApi/dronePlan';

function* getDronePlansFlow() {
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

function* getAllPlansFlow() {
  try {
    const response = yield call(dronePlanApi.getAllDronePlans);
    yield put(actions.getAllPlansRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getAllPlansRequestFailed(err.error));
    return false;
  }
}

export function* addGetAllPlansWatcher() {
  yield takeLatest(actionTypes.GET_ALL_PLANS_REQUEST, getAllPlansFlow);
}

export default {
  addGetDronePlansWatcher,
  addGetAllPlansWatcher,
};

