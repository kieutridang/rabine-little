import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------

const GET_SITE_METRICS_REQUEST = 'GET_SITE_METRICS_REQUEST';
const GET_SITE_METRICS_REQUEST_SUCCESS = 'GET_SITE_METRICS_REQUEST_SUCCESS';
const GET_SITE_METRICS_REQUEST_FAILED = 'GET_SITE_METRICS_REQUEST_FAILED';

export const actionTypes = {
  GET_SITE_METRICS_REQUEST,
  GET_SITE_METRICS_REQUEST_SUCCESS,
  GET_SITE_METRICS_REQUEST_FAILED,
};

// ------------------------------------
// Actions
// ------------------------------------

const getSiteMetricsRequest = createAction(GET_SITE_METRICS_REQUEST);
const getSiteMetricsRequestSuccess = createAction(GET_SITE_METRICS_REQUEST_SUCCESS);
const getSiteMetricsRequestFailed = createAction(GET_SITE_METRICS_REQUEST_FAILED);

export const actions = {
  getSiteMetricsRequest,
  getSiteMetricsRequestSuccess,
  getSiteMetricsRequestFailed,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  error: null,
  siteMetrics: undefined,
  isLoadingMetrics: false,
});

// Get siteRepairs
const getSiteMetricsHandler = (state) =>
  state.set('isLoadingMetrics', true);

const getSiteMetricsSuccessHandler = (state, action) =>
  state.set('siteMetrics', action.payload).set('isLoadingMetrics', false).set('error', null);

const getSiteMetricsFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload).set('isLoadingMetrics', false);

export default typeToReducer({
  [GET_SITE_METRICS_REQUEST]: getSiteMetricsHandler,
  [GET_SITE_METRICS_REQUEST_SUCCESS]: getSiteMetricsSuccessHandler,
  [GET_SITE_METRICS_REQUEST_FAILED]: getSiteMetricsFailedHandler,
}, initialState);
