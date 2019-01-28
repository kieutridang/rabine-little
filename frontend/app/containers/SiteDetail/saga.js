import { call, put, takeLatest, select } from 'redux-saga/effects';
import { API_SITE_DETAIL_BY_ID, API_SITE_DETAIL_ACTIVITY_BY_ID } from '../../constants/index';
import * as constants from './constants';
import * as actions from './actions';
import * as selector from './selector';
import { rabineFetcher } from '../../appApi/fetcher/rabineFetcher';
import siteApi from '../../appApi/site';

import { actions as s3Actions } from '../../appReducer/s3.reducer';

export function* fetchSiteDetail(action) {
  try {
    const response = yield call(
      rabineFetcher.get,
      API_SITE_DETAIL_BY_ID(action.payload.id, action.payload.token)
    );

    if (response && !response.error) {
      yield put(actions.fetchDetailSuccessfully(response));
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    yield put(actions.fetchDetailFail(error));
  }
}

export function* submitNote() {
  try {
    const detailData = yield select(selector.DetailData());
    const { name } = detailData;
    const noteContent = yield select(selector.NoteContent());
    const response = yield call(
      rabineFetcher.put,
      API_SITE_DETAIL_ACTIVITY_BY_ID(detailData.id),
      {
        title: name,
        notes: noteContent,
        type: 'comment',
      }
    );

    if (response && !response.error) {
      yield put(actions.submitNoteSuccessfully(response));
      yield put(actions.fetchDetail(detailData.id));
    }
  } catch (error) {
    yield put(actions.submitNoteFail(error));
  }
}

export function* updateSiteStatus(action) {
  try {
    const siteId = action.payload.id;
    const { data } = action.payload;

    const response = yield call(
      rabineFetcher.put,
      API_SITE_DETAIL_ACTIVITY_BY_ID(siteId),
      data
    );

    if (response && !response.error) {
      yield put(actions.updateSiteStatusSuccessfully(response));
      yield put(actions.fetchDetail(siteId));
    }
  } catch (error) {
    yield put(actions.updateSiteStatusFail(error));
  } finally {
    yield put(actions.resetShowMessage());
  }
}

export function* editDetail(action) {
  try {
    const detailData = yield select(selector.DetailData());
    const { data } = action.payload;
    const response = yield call(
      siteApi.updateSiteInfo,
      detailData.id,
      data
    );

    if (response && !response.error) {
      yield put(actions.fetchDetail(detailData.id));
      yield put(actions.closeEdit());
      yield put(s3Actions.getS3SyncInfoRequest(data.rabineS3Folder));
    }
  } catch (error) {
    yield put(actions.editSiteRequestFail(error));
  }
}

export default function* saga() {
  yield takeLatest(constants.FETCH_SITE_DETAIL, fetchSiteDetail);
  yield takeLatest(constants.SUBMIT_NOTE, submitNote);
  yield takeLatest(constants.UPDATE_SITE_STATUS, updateSiteStatus);
  yield takeLatest(constants.EDIT_SITE_DETAIL, editDetail);
}
