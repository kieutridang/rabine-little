import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------

const GET_PLANS_REQUEST = 'GET_PLANS_REQUEST';
const GET_PLANS_REQUEST_SUCCESS = 'GET_PLANS_REQUEST_SUCCESS';
const GET_PLANS_REQUEST_FAILED = 'GET_PLANS_REQUEST_FAILED';

const GET_ALL_PLANS_REQUEST = 'GET_ALL_PLANS_REQUEST';
const GET_ALL_PLANS_REQUEST_SUCCESS = 'GET_ALL_PLANS_REQUEST_SUCCESS';
const GET_ALL_PLANS_REQUEST_FAILED = 'GET_ALL_PLANS_REQUEST_FAILED';

export const actionTypes = {
  GET_PLANS_REQUEST,
  GET_PLANS_REQUEST_SUCCESS,
  GET_PLANS_REQUEST_FAILED,

  GET_ALL_PLANS_REQUEST,
  GET_ALL_PLANS_REQUEST_SUCCESS,
  GET_ALL_PLANS_REQUEST_FAILED,
};

// ------------------------------------
// Actions
// ------------------------------------

const getDronePlansRequest = createAction(GET_PLANS_REQUEST);
const getDronePlansRequestSuccess = createAction(GET_PLANS_REQUEST_SUCCESS);
const getDronePlansRequestFailed = createAction(GET_PLANS_REQUEST_FAILED);

const getAllPlansRequest = createAction(GET_ALL_PLANS_REQUEST);
const getAllPlansRequestSuccess = createAction(GET_ALL_PLANS_REQUEST_SUCCESS);
const getAllPlansRequestFailed = createAction(GET_ALL_PLANS_REQUEST_FAILED);

export const actions = {
  getDronePlansRequest,
  getDronePlansRequestSuccess,
  getDronePlansRequestFailed,

  getAllPlansRequest,
  getAllPlansRequestSuccess,
  getAllPlansRequestFailed,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  error: null,
  dronePlans: undefined,
  errorLoadingAll: null,
  allPlans: undefined,
});

// Get plans
const getDronePlansHandler = (state) =>
  state.set('isLoadingDronePlans', true)
    .set('dronePlans', null);

const getDronePlansSuccessHandler = (state, action) =>
  state.set('dronePlans', action.payload)
    .set('isLoadingDronePlans', false)
    .set('error', null);

const getDronePlansFailedHandler = (state = initialState, action) =>
  state.set('isLoadingDronePlans', false)
    .set('error', action.payload);

// Get all plans
const getAllPlansHandler = (state) =>
  state.set('allPlans', null);

const getAllPlansSuccessHandler = (state, action) =>
  state.set('allPlans', action.payload)
    .set('errorLoadingAll', null);

const getAllPlansFailedHandler = (state = initialState, action) =>
  state.set('errorLoadingAll', action.payload);

export default typeToReducer({
  [GET_PLANS_REQUEST]: getDronePlansHandler,
  [GET_PLANS_REQUEST_SUCCESS]: getDronePlansSuccessHandler,
  [GET_PLANS_REQUEST_FAILED]: getDronePlansFailedHandler,

  [GET_ALL_PLANS_REQUEST]: getAllPlansHandler,
  [GET_ALL_PLANS_REQUEST_SUCCESS]: getAllPlansSuccessHandler,
  [GET_ALL_PLANS_REQUEST_FAILED]: getAllPlansFailedHandler,
}, initialState);
