import { createSelector } from 'reselect';

const selectDronePartner = (state) => state.get('dronePartner');

const selectDronePartnerData = () => createSelector(
  selectDronePartner,
  (dronePartner) => dronePartner.get('data')
);

const selectDronePartnerList = () => createSelector(
  selectDronePartner,
  (dronePartner) => dronePartner.get('list')
);

const selectPageCount = () => createSelector(
  selectDronePartner,
  (dronePartner) => dronePartner.get('pageCount')
);

const selectItemPerPage = () => createSelector(
  selectDronePartner,
  (dronePartner) => dronePartner.get('itemPerPage')
);

const selectIsLoading = () => createSelector(
  selectDronePartner,
  (dronePartner) => dronePartner.get('isLoading')
);

const selectCurrentPage = () => createSelector(
  selectDronePartner,
  (dronePartner) => dronePartner.get('currentPage')
);

const selectSearchText = () => createSelector(
  selectDronePartner,
  (dronePatcher) => dronePatcher.get('searchText')
);

const selectError = () => createSelector(
  selectDronePartner,
  (state) => state.get('error') ? state.get('error').message : null
);

// sub

export {
  selectDronePartner,
  selectDronePartnerData,
  selectDronePartnerList,
  selectPageCount,
  selectItemPerPage,
  selectIsLoading,
  selectCurrentPage,
  selectSearchText,
  selectError,
};
