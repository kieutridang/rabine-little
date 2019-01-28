import { fromJS } from 'immutable';
import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';

const FETCH_AREA_VIDEOS = 'FETCH_AREA_VIDEOS';
const FETCH_AREA_VIDEOS_SUCCESS = 'FETCH_AREA_VIDEOS_SUCCESS';
const FETCH_AREA_VIDEOS_FAILED = 'FETCH_AREA_VIDEOS_FAILED';

export const actionTypes = {
  FETCH_AREA_VIDEOS,
  FETCH_AREA_VIDEOS_SUCCESS,
  FETCH_AREA_VIDEOS_FAILED,
};

const fetchAreaVideos = createAction(FETCH_AREA_VIDEOS);
const fetchAreaVideosSuccess = createAction(FETCH_AREA_VIDEOS_SUCCESS);
const fetchAreaVideosFailed = createAction(FETCH_AREA_VIDEOS_FAILED);

export const actions = {
  fetchAreaVideos,
  fetchAreaVideosSuccess,
  fetchAreaVideosFailed,
};

const initialState = fromJS({
  error: null,
  areaVideos: undefined,
  isLoading: false,
});

// fetch Area Videos
const fetchAreaVideosHandler = (state) =>
  state.set('isLoading', true).set('areaVideos', null);

const fetchAreaVideosSuccessHandler = (state, action) =>
  state.set('error', null).set('areaVideos', action.payload).set('isLoading', false);

const fetchAreaVideosFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload).set('isLoading', false);

export default typeToReducer({
  [FETCH_AREA_VIDEOS]: fetchAreaVideosHandler,
  [FETCH_AREA_VIDEOS_SUCCESS]: fetchAreaVideosSuccessHandler,
  [FETCH_AREA_VIDEOS_FAILED]: fetchAreaVideosFailedHandler,
}, initialState);
