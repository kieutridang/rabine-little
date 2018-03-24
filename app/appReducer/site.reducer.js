import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------
const ADD_SITE_REQUEST = 'ADD_SITE_REQUEST';
const ADD_SITE_REQUEST_FAILED = 'ADD_SITE_REQUEST_FAILED';
const ADD_SITE_REQUEST_SUCCESS = 'ADD_SITE_REQUEST_SUCCESS';

const SHOW_ADD_SITE = 'SHOW_ADD_SITE';

const GET_SITES_REQUEST = 'GET_SITES_REQUEST';
const GET_SITES_SUCCESS = 'GET_SITES_SUCCESS';

export const actionTypes = {
  ADD_SITE_REQUEST,
  ADD_SITE_REQUEST_FAILED,
  ADD_SITE_REQUEST_SUCCESS,

  GET_SITES_REQUEST,
  GET_SITES_SUCCESS,
};

// ------------------------------------
// Actions
// ------------------------------------

const showAddSite = createAction(SHOW_ADD_SITE);

const addSiteRequest = createAction(ADD_SITE_REQUEST);
const addSiteRequestFailed = createAction(ADD_SITE_REQUEST_FAILED);
const addSiteRequestSuccess = createAction(ADD_SITE_REQUEST_SUCCESS);

const getSitesRequest = createAction(GET_SITES_REQUEST);
const getSitesSuccess = createAction(GET_SITES_SUCCESS);

export const actions = {
  showAddSite,

  addSiteRequest,
  addSiteRequestFailed,
  addSiteRequestSuccess,

  getSitesRequest,
  getSitesSuccess,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  site: undefined,
  error: null,
  isOpen: false,
  sites: undefined,
});

// Get sites

const getSitesHandler = (state) =>
  state.set('error', null);

const getSitesSuccessHandler = (state, action) =>
  state.set('sites', action.payload).set('error', null);


// Add site

const addSiteRequestHandler = (state) =>
  state.set('error', null);

const addSiteRequestFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload);

const addSiteRequestSuccessHandler = (state, action) =>
  state.set('error', null).set('site', action.payload);

const showAddSiteHandler = (state, action) =>
  state.set('isOpen', action.payload || !(state.get('isOpen')));

export default typeToReducer({
  [ADD_SITE_REQUEST]: addSiteRequestHandler,
  [ADD_SITE_REQUEST_SUCCESS]: addSiteRequestSuccessHandler,
  [ADD_SITE_REQUEST_FAILED]: addSiteRequestFailedHandler,

  [SHOW_ADD_SITE]: showAddSiteHandler,

  [GET_SITES_REQUEST]: getSitesHandler,
  [GET_SITES_SUCCESS]: getSitesSuccessHandler,
}, initialState);
