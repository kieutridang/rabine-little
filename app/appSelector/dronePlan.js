/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectDronePlan = (state) => state.get('dronePlan');

const makeSelectError = () => createSelector(
  selectDronePlan,
  (state) => state.get('error') ? state.get('error').message : null
);

const makeGetDronePlans = () => createSelector(
  selectDronePlan,
  (state) => state.get('dronePlans')
);

export {
  makeSelectError,
  makeGetDronePlans,
};
