import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------

const GET_PLANS_REQUEST = 'GET_PLANS_REQUEST';
const GET_PLANS_REQUEST_SUCCESS = 'GET_PLANS_REQUEST_SUCCESS';
const GET_PLANS_REQUEST_FAILED = 'GET_PLANS_REQUEST_FAILED';

export const actionTypes = {
  GET_PLANS_REQUEST,
  GET_PLANS_REQUEST_SUCCESS,
  GET_PLANS_REQUEST_FAILED,
};

// ------------------------------------
// Actions
// ------------------------------------

const getDronePlansRequest = createAction(GET_PLANS_REQUEST);
const getDronePlansRequestSuccess = createAction(GET_PLANS_REQUEST_SUCCESS);
const getDronePlansRequestFailed = createAction(GET_PLANS_REQUEST_FAILED);

export const actions = {
  getDronePlansRequest,
  getDronePlansRequestSuccess,
  getDronePlansRequestFailed,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  error: null,
  dronePlans: undefined,
});

// Get plans

const getDronePlansHandler = (state) =>
  state.set('dronePlans', null);

const getDronePlansSuccessHandler = (state, action) =>
  state.set('dronePlans', action.payload).set('error', null);

const getDronePlansFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload);

export default typeToReducer({
  [GET_PLANS_REQUEST]: getDronePlansHandler,
  [GET_PLANS_REQUEST_SUCCESS]: getDronePlansSuccessHandler,
  [GET_PLANS_REQUEST_FAILED]: getDronePlansFailedHandler,
}, initialState);
