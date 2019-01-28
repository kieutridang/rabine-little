import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/s3.reducer';
import s3Api from '../appApi/s3';

function* fetchS3FoldersFlow() {
  try {
    const response = yield call(s3Api.getS3Folders);
    yield put(actions.getS3FoldersRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getS3FoldersRequestFailed(err.error));
    return false;
  }
}

function* fetchS3InfoFlow(action) {
  try {
    const response = yield call(s3Api.getS3SyncInfo, action.payload);
    yield put(actions.getS3SyncInfoRequestSuccess(response));
    return response;
  } catch (err) {
    yield put(actions.getS3FoldersRequestFailed(err.error));
    return false;
  }
}

function* syncS3FolderFlow(action) {
  const { rabineS3Folder } = action.payload;

  try {
    yield put(actions.getS3SyncInfoRequest(rabineS3Folder));
    const response = yield call(s3Api.syncS3Folder, action.payload);
    yield put(actions.syncS3FolderRequestSuccess(rabineS3Folder));
    yield put(actions.getS3SyncInfoRequest(rabineS3Folder));

    return response;
  } catch (err) {
    yield put(actions.syncS3FolderRequestFailed(err.error));
    yield put(actions.getS3SyncInfoRequest(rabineS3Folder));

    return false;
  }
}

export function* fetchS3FoldersWatcher() {
  yield takeLatest(actionTypes.GET_S3_FOLDERS_REQUEST, fetchS3FoldersFlow);
}

export function* fetchS3InfoFlowWatcher() {
  yield takeLatest(actionTypes.GET_S3_SYNC_INFO, fetchS3InfoFlow);
}

export function* syncS3FolderFlowWatcher() {
  yield takeLatest(actionTypes.SYNC_S3_FOLDER, syncS3FolderFlow);
}

export default {
  fetchS3FoldersWatcher,
  fetchS3InfoFlowWatcher,
  syncS3FolderFlowWatcher,
};
