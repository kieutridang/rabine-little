import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

//-----------------------------------
// CONSTANTS
//-----------------------------------

const GET_ORDERS_REQUEST = 'GET_ORDERS_REQUEST';
const GET_ORDERS_ERROR = 'GET_ORDERS_ERROR';
const GET_ORDERS_SUCCESS = 'GET_ORDERS_SUCCESS';

export const actionTypes = {
  GET_ORDERS_REQUEST,
  GET_ORDERS_ERROR,
  GET_ORDERS_SUCCESS,
};

//-----------------------------------
// ACTIONS
//-----------------------------------

const getOrdersRequest = createAction(GET_ORDERS_REQUEST);
const getOrdersError = createAction(GET_ORDERS_ERROR);
const getOrderSuccess = createAction(GET_ORDERS_SUCCESS);

export const actions = {
  getOrdersRequest,
  getOrdersError,
  getOrderSuccess,
};

//-----------------------------------
// REDUCER
//-----------------------------------

const initialState = fromJS({
  order: undefined,
  error: null,
  isLoading: false,
  isOpen: false,
  orders: undefined,
});

// GET ORDERS

const getOrdersHandler = (state) => state.set('error', null).set('isLoading', true);

const getOrdersErrorHandler = (state, action) =>
  state
    .set('orders', undefined)
    .set('error', action.payload)
    .set('isLoading', false);

const getOrdersSuccessHandler = (state, action) =>
  state
    .set('orders', action.payload)
    .set('error', null)
    .set('isLoading', false);

export default typeToReducer(
  {
    [GET_ORDERS_REQUEST]: getOrdersHandler,
    [GET_ORDERS_ERROR]: getOrdersErrorHandler,
    [GET_ORDERS_SUCCESS]: getOrdersSuccessHandler,
  },
  initialState
);
