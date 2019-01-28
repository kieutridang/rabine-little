import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

const ADD_BID_SHEET_VALUES_REQUEST = 'ADD_BID_SHEET_VALUES_REQUEST';
const ADD_BID_SHEET_VALUES_SUCCESS = 'ADD_BID_SHEET_VALUES_SUCCESS';
const ADD_BID_SHEET_VALUES_FAILED = 'ADD_BID_SHEET_VALUES_FAILED';
const GET_BID_SHEET_VALUES_REQUEST = 'GET_BID_SHEET_VALUES_REQUEST';
const GET_BID_SHEET_VALUES_SUCCESS = 'GET_BID_SHEET_VALUES_SUCCESS';
const GET_BID_SHEET_VALUES_FAILED = 'GET_BID_SHEET_VALUES_FAILED';
const CLEAR_BID_SHEET_VALUES = 'CLEAR_BID_SHEET_VALUES';

export const actionTypes = {
  ADD_BID_SHEET_VALUES_REQUEST,
  ADD_BID_SHEET_VALUES_SUCCESS,
  ADD_BID_SHEET_VALUES_FAILED,

  GET_BID_SHEET_VALUES_REQUEST,
  GET_BID_SHEET_VALUES_SUCCESS,
  GET_BID_SHEET_VALUES_FAILED,

  CLEAR_BID_SHEET_VALUES,
};

// ------------------------------------
// Actions
// ------------------------------------

const addBidSheetRequest = createAction(ADD_BID_SHEET_VALUES_REQUEST);
const addBidSheetSuccess = createAction(ADD_BID_SHEET_VALUES_SUCCESS);
const addBidSheetFailed = createAction(ADD_BID_SHEET_VALUES_FAILED);

const getBidSheetRequest = createAction(GET_BID_SHEET_VALUES_REQUEST);
const getBidSheetSuccess = createAction(GET_BID_SHEET_VALUES_SUCCESS);
const getBidSheetFailed = createAction(GET_BID_SHEET_VALUES_FAILED);

const clearBidSheetValues = createAction(CLEAR_BID_SHEET_VALUES);

export const actions = {
  addBidSheetRequest,
  addBidSheetSuccess,
  addBidSheetFailed,

  getBidSheetRequest,
  getBidSheetSuccess,
  getBidSheetFailed,

  clearBidSheetValues,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  error: null,
  bidSheetValues: null,
  isLoading: false,
  valuesSaved: false,
});

// add bid sheet values

const addBidSheetRequestHandler = (state) =>
    state.set('isLoading', true).set('error', null).set('valuesSaved', false);

const addBidSheetFailedHandler = (state, action) =>
    state.set('isLoading', false).state.set('error', action.payload).set('valuesSaved', false);

const addBidSheetSuccessHandler = (state, action) =>
    state.set('error', null).set('bidSheetValues', action.payload).set('isLoading', false).set('valuesSaved', true);

// get bid sheet values

const getBidSheetRequestHandler = (state) =>
    state.set('isLoading', true).set('error', null).set('valuesSaved', false).set('bidSheetValues', null);

const getBidSheetSuccessHandler = (state, action) =>
    state.set('isLoading', false).set('bidSheetValues', action.payload);

const getBidSheetFailedHandler = (state, action) =>
    state.set('error', action.payload).set('isLoading', false);

const clearBidSheetValuesHandler = (state) =>
    state.set('bidSheetValues', null).set('valuesSaved', false).set('error', null).set('isLoading', false);


export default typeToReducer({
  [ADD_BID_SHEET_VALUES_REQUEST]: addBidSheetRequestHandler,
  [ADD_BID_SHEET_VALUES_SUCCESS]: addBidSheetSuccessHandler,
  [ADD_BID_SHEET_VALUES_FAILED]: addBidSheetFailedHandler,

  [GET_BID_SHEET_VALUES_REQUEST]: getBidSheetRequestHandler,
  [GET_BID_SHEET_VALUES_SUCCESS]: getBidSheetSuccessHandler,
  [GET_BID_SHEET_VALUES_FAILED]: getBidSheetFailedHandler,

  [CLEAR_BID_SHEET_VALUES]: clearBidSheetValuesHandler,
}, initialState);
