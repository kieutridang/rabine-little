import { createSelector } from 'reselect';

const selectS3Folders = (state) => state.get('s3Folders');

const makeSelectError = () => createSelector(
  selectS3Folders,
  (state) => state.get('error') ? state.get('error').message : null
);

const makeSelectS3Folders = () => createSelector(
  selectS3Folders,
  (state) => state.get('folders')
);

const makeGetLoadingState = () => createSelector(
  selectS3Folders,
  (state) => state.get('isLoading')
);

const makeGetS3SyncInfoError = () => createSelector(
  selectS3Folders,
  (state) => state.get('infoError') ? state.get('infoError').message : null
);

const makeGetS3SyncInfo = () => createSelector(
  selectS3Folders,
  (state) => state.get('s3Info')
);

const makeGetS3SyncInfoState = () => createSelector(
  selectS3Folders,
  (state) => state.get('infoIsLoading')
);

const makeSyncS3IsLoadingState = () => createSelector(
  selectS3Folders,
  (state) => state.get('syncS3IsLoading')
);

const makeGetS3Folder = () => createSelector(
  selectS3Folders,
  (state) => state.get('folder')
);

export {
  makeSelectError,
  makeSelectS3Folders,
  makeGetLoadingState,
  makeGetS3SyncInfo,
  makeGetS3SyncInfoError,
  makeGetS3SyncInfoState,
  makeGetS3Folder,
  makeSyncS3IsLoadingState,
};

