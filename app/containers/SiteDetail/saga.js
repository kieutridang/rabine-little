import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/api/request';
import { API_URL, API_SITE_DETAIL_BY_ID } from 'utils/constants';
import * as constants from './constants';
import * as actions from './actions';

export function* fetchSiteDetail(action) {
  try {
    const response = yield call(request, `${API_URL}/${API_SITE_DETAIL_BY_ID(action.payload.id)}`);

    if (response && !response.error) {
      yield put(actions.fetchDetailSuccessfully(response));
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    yield put(actions.fetchDetailFail(error));
  }
}

export default function* saga() {
  yield takeLatest(constants.FETCH_SITE_DETAIL, fetchSiteDetail);
}
