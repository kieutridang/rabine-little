import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------
const SHOW_EDIT_ORDER = 'SHOW_EDIT_ORDER';

const GET_ORDER_BY_ID_REQUEST = 'GET_ORDER_BY_ID_REQUEST';
const GET_ORDER_BY_ID_ERROR = 'GET_ORDER_BY_ID_ERROR';
const GET_ORDER_BY_ID_SUCCESS = 'GET_ORDER_BY_ID_SUCCESS';

const UPDATE_ORDER_REQUEST = 'UPDATE_ORDER_REQUEST';
const UPDATE_ORDER_ERROR = 'UPDATE_ORDER_ERROR';
const UPDATE_ORDER_SUCCESS = 'UPDATE_ORDER_SUCCESS';

const CHANGE_ORDER_NOTE = 'CHANGE_ORDER_NOTE';
const SUBMIT_ORDER_NOTE = 'SUBMIT_ORDER_NOTE';
const SUBMIT_ORDER_NOTE_SUCCESS = 'SUBMIT_ORDER_NOTE_SUCCESS';
const SUBMIT_ORDER_NOTE_FAIL = 'SUBMIT_ORDER_NOTE_FAIL';

const GET_ORDER_ACTIVITIES_REQUEST = 'GET_ORDER_ACTIVITIES_REQUEST';
const GET_ORDER_ACTIVITIES_SUCCESS = 'GET_ORDER_ACTIVITIES_SUCCESS';
const GET_ORDER_ACTIVITIES_ERROR = 'GET_ORDER_ACTIVITIES_ERROR';

export const actionTypes = {
  SHOW_EDIT_ORDER,

  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_ERROR,
  GET_ORDER_BY_ID_SUCCESS,

  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_ERROR,
  UPDATE_ORDER_SUCCESS,

  CHANGE_ORDER_NOTE,
  SUBMIT_ORDER_NOTE,
  SUBMIT_ORDER_NOTE_SUCCESS,
  SUBMIT_ORDER_NOTE_FAIL,

  GET_ORDER_ACTIVITIES_REQUEST,
  GET_ORDER_ACTIVITIES_SUCCESS,
  GET_ORDER_ACTIVITIES_ERROR,
};

// ------------------------------------
// Actions
// ------------------------------------
const showEditOrder = createAction(SHOW_EDIT_ORDER);

const getOrderByIdRequest = createAction(GET_ORDER_BY_ID_REQUEST);
const getOrderByIdError = createAction(GET_ORDER_BY_ID_ERROR);
const getOrderByIdSuccess = createAction(GET_ORDER_BY_ID_SUCCESS);

const updateOrderRequest = createAction(UPDATE_ORDER_REQUEST);
const updateOrderError = createAction(UPDATE_ORDER_ERROR);
const updateOrderSuccess = createAction(UPDATE_ORDER_SUCCESS);

const changeOrderNote = createAction(CHANGE_ORDER_NOTE);
const submitOrderNote = createAction(SUBMIT_ORDER_NOTE);
const submitOrderNoteSuccess = createAction(SUBMIT_ORDER_NOTE_SUCCESS);
const submitOrderNoteFail = createAction(SUBMIT_ORDER_NOTE_FAIL);

const getOrderActivities = createAction(GET_ORDER_ACTIVITIES_REQUEST);
const getOrderActivitiesSuccess = createAction(GET_ORDER_ACTIVITIES_SUCCESS);
const getOrderActivitiesError = createAction(GET_ORDER_ACTIVITIES_ERROR);

export const actions = {
  showEditOrder,

  getOrderByIdRequest,
  getOrderByIdError,
  getOrderByIdSuccess,

  updateOrderRequest,
  updateOrderError,
  updateOrderSuccess,

  changeOrderNote,
  submitOrderNote,
  submitOrderNoteSuccess,
  submitOrderNoteFail,

  getOrderActivities,
  getOrderActivitiesSuccess,
  getOrderActivitiesError,
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  isOpenEdit: false,
  order: undefined,
  isLoading: false,
  isEditting: false,
  error: null,

  orderNoteContent: '',
  isOrderNoteSubmitting: false,
  submitOrderNoteError: null,

  isOrderActivitiesLoading: false,
  orderActivities: undefined,
  errorLoadingActivities: false,
});

const showEditOrderHandler = (state, action) => state.set('isOpenEdit', action.payload || !state.get('isOpenEdit'));

const getOrderByIdHandler = (state) => state.set('error', null).set('isLoading', true);

const getOrderByIdErrorHandler = (state, action) =>
  state
    .set('order', undefined)
    .set('error', action.payload)
    .set('isLoading', false);

const getOrderByIdSuccessHandler = (state, action) =>
  state
    .set('order', action.payload)
    .set('error', null)
    .set('isLoading', false);

const updateOrderHandler = (state) =>
  state
    .set('isEditting', true)
    .set('error', null);

const updateOrderErrorHandler = (state = initialState, action) =>
  state
    .set('isEditting', false)
    .set('error', action.payload);

const updateOrderSuccessHandler = (state, action) =>
  state
    .set('order', action.payload)
    .set('isEditting', false)
    .set('error', null);

const changeOrderNoteHandler = (state, action) =>
  state
   .set('orderNoteContent', action.payload);

const submitOrderNoteHandler = (state) =>
  state
    .set('isOrderNoteSubmitting', true)
    .set('submitOrderNoteError', null);

const submitOrderNoteSuccessHandler = (state) =>
  state
    .set('isOrderNoteSubmitting', false)
    .set('submitOrderNoteError', null);

const submitOrderNoteFailHandler = (state, action) =>
  state
    .set('isOrderNoteSubmitting', false)
    .set('submitOrderNoteError', action.payload);

// get order activities
const getOrderActivitiesHandler = (state) =>
  state
    .set('errorLoadingActivities', null)
    .set('isOrderActivitiesLoading', true);

const getOrderActivitiesErrorHandler = (state, action) =>
  state
    .set('errorLoadingActivities', action.payload)
    .set('isOrderActivitiesLoading', false);

const getOrderActivitiesSuccessHandler = (state, action) =>
  state
    .set('orderActivities', action.payload)
    .set('errorLoadingActivities', null)
    .set('isOrderActivitiesLoading', false);

export default typeToReducer(
  {
    [SHOW_EDIT_ORDER]: showEditOrderHandler,

    [GET_ORDER_BY_ID_REQUEST]: getOrderByIdHandler,
    [GET_ORDER_BY_ID_ERROR]: getOrderByIdErrorHandler,
    [GET_ORDER_BY_ID_SUCCESS]: getOrderByIdSuccessHandler,

    [UPDATE_ORDER_REQUEST]: updateOrderHandler,
    [UPDATE_ORDER_ERROR]: updateOrderErrorHandler,
    [UPDATE_ORDER_SUCCESS]: updateOrderSuccessHandler,

    [CHANGE_ORDER_NOTE]: changeOrderNoteHandler,
    [SUBMIT_ORDER_NOTE]: submitOrderNoteHandler,
    [SUBMIT_ORDER_NOTE_SUCCESS]: submitOrderNoteSuccessHandler,
    [SUBMIT_ORDER_NOTE_FAIL]: submitOrderNoteFailHandler,

    [GET_ORDER_ACTIVITIES_REQUEST]: getOrderActivitiesHandler,
    [GET_ORDER_ACTIVITIES_ERROR]: getOrderActivitiesErrorHandler,
    [GET_ORDER_ACTIVITIES_SUCCESS]: getOrderActivitiesSuccessHandler,
  },
  initialState
);
