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

const makeIsLoadingDronePlans = () => createSelector(
  selectDronePlan,
  (state) => state.get('isLoadingDronePlans')
);

const makeSelectErrorLoadingAll = () => createSelector(
  selectDronePlan,
  (state) => state.get('errorLoadingAll') ? state.get('errorLoadingAll').message : null
);

const makeGetAllPlans = () => createSelector(
  selectDronePlan,
  (state) => state.get('allPlans')
);

export {
  makeSelectError,
  makeGetDronePlans,
  makeSelectErrorLoadingAll,
  makeIsLoadingDronePlans,
  makeGetAllPlans,
};
