import { createSelector } from 'reselect';

const SiteDetail = (state) => state.get('siteDetail');

const IsLoadingDetail = () => createSelector(
  SiteDetail,
  (siteDetail) => siteDetail.get('isDetailLoading')
);
const DetailData = () => createSelector(
  SiteDetail,
  (siteDetail) => siteDetail.get('detailData')
);

export {
  SiteDetail,
  IsLoadingDetail,
  DetailData,
};
