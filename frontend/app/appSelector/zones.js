import { createSelector } from 'reselect';

const selectZones = (state) => state.get('zones');

const makeSelectIsLoading = () =>
  createSelector(selectZones, (state) => state.get('isLoading'));

const makeSelectZones = () =>
  createSelector(selectZones, (state) => state.get('zones'));

const makeSelectZoneOptions = () =>
  createSelector(selectZones, (state) => state.get('zoneOptions'));

export {
  makeSelectIsLoading,
  makeSelectZones,
  makeSelectZoneOptions,
};
