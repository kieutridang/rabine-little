import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------
const ADD_CLIENT_REQUEST = 'ADD_CLIENT_REQUEST';
const ADD_CLIENT_REQUEST_FAILED = 'ADD_CLIENT_REQUEST_FAILED';
const ADD_CLIENT_REQUEST_SUCCESS = 'ADD_CLIENT_REQUEST_SUCCESS';
const SHOW_ADD_CLIENT = 'SHOW_ADD_CLIENT';

const GET_CLIENTS_REQUEST = 'GET_CLIENTS_REQUEST';
const GET_CLIENTS_SUCCESS = 'GET_CLIENTS_SUCCESS';

export const actionTypes = {
  ADD_CLIENT_REQUEST,
  ADD_CLIENT_REQUEST_FAILED,
  ADD_CLIENT_REQUEST_SUCCESS,
  GET_CLIENTS_REQUEST,
  GET_CLIENTS_SUCCESS,
};

// ------------------------------------
// Actions
// ------------------------------------

const showAddClient = createAction(SHOW_ADD_CLIENT);
const addClientRequest = createAction(ADD_CLIENT_REQUEST);
const addClientRequestFailed = createAction(ADD_CLIENT_REQUEST_FAILED);
const addClientRequestSuccess = createAction(ADD_CLIENT_REQUEST_SUCCESS);

const getClientsRequest = createAction(GET_CLIENTS_REQUEST);
const getClientsSuccess = createAction(GET_CLIENTS_SUCCESS);

export const actions = {
  addClientRequest,
  addClientRequestFailed,
  addClientRequestSuccess,
  showAddClient,
  getClientsRequest,
  getClientsSuccess,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  client: undefined,
  error: null,
  isOpen: false,
  clients: undefined,
});

// Get clients

const getClientsHandler = (state) =>
  state.set('error', null);

const getClientsSuccessHandler = (state, action) =>
  state.set('clients', action.payload).set('error', null);


// Add client

const addClientRequestHandler = (state) =>
  state.set('error', null);

const addClientRequestFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload);

const addClientRequestSuccessHandler = (state, action) =>
  state.set('error', null).set('client', action.payload);


const showAddClientHandler = (state, action) =>
  state.set('isOpen', action.payload || !(state.get('isOpen')));

export default typeToReducer({
  [ADD_CLIENT_REQUEST]: addClientRequestHandler,
  [ADD_CLIENT_REQUEST_SUCCESS]: addClientRequestSuccessHandler,
  [ADD_CLIENT_REQUEST_FAILED]: addClientRequestFailedHandler,

  [SHOW_ADD_CLIENT]: showAddClientHandler,

  [GET_CLIENTS_REQUEST]: getClientsHandler,
  [GET_CLIENTS_SUCCESS]: getClientsSuccessHandler,
}, initialState);
