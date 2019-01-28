import { createSelector } from 'reselect';

const selectSitePhoto = (state) => state.get('sitePhoto');

const makeSelectIsLoading = () =>
  createSelector(selectSitePhoto, (state) => state.get('isLoading'));

const makeSelectIsAreaLoading = () =>
  createSelector(selectSitePhoto, (state) => state.get('isAreaLoading'));

const makeSelectSiteAreas = () =>
  createSelector(selectSitePhoto, (state) => state.get('areas'));

const makeSelectAreaItem = () =>
  createSelector(selectSitePhoto, (state) => state.get('areaDetail'));

const makeGetAreaPhotos = () =>
  createSelector(selectSitePhoto, (state) => state.get('areaPhotos'));

const makeGetAreaPhotoRepairs = () =>
  createSelector(selectSitePhoto, (state) => state.get('repairs'));

const makeGetAnnotationLoading = () => createSelector(selectSitePhoto, (state) => state.get('isAnnotationLoading'));
const makeGetErrorAnnotation = () => createSelector(selectSitePhoto, (state) => state.get('errorAnnotation'));
const makeGetAnnotations = () => createSelector(selectSitePhoto, (state) => state.get('annotations'));

export {
  makeSelectIsLoading,
  makeSelectSiteAreas,
  makeSelectAreaItem,
  makeGetAreaPhotos,
  makeGetAnnotationLoading,
  makeGetErrorAnnotation,
  makeGetAnnotations,
  makeSelectIsAreaLoading,
  makeGetAreaPhotoRepairs,
};
