import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, actionTypes } from '../appReducer/comment.reducer';
import commentApi from '../appApi/comment';

function* createCommentFlow(data) {
  try {
    const { payload } = data;
    const { id, ...rest } = payload;
    const response = yield call(commentApi.createComment, id, rest);
    yield put(actions.createCommentSuccess(response));
    yield put(actions.getCommentsRequest({ siteId: id }));
    return response;
  } catch (err) {
    yield put(actions.createCommentError(err.error));
    return false;
  }
}

function* createSharedCommentFlow(data) {
  try {
    const { payload } = data;
    const { id, ...rest } = payload;
    const response = yield call(commentApi.createSharedComment, id, rest);
    yield put(actions.createSharedCommentSuccess(response));
    yield put(actions.getCommentsRequest({ siteId: id }));
    return response;
  } catch (err) {
    yield put(actions.createSharedCommentError(err.error));
    return false;
  }
}

function* deleteCommentFlow(data) {
  try {
    const { payload } = data;
    const { siteId, commentId } = payload;
    const response = yield call(commentApi.deleteComment, siteId, commentId);
    yield put(actions.deleteCommentSuccess(response));
    yield put(actions.getCommentsRequest({ siteId }));
    return response;
  } catch (err) {
    yield put(actions.deleteCommentError(err.error));
    return false;
  }
}

function* getCommentsFlow(data) {
  try {
    const { payload } = data;
    const response = yield call(commentApi.getComments, payload.siteId);
    yield put(actions.getCommentsSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getCommentsError(err.error));
    return false;
  }
}

export function* createCommentWatcher() {
  yield takeLatest(actionTypes.CREATE_COMMENT_REQUEST, createCommentFlow);
}

export function* createSharedCommentWatcher() {
  yield takeLatest(actionTypes.CREATE_SHARED_COMMENT_REQUEST, createSharedCommentFlow);
}

export function* deleteCommentWatcher() {
  yield takeLatest(actionTypes.DELETE_COMMENT_REQUEST, deleteCommentFlow);
}

export function* getCommentsWatcher() {
  yield takeLatest(actionTypes.GET_COMMENTS_REQUEST, getCommentsFlow);
}

export default {
  createCommentWatcher,
  createSharedCommentWatcher,
  getCommentsWatcher,
  deleteCommentWatcher,
};
