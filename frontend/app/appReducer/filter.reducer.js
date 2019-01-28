import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------
const SET_SITE_NAME_FILTER = 'SET_NAME_FILTER';
const SET_SITE_TYPE_FILTER = 'SET_SITE_TYPE_FILTER';
const SET_SITE_STATUS_FILTER = 'SET_SITE_STATUS_FILTER';
const SET_SITE_CLIENT_FILTER = 'SET_SITE_CLIENT_FILTER';
const SET_START_DATE = 'SET_START_DATE';
const SET_END_DATE = 'SET_END_DATE';
const SET_CLIENT_NAME_FILTER = 'SET_CLIENT_NAME_FILTER';
const SET_DRONE_PARTNER_NAME_FILTER = 'SET_DRONE_PARTNER_NAME_FILTER';
const SET_DRONE_PARTNER_ID_FILTER = 'SET_DRONE_PARTNER_ID_FILTER';

export const actionTypes = {
  SET_SITE_NAME_FILTER,
  SET_SITE_TYPE_FILTER,
  SET_SITE_STATUS_FILTER,
  SET_SITE_CLIENT_FILTER,
  SET_START_DATE,
  SET_END_DATE,
  SET_CLIENT_NAME_FILTER,
  SET_DRONE_PARTNER_NAME_FILTER,
  SET_DRONE_PARTNER_ID_FILTER,
};

// ------------------------------------
// Actions
// ------------------------------------
const setSiteNameFilter = createAction(SET_SITE_NAME_FILTER);
const setSiteTypeFilter = createAction(SET_SITE_TYPE_FILTER);
const setSiteStatusFilter = createAction(SET_SITE_STATUS_FILTER);
const setSiteClientFilter = createAction(SET_SITE_CLIENT_FILTER);
const setStartDateFilter = createAction(SET_START_DATE);
const setEndDateFilter = createAction(SET_END_DATE);
const setClientNameFilter = createAction(SET_CLIENT_NAME_FILTER);
const setDronePartnerNameFilter = createAction(SET_DRONE_PARTNER_NAME_FILTER);
const setDronePartnerIdFilter = createAction(SET_DRONE_PARTNER_ID_FILTER);

export const actions = {
  setSiteNameFilter,
  setSiteTypeFilter,
  setSiteStatusFilter,
  setSiteClientFilter,
  setStartDateFilter,
  setEndDateFilter,
  setClientNameFilter,
  setDronePartnerNameFilter,
  setDronePartnerIdFilter,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  siteName: '',
  type: null,
  status: null,
  clientId: null,
  startDate: null,
  endDate: null,
  clientName: '',
  dronePartnerName: '',
  dronePartnerId: null,
});

const setSiteNameFilterHandler = (state, action) => state.set('siteName', action.payload);
const setSiteTypeFilterHandler = (state, action) => state.set('type', action.payload);
const setSiteStatusFilterHandler = (state, action) => state.set('status', action.payload);
const setSiteClientFilterHandler = (state, action) => state.set('clientId', action.payload);
const setStartDateFilterHandler = (state, action) => state.set('startDate', action.payload);
const setEndDateFilterHandler = (state, action) => state.set('endDate', action.payload);
const setClientNameFilterHandler = (state, action) => state.set('clientName', action.payload);
const setDronePartnerNameFilterHandler = (state, action) => state.set('dronePartnerName', action.payload);
const setDronePartnerIdFilterHandler = (state, action) => state.set('dronePartnerId', action.payload);

export default typeToReducer({
  [SET_SITE_NAME_FILTER]: setSiteNameFilterHandler,
  [SET_SITE_TYPE_FILTER]: setSiteTypeFilterHandler,
  [SET_SITE_STATUS_FILTER]: setSiteStatusFilterHandler,
  [SET_SITE_CLIENT_FILTER]: setSiteClientFilterHandler,
  [SET_START_DATE]: setStartDateFilterHandler,
  [SET_END_DATE]: setEndDateFilterHandler,
  [SET_CLIENT_NAME_FILTER]: setClientNameFilterHandler,
  [SET_DRONE_PARTNER_NAME_FILTER]: setDronePartnerNameFilterHandler,
  [SET_DRONE_PARTNER_ID_FILTER]: setDronePartnerIdFilterHandler,
}, initialState);
