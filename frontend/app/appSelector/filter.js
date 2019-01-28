import { createSelector } from 'reselect';

const getFilters = (state) => state.get('filter');

const makeSelectSiteNameFilter = () => createSelector(
  getFilters,
  (state) => state.get('siteName')
);

const makeSelectClientNameFilter = () => createSelector(
  getFilters,
  (state) => state.get('clientName')
);

const makeSelectDronePartnerNameFilter = () => createSelector(
  getFilters,
  (state) => state.get('dronePartnerName')
);

const makeSelectStatusFilter = () => createSelector(
  getFilters,
  (state) => state.get('status')
);

const makeSelectTypeFilter = () => createSelector(
  getFilters,
  (state) => state.get('type')
);

const makeSelectClientIdFilter = () => createSelector(
  getFilters,
  (state) => state.get('clientId')
);

const makeSelectStartDateFilter = () => createSelector(
  getFilters,
  (state) => state.get('startDate')
);

const makeSelectEndDateFilter = () => createSelector(
  getFilters,
  (state) => state.get('endDate')
);

export {
  makeSelectSiteNameFilter,
  makeSelectStatusFilter,
  makeSelectTypeFilter,
  makeSelectClientIdFilter,
  makeSelectStartDateFilter,
  makeSelectEndDateFilter,

  makeSelectClientNameFilter,

  makeSelectDronePartnerNameFilter,
};
