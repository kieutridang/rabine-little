import { createSelector } from 'reselect';

const getAreaVideos = (state) => state.get('video');

const makeSelectAreaVideos = () => createSelector(
  getAreaVideos,
  (state) => state.get('areaVideos')
);

const makeIsLoadingAreaVideos = () => createSelector(
  getAreaVideos,
  (state) => state.get('isLoading')
);


export {
  makeSelectAreaVideos,
  makeIsLoadingAreaVideos,
};
