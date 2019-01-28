import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, actionTypes } from '../appReducer/repairComment.reducer';
import commentApi from '../appApi/repairComment';

function* createRepairCommentFlow(data) {
  try {
    const { payload } = data;
    const { id, ...rest } = payload;

    const response = yield call(commentApi.createComment, id, rest);

    yield put(actions.createRepairCommentSuccess(response));
    yield put(actions.getRepairCommentsRequest({ repairInstanceId: id }));

    return response;
  } catch (err) {
    yield put(actions.createRepairCommentError(err.error));
    return false;
  }
}

function* createRepairSharedCommentFlow(data) {
  try {
    const { payload } = data;
    const { id, ...rest } = payload;

    const response = yield call(commentApi.createSharedComment, id, rest);

    yield put(actions.createRepairSharedCommentSuccess(response));
    yield put(actions.getRepairCommentsRequest({ repairInstanceId: id }));

    return response;
  } catch (err) {
    yield put(actions.createRepairSharedCommentError(err.error));
    return false;
  }
}

function* deleteRepairCommentFlow(data) {
  try {
    const { payload } = data;
    const { repairInstanceId, commentId } = payload;

    const response = yield call(commentApi.deleteComment, repairInstanceId, commentId);

    yield put(actions.deleteRepairCommentSuccess(response));
    yield put(actions.getRepairCommentsRequest({ repairInstanceId }));

    return response;
  } catch (err) {
    yield put(actions.deleteRepairCommentError(err.error));
    return false;
  }
}

function* getRepairCommentsFlow(data) {
  try {
    const { payload } = data;

    const response = yield call(commentApi.getComments, payload.repairInstanceId);

    yield put(actions.getRepairCommentsSuccess(response));

    return response;
  } catch (err) {
    yield put(actions.getRepairCommentsError(err.error));
    return false;
  }
}

export function* createRepairCommentWatcher() {
  yield takeLatest(actionTypes.CREATE_REPAIR_COMMENT_REQUEST, createRepairCommentFlow);
}

export function* createRepairSharedCommentWatcher() {
  yield takeLatest(actionTypes.CREATE_REPAIR_SHARED_COMMENT_REQUEST, createRepairSharedCommentFlow);
}

export function* deleteRepairCommentWatcher() {
  yield takeLatest(actionTypes.DELETE_REPAIR_COMMENT_REQUEST, deleteRepairCommentFlow);
}

export function* getRepairCommentsWatcher() {
  yield takeLatest(actionTypes.GET_REPAIR_COMMENTS_REQUEST, getRepairCommentsFlow);
}

export default {
  createRepairCommentWatcher,
  createRepairSharedCommentWatcher,
  getRepairCommentsWatcher,
  deleteRepairCommentWatcher,
};
