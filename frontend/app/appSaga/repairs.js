import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/repairs.reducer';
import repairsAPI from '../appApi/repairs';

function* getRepairsFlow() {
  try {
    const response = yield call(repairsAPI.getRepairs);
    yield put(actions.getRepairsRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getRepairsRequestFailed(err.error));
    return false;
  }
}

export function* addGetRepairsWatcher() {
  yield takeLatest(actionTypes.GET_REPAIRS_REQUEST, getRepairsFlow);
}

export default {
  addGetRepairsWatcher,
};
