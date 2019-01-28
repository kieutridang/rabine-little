import { createSelector } from 'reselect';

const selectFeature = (state) => state.get('siteFeature');

const makeSelectIsUpdatingFeature = () =>
  createSelector(selectFeature, (state) => state.get('isUpdatingFeature'));

export { makeSelectIsUpdatingFeature };
