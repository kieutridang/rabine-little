import { createAction } from 'redux-actions';
import typeToReducer from 'type-to-reducer';
import { fromJS } from 'immutable';

const TOGGLE_SIDE_BAR_MAP = 'TOGGLE_SIDE_BAR_MAP';

export const actionTypes = {
  TOGGLE_SIDE_BAR_MAP,
};

// ------------------------------------
// Actions
// ------------------------------------

const toggleSideBarMap = createAction(TOGGLE_SIDE_BAR_MAP);

export const actions = {
  toggleSideBarMap,
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = fromJS({
  isSideBarMapOpen: true,
  error: null,
});

const toggleSideBarMapHandler = (state) =>
   state.set('isSideBarMapOpen', !state.get('isSideBarMapOpen'));


export default typeToReducer({
  [TOGGLE_SIDE_BAR_MAP]: toggleSideBarMapHandler,
}, initialState);
