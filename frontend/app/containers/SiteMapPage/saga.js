import { delay } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { rabineFetcher } from '../../appApi/fetcher/rabineFetcher';
import {
  API_SITE_MAP_DATA_BY_ID,
  API_SITE_UPDATE_SITE_MAP_DATA_BY_ID,
  API_SITE_DETAIL_BY_ID,
} from '../../constants';
import * as constants from './constants';
import * as actions from './actions';

export function* fetchSiteDetail(action) {
  try {
    const response = yield call(
      rabineFetcher.get,
      API_SITE_DETAIL_BY_ID(action.payload.id)
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

export function* fetchSiteMapData(action) {
  try {
    const response = yield call(rabineFetcher.get, API_SITE_MAP_DATA_BY_ID(action.payload.id));

    if (response && !response.error) {
      yield put(actions.fetchSiteMapDataSuccessfully(response));
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    yield put(actions.fetchSiteMapDataFail(error));
  }
}

export function* submitSiteMapData(action) {
  yield call(delay, 200); // debounce

  try {
    const { data, layers, id: siteId } = action.payload;

    const response = yield call(
      rabineFetcher.put,
      API_SITE_UPDATE_SITE_MAP_DATA_BY_ID(siteId),
      { features: data.features, layers }
    );

    if (response && !response.error) {
      yield put(actions.submitSiteMapDataSuccessfully(response));
    }
  } catch (error) {
    yield put(actions.submitSiteMapDataFail(error));
  }
}

export default function* () {
  yield takeLatest(constants.FETCH_SITE_MAP_DATA, fetchSiteMapData);
  yield takeLatest(constants.SUBMIT_SITE_MAP_DATA, submitSiteMapData);
  yield takeLatest(constants.FETCH_SITE_DETAIL, fetchSiteDetail);
}
