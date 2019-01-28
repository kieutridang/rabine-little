import { createSelector } from 'reselect';

const selectSiteRepairs = (state) => state.get('siteRepairs');

const makeSelectIsLoading = () =>
  createSelector(selectSiteRepairs, (state) => state.get('isLoading'));

const makeSelectIsLoadingPhotos = () =>
  createSelector(selectSiteRepairs, (state) => state.get('isLoadingPhotos'));

const makeSelectSiteRepairs = () =>
  createSelector(selectSiteRepairs, (state) => state.get('siteRepairs'));

const makeSelectSiteRepairPhotos = () =>
  createSelector(selectSiteRepairs, (state) => state.get('siteRepairPhotos'));

const makeSelectEdittingRepairId = () =>
  createSelector(selectSiteRepairs, (state) => state.get('edittingRepairId'));

const makeSelectSiteRepairError = () =>
  createSelector(selectSiteRepairs, (state) => (state.get('error') ? state.get('error').message : null));

const makeSelectAddingSiteRepair = () =>
  createSelector(selectSiteRepairs, (state) => (state.get('isAddingSiteRepair')));

const makeSelectIsOpenAddSiteRepair = () =>
  createSelector(selectSiteRepairs, (state) => (state.get('isOpenAddSiteRepair')));

const selectFeatureType = () =>
  createSelector(selectSiteRepairs, (state) => state.get('featureType'));

export {
  makeSelectIsLoading,
  makeSelectSiteRepairs,
  makeSelectEdittingRepairId,
  makeSelectSiteRepairError,
  makeSelectAddingSiteRepair,
  makeSelectIsOpenAddSiteRepair,
  makeSelectSiteRepairPhotos,
  makeSelectIsLoadingPhotos,
  selectFeatureType,
};
