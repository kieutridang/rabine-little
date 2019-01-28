import { createSelector } from 'reselect';

const selectSiteMetrics = (state) => state.get('siteMetrics');

const makeSelectIsLoading = () =>
  createSelector(selectSiteMetrics, (state) => state.get('isLoadingMetrics'));

const makeSelectSiteMetrics = () =>
  createSelector(selectSiteMetrics, (state) => state.get('siteMetrics'));

export {
  makeSelectIsLoading,
  makeSelectSiteMetrics,
};
