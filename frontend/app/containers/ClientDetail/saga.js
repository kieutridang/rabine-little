import { call, put, takeLatest, select } from 'redux-saga/effects';

import { rabineFetcher } from '../../appApi/fetcher/rabineFetcher';
import { API_CLIENT_DETAIL_BY_ID, API_CLIENT_ID, API_CLIENT_DETAIL_NOTE_BY_ID } from '../../constants/index';
import * as constants from './constants';
import * as actions from './actions';
import * as selector from './selector';

export function* fetchClientDetail(action) {
  try {
    const response = yield call(rabineFetcher.get, API_CLIENT_DETAIL_BY_ID(action.payload.id));
    if (response && !response.error) {
      yield put(actions.fetchDetailSuccessfully(response));
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    yield put(actions.fetchDetailFail(error));
  }
}
export function* fetchClientNote(action) {
  try {
    const response = yield call(rabineFetcher.get, API_CLIENT_DETAIL_NOTE_BY_ID(action.payload.id));
    if (response && !response.error) {
      yield put(actions.fetchClientNoteSuccessfully(response));
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    yield put(actions.fetchClientNoteFail(error));
  }
}
export function* submitNote() {
  try {
    const detailData = yield select(selector.DetailData());
    const noteContent = yield select(selector.NoteContent());
    const response = yield call(
      rabineFetcher.put,
      API_CLIENT_DETAIL_NOTE_BY_ID(detailData.id),
      {
        client: detailData.name,
        notes: noteContent,
      });
    if (response && !response.error) {
      yield put(actions.submitNoteSuccessfully(response));
      yield put(actions.fetchClientNote(detailData.id));
    }
  } catch (error) {
    yield put(actions.submitNoteFail(error));
  }
}

export function* editDetail(action) {
  try {
    const detailData = yield select(selector.DetailData());
    const { data } = action.payload;
    const response = yield call(rabineFetcher.put, API_CLIENT_ID(detailData.id), data);
    if (response && !response.error) {
      yield put(actions.fetchDetail(detailData.id));
      yield put(actions.closeEdit());
    }
  } catch (error) {
    yield put(actions.editClientRequestFail(error));
  }
}

export default function* saga() {
  yield takeLatest(constants.FETCH_CLIENT_DETAIL, fetchClientDetail);
  yield takeLatest(constants.EDIT_CLIENT_DETAIL, editDetail);
  yield takeLatest(constants.SUBMIT_NOTE, submitNote);
  yield takeLatest(constants.FETCH_CLIENT_NOTE, fetchClientNote);
}
