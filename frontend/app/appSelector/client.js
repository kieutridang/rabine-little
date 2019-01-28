/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectClient = (state) => state.get('client');
const selectFilters = (state) => state.get('filter');

const makeSelectError = () => createSelector(
  selectClient,
  (state) => state.get('error') ? state.get('error').message : null
);


const makeSelectClient = () => createSelector(
  selectClient,
  (state) => state.get('client')
);

const makeSelectCompanyLogo = () => createSelector(
  selectClient,
  (state) => state.get('companyLogo')
);

const makeGetClients = () => createSelector(
  selectClient,
  (state) => state.get('clients')
);

const makeGetClientsWithFilters = () => createSelector(
  selectClient,
  selectFilters,
  (clientSelector, filterSelector) => {
    const clients = clientSelector.get('clients');
    const clientNameFilter = filterSelector.get('clientName');

    const filteredClients = clients
      ? clients.filter((client) => {
        const clientNameMatch = clientNameFilter ? client.name.toLowerCase().includes(clientNameFilter.toLowerCase()) : true;
        return clientNameMatch;
      })
      : clients;

    return filteredClients;
  }
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
  makeGetClientsWithFilters,
  makeSelectCompanyLogo,
};
