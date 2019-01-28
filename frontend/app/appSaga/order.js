import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/order.reducer';
import orderApi from '../appApi/order';

function* getOrdersFlow(data) {
  try {
    const response = yield call(orderApi.getOrders, data);
    yield put(actions.getOrderSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getOrdersError(err));
    return false;
  }
}

export function* addGetOrdersWatcher() {
  yield takeLatest(actionTypes.GET_ORDERS_REQUEST, getOrdersFlow);
}

export default {
  addGetOrdersWatcher,
};
