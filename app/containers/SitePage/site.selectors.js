/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectSite = (state) => state.get('site');

const makeSelectError = () => createSelector(
  selectSite,
  (state) => state.get('error') ? state.get('error').message : null
);


const makeSelectSite = () => createSelector(
  selectSite,
  (state) => state.get('site')
);

const makeGetSites = () => createSelector(
  selectSite,
  (state) => state.get('sites')
);

const makeIsSiteOpen = () => createSelector(
  selectSite,
  (state) => state.get('isOpen')
);

export {
  makeSelectError,
  makeSelectSite,
  makeIsSiteOpen,
  makeGetSites,
};
