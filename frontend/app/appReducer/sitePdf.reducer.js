import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

const ADD_SITE_PDF_REQUEST = 'ADD_SITE_PDF_REQUEST';
const ADD_SITE_PDF_SUCCESS = 'ADD_SITE_PDF_SUCCESS';
const ADD_SITE_PDF_FAILED = 'ADD_SITE_PDF_FAILED';

const GET_SITE_PDF_REQUEST = 'GET_SITE_PDF_REQUEST';
const GET_SITE_PDF_REQUEST_SUCCESS = 'GET_SITE_PDF_REQUEST_SUCCESS';
const GET_SITE_PDF_REQUEST_FAILED = 'GET_SITE_PDF_REQUEST_FAILED';

export const actionTypes = {
  ADD_SITE_PDF_REQUEST,
  ADD_SITE_PDF_SUCCESS,
  ADD_SITE_PDF_FAILED,

  GET_SITE_PDF_REQUEST,
  GET_SITE_PDF_REQUEST_SUCCESS,
  GET_SITE_PDF_REQUEST_FAILED,
};

// ------------------------------------
// Actions
// ------------------------------------

const addSitePdfRequest = createAction(ADD_SITE_PDF_REQUEST);
const addSitePdfRequestSuccess = createAction(ADD_SITE_PDF_SUCCESS);
const addSitePdfRequestFailed = createAction(ADD_SITE_PDF_FAILED);

const getSitePdfRequest = createAction(GET_SITE_PDF_REQUEST);
const getSitePdfRequestSuccess = createAction(GET_SITE_PDF_REQUEST_SUCCESS);
const getSitePdfRequestFailed = createAction(GET_SITE_PDF_REQUEST_FAILED);

export const actions = {
  addSitePdfRequest,
  addSitePdfRequestSuccess,
  addSitePdfRequestFailed,

  getSitePdfRequest,
  getSitePdfRequestSuccess,
  getSitePdfRequestFailed,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  error: null,
  isLoading: false,
});

const addSitePdfRequestHandler = (state) =>
  state.set('isLoading', true).set('error', null);


const addSitePdfRequestSuccessHandler = (state, action) =>
  state
    .set('isLoading', false)
    .set('error', null)
    .set('pdfDocument', action.payload);


const addSitePdfRequestFailedHandler = (state, action) =>
  state.set('isLoading', false).set('error', action.payload).set('pdfDocument', null);

const getSitePdfRequestHandler = (state) =>
  state.set('isLoading', true).set('error', null);

const getSitePdfRequestSuccessHandler = (state, action) =>
  state
    .set('isLoading', false)
    .set('error', null)
    .set('pdfDocument', action.payload);

const getSitePdfRequestFailedHandler = (state, action) => {
  state.set('isLoading', false).set('error', action.payload).set('pdfDocument', null);
};

export default typeToReducer({
  [ADD_SITE_PDF_REQUEST]: addSitePdfRequestHandler,
  [ADD_SITE_PDF_SUCCESS]: addSitePdfRequestSuccessHandler,
  [ADD_SITE_PDF_FAILED]: addSitePdfRequestFailedHandler,

  [GET_SITE_PDF_REQUEST]: getSitePdfRequestHandler,
  [GET_SITE_PDF_REQUEST_SUCCESS]: getSitePdfRequestSuccessHandler,
  [GET_SITE_PDF_REQUEST_FAILED]: getSitePdfRequestFailedHandler,
}, initialState);
