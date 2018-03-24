/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectClient = (state) => state.get('client');

const makeSelectError = () => createSelector(
  selectClient,
  (state) => state.get('error') ? state.get('error').message : null
);


const makeSelectClient = () => createSelector(
  selectClient,
  (state) => state.get('client')
);

const makeGetClients = () => createSelector(
  selectClient,
  (state) => state.get('clients')
);

const makeIsClientOpen = () => createSelector(
  selectClient,
  (state) => state.get('isOpen')
);

export {
  makeSelectError,
  makeSelectClient,
  makeIsClientOpen,
  makeGetClients,
};
