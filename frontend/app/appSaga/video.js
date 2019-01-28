import { call, put, takeLatest } from 'redux-saga/effects';

import { actions, actionTypes } from '../appReducer/video.reducer';
import { areaVideosApi } from '../appApi/video';

function* getAreaVideos(action) {
  try {
    const data = action.payload;
    const response = yield call(areaVideosApi.getAreaVideos, data);
    yield put(actions.fetchAreaVideosSuccess(response.videos));
    return response;
  } catch (err) {
    yield put(actions.fetchAreaVideosFailed(err.error));
    return false;
  }
}

export function* addGetAreaVideosWatcher() {
  yield takeLatest(actionTypes.FETCH_AREA_VIDEOS, getAreaVideos);
}


export default {
  addGetAreaVideosWatcher,
};
