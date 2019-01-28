import { createSelector } from 'reselect';

const defaultLat = 37.3113337;
const defaultLng = -121.8735262;

const SiteDetail = (state) => state.get('siteDetail');

const IsLoadingDetail = () => createSelector(
  SiteDetail,
  (siteDetail) => siteDetail.get('isDetailLoading')
);
const DetailData = () => createSelector(
  SiteDetail,
  (siteDetail) => siteDetail.get('detailData')
);

const siteLocation = () => createSelector(
  SiteDetail,
  (siteDetail) => {
    const detail = siteDetail.get('detailData');
    if (detail && detail.location) {
      const { lat, lng } = detail.location;
      return [lat, lng];
    }

    return [defaultLat, defaultLng];
  }
);

const siteStatus = () => createSelector(
  SiteDetail,
  (siteDetail) => {
    const detail = siteDetail.get('detailData');
    return detail.status;
  }
);

const NoteContent = () => createSelector(
  SiteDetail,
  (siteDetail) => siteDetail.get('noteContent')
);

const UpdateStatusError = () => createSelector(
  SiteDetail,
  (siteDetail) => siteDetail.get('updateStatusError')
);

const ShowSiteStatusMsg = () => createSelector(
  SiteDetail,
  (siteDetail) => siteDetail.get('showSiteStatusMsg')
);

const IsOpen = () => createSelector(
  SiteDetail,
  (siteDetail) => siteDetail.get('isOpenEdit')
);

export {
  SiteDetail,
  IsLoadingDetail,
  DetailData,
  siteLocation,
  NoteContent,
  UpdateStatusError,
  ShowSiteStatusMsg,
  IsOpen,
  siteStatus,
};
