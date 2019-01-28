import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------

const GET_REPAIRS_REQUEST = 'GET_REPAIRS_REQUEST';
const GET_REPAIRS_REQUEST_SUCCESS = 'GET_REPAIRS_REQUEST_SUCCESS';
const GET_REPAIRS_REQUEST_FAILED = 'GET_REPAIRS_REQUEST_FAILED';
const SET_REPAIRS_UNIT_PRICE = 'SET_REPAIRS_UNIT_PRICE';
const CALCULATE_REPAIRS_TOTAL = 'CALCULATE_REPAIRS_TOTAL';

export const actionTypes = {
  GET_REPAIRS_REQUEST,
  GET_REPAIRS_REQUEST_SUCCESS,
  GET_REPAIRS_REQUEST_FAILED,
  SET_REPAIRS_UNIT_PRICE,
  CALCULATE_REPAIRS_TOTAL,
};

// ------------------------------------
// Actions
// ------------------------------------

const getRepairsRequest = createAction(GET_REPAIRS_REQUEST);
const getRepairsRequestSuccess = createAction(GET_REPAIRS_REQUEST_SUCCESS);
const getRepairsRequestFailed = createAction(GET_REPAIRS_REQUEST_FAILED);
const setRepairsUnitPrice = createAction(SET_REPAIRS_UNIT_PRICE);
const calculateRepairsTotal = createAction(CALCULATE_REPAIRS_TOTAL);

export const actions = {
  getRepairsRequest,
  getRepairsRequestSuccess,
  getRepairsRequestFailed,
  setRepairsUnitPrice,
  calculateRepairsTotal,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  error: null,
  repairs: undefined,
});

// Get repairs

const getRepairsHandler = (state) =>
  state.set('repairs', null);

const getRepairsSuccessHandler = (state, action) =>
  state.set('repairs', action.payload).set('error', null);

const getRepairsFailedHandler = (state = initialState, action) =>
  state.set('error', action.payload);

const setRepairsUnitPriceHandler = (state, action) => {
  const { payload } = action;
  const { id, unitPrice } = payload;
  const repairs = [...state.get('repairs')];
  const foundIndex = repairs.findIndex((repair) => repair.id === id);
  if (foundIndex !== -1) {
    repairs[foundIndex] = { ...repairs[foundIndex], unitPrice };
  }

  return state.set('repairs', repairs);
};

const calculateRepairsTotalHandler = (state) => {
  const data = [...state.get('repairs')];
  const repairs = data.map((repair) => {
    const { unitPrice, qty } = repair;
    return unitPrice && qty ? { ...repair, total: qty * unitPrice } : repair;
  });
  return state.set('repairs', repairs);
};

export default typeToReducer({
  [GET_REPAIRS_REQUEST]: getRepairsHandler,
  [GET_REPAIRS_REQUEST_SUCCESS]: getRepairsSuccessHandler,
  [GET_REPAIRS_REQUEST_FAILED]: getRepairsFailedHandler,
  [SET_REPAIRS_UNIT_PRICE]: setRepairsUnitPriceHandler,
  [CALCULATE_REPAIRS_TOTAL]: calculateRepairsTotalHandler,
}, initialState);
