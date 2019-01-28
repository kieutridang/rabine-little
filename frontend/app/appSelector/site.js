/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import moment from 'moment';

const selectSite = (state) => state.get('site');
const selectFilters = (state) => state.get('filter');

const makeSelectError = () =>
  createSelector(selectSite, (state) => (state.get('error') ? state.get('error').message : null));

const makeSelectSite = () => createSelector(selectSite, (state) => state.get('site'));

const makeGetSites = () => createSelector(selectSite, (state) => state.get('sites'));

const makeGetSiteOrtho = () => createSelector(selectSite, (state) => state.get('siteOrtho'));

// this function to prevent null value in site data when filtering
const equalMatch = (value, filter) => {
  if (value && filter) {
    return value.toLowerCase() === filter.toLowerCase();
  } else if (!value) {
    return false;
  }

  return true;
};

const makeGetSitesWithFilters = () =>
  createSelector(selectSite, selectFilters, (siteSelector, filterSelector) => {
    const sites = siteSelector.get('sites');
    const siteNameFilter = filterSelector.get('siteName');
    const startDateFilter = filterSelector.get('startDate');
    const endDateFilter = filterSelector.get('endDate');

    const clientIdFilter = filterSelector.get('clientId');
    const typeFilter = filterSelector.get('type');
    const statusFilter = filterSelector.get('status');

    const filteredSites = sites
      ? sites.filter((site) => {
        const deadline = moment(site.deadline);
        const siteNameMatch =
            siteNameFilter && site.name ? site.name.toLowerCase().includes(siteNameFilter.toLowerCase()) : true;
        const siteAddressMatch =
            siteNameFilter && site.address ? site.address.toLowerCase().includes(siteNameFilter.toLowerCase()) : true;
        const startDateMatch = startDateFilter && deadline ? startDateFilter.isSameOrBefore(deadline, 'day') : true;
        const endDateMatch = endDateFilter && deadline ? endDateFilter.isSameOrAfter(deadline, 'day') : true;

        const clientIdMatch = equalMatch(site.clientId, clientIdFilter);
        const typeMatch = equalMatch(site.type, typeFilter);
        const statusMatch = equalMatch(site.status, statusFilter);

        return (siteNameMatch || siteAddressMatch)
          && startDateMatch
          && endDateMatch
          && clientIdMatch
          && typeMatch
          && statusMatch;
      })
      : sites;

    return filteredSites;
  });

const makeGetLoadingState = () => createSelector(selectSite, (state) => state.get('isLoading'));

const makeGetIsEdittingState = () => createSelector(selectSite, (state) => state.get('isEditting'));

const makeIsSiteOpen = () => createSelector(selectSite, (state) => state.get('isOpen'));

export {
  makeSelectError,
  makeSelectSite,
  makeIsSiteOpen,
  makeGetSites,
  makeGetLoadingState,
  makeGetSitesWithFilters,
  makeGetSiteOrtho,
  makeGetIsEdittingState,
};
