import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

const ADD_SITE_SCREENSHOT_REQUEST = 'ADD_SITE_SCREENSHOT_REQUEST';
const ADD_SITE_SCREENSHOT_SUCCESS = 'ADD_SITE_SCREENSHOT_SUCCESS';
const ADD_SITE_SCREENSHOT_FAILED = 'ADD_SITE_SCREENSHOT_FAILED';

const GET_SITE_SCREENSHOTS_REQUEST = 'GET_SITE_SCREENSHOTS_REQUEST';
const GET_SITE_SCREENSHOTS_SUCCESS = 'GET_SITE_SCREENSHOTS_SUCCESS';
const GET_SITE_SCREENSHOTS_FAILED = 'GET_SITE_SCREENSHOTS_FAILED';

const CLEAR_SITE_SCREENSHOTS = 'CLEAR_SITE_SCREENSHOTS';

export const actionTypes = {
  ADD_SITE_SCREENSHOT_REQUEST,
  ADD_SITE_SCREENSHOT_SUCCESS,
  ADD_SITE_SCREENSHOT_FAILED,

  GET_SITE_SCREENSHOTS_REQUEST,
  GET_SITE_SCREENSHOTS_SUCCESS,
  GET_SITE_SCREENSHOTS_FAILED,

  CLEAR_SITE_SCREENSHOTS,
};

// ------------------------------------
// Actions
// ------------------------------------

const addSiteScreenshotRequest = createAction(ADD_SITE_SCREENSHOT_REQUEST);
const addSiteScreenshotSuccess = createAction(ADD_SITE_SCREENSHOT_SUCCESS);
const addSiteScreenshotFailed = createAction(ADD_SITE_SCREENSHOT_FAILED);

const getSiteScreenshotRequest = createAction(GET_SITE_SCREENSHOTS_REQUEST);
const getSiteScreenshotSuccess = createAction(GET_SITE_SCREENSHOTS_SUCCESS);
const getSiteScreenshotFailed = createAction(GET_SITE_SCREENSHOTS_FAILED);

const clearSiteScreenshot = createAction(CLEAR_SITE_SCREENSHOTS);

export const actions = {
  addSiteScreenshotRequest,
  addSiteScreenshotSuccess,
  addSiteScreenshotFailed,

  getSiteScreenshotRequest,
  getSiteScreenshotSuccess,
  getSiteScreenshotFailed,

  clearSiteScreenshot,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  error: null,
  isLoading: false,
  screenshots: null,
});

// add screenshot site

const addScreenshotSiteRequestHandler = (state) =>
  state.set('isLoading', true).set('error', null);

const addScreenshotSiteSuccessHandler = (state, action) => {
  const screenshots = state.get('screenshots');
  const newScreenshot = action.payload;

  return state
    .set('isLoading', false)
    .set('error', null)
    .set('screenshots', [...screenshots.filter((screenshot) => screenshot.layerId !== newScreenshot.layerId), newScreenshot]);
};


const addScreenshotSiteFailedHandler = (state, action) =>
  state.set('isLoading', false).set('error', action.payload).set('screenshots', null);

// get screenshots file

const getScreenshotSiteRequestHandler = (state) =>
  state.set('isLoading', true).set('error', null).set('screenshots', null);

const getScreenshotSiteSuccessHandler = (state, action) =>
  state.set('isLoading', false).set('screenshots', action.payload);

const getScreenshotSiteFailedHandler = (state, action) =>
  state.set('isLoading', false).set('error', action.payload);

const clearSiteScreenshotHandler = (state) =>
  state.set('isLoading', false).set('error', null).set('screenshots', null);

export default typeToReducer({
  [ADD_SITE_SCREENSHOT_REQUEST]: addScreenshotSiteRequestHandler,
  [ADD_SITE_SCREENSHOT_SUCCESS]: addScreenshotSiteSuccessHandler,
  [ADD_SITE_SCREENSHOT_FAILED]: addScreenshotSiteFailedHandler,

  [GET_SITE_SCREENSHOTS_REQUEST]: getScreenshotSiteRequestHandler,
  [GET_SITE_SCREENSHOTS_SUCCESS]: getScreenshotSiteSuccessHandler,
  [GET_SITE_SCREENSHOTS_FAILED]: getScreenshotSiteFailedHandler,

  [CLEAR_SITE_SCREENSHOTS]: clearSiteScreenshotHandler,
}, initialState);
