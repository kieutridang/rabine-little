import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from './orderDetail.reducer';
import orderApi from '../../appApi/order';

function* getOrderByIdFlow({ payload }) {
  try {
    const response = yield call(orderApi.getOrderById, payload);
    yield put(actions.getOrderByIdSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getOrderByIdError(err));
    return false;
  }
}

export function* getOrderByIdWatcher() {
  yield takeLatest(actionTypes.GET_ORDER_BY_ID_REQUEST, getOrderByIdFlow);
}

function* updateOrderFlow({ payload }) {
  try {
    const { siteId, orderId } = payload;
    const response = yield call(orderApi.updateOrder, payload);
    yield put(actions.updateOrderSuccess(response));
    yield put(actions.getOrderActivities({ siteId, orderId }));
    return response;
  } catch (err) {
    yield put(actions.updateOrderError(err));
    return false;
  }
}

export function* updateOrderWatcher() {
  yield takeLatest(actionTypes.UPDATE_ORDER_REQUEST, updateOrderFlow);
}

function* getOrderActivitiesFlow({ payload }) {
  try {
    const response = yield call(orderApi.getOrderActivities, payload);
    yield put(actions.getOrderActivitiesSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getOrderActivitiesError(err));
    return false;
  }
}

export function* getOrderActivitiesWatcher() {
  yield takeLatest(actionTypes.GET_ORDER_ACTIVITIES_REQUEST, getOrderActivitiesFlow);
}

function* createOrderNoteFlow({ payload }) {
  try {
    const { siteId, orderId } = payload;
    const response = yield call(orderApi.createOrderNote, payload);
    yield put(actions.submitOrderNoteSuccess(response));
    yield put(actions.changeOrderNote(''));
    yield put(actions.getOrderActivities({ siteId, orderId }));
    return response;
  } catch (err) {
    yield put(actions.submitOrderNoteFail(err));
    return false;
  }
}

export function* createOrderNoteWatcher() {
  yield takeLatest(actionTypes.SUBMIT_ORDER_NOTE, createOrderNoteFlow);
}

export default {
  getOrderByIdWatcher,
  updateOrderWatcher,
  getOrderActivitiesWatcher,
  createOrderNoteWatcher,
};
