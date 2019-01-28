import { createSelector } from 'reselect';

import { DetailData } from '../SiteDetail/selector';


const defaultLat = 37.3113337;
const defaultLng = -121.8735262;

const SiteMapData = (state) => state.get('siteMapData');

const isLoadingSiteMapData = () => createSelector(
  SiteMapData,
  (siteMapData) => siteMapData.get('isSiteMapDataLoading')
);
const siteMapDataContent = () => createSelector(
  SiteMapData,
  (siteMapData) => siteMapData.get('siteMapData')
);

const siteLocation = () => createSelector(
  SiteMapData,
  (siteMapData) => {
    const detail = siteMapData.get('siteMapData');

    if (detail && detail.location) {
      const { lat, lng } = detail.location;
      return [lat, lng];
    }

    return [defaultLat, defaultLng];
  }
);

const isSiteMapDataBeingSubmitted = () => createSelector(
  SiteMapData,
  (siteMapData) => siteMapData.get('isSiteMapDataBeingSubmitted')
);

const isSiteMapDataSubmittedWithError = () => createSelector(
  SiteMapData,
  (siteMapData) => siteMapData.get('isSiteMapDataSubmittedWithError')
);

const isSiteMapDataSubmittedSuccessfully = () => createSelector(
  SiteMapData,
  (siteMapData) => siteMapData.get('isSiteMapDataSubmittedSuccessfully')
);

export {
  SiteMapData,
  isLoadingSiteMapData,
  siteMapDataContent,
  siteLocation,
  isSiteMapDataBeingSubmitted,
  isSiteMapDataSubmittedWithError,
  isSiteMapDataSubmittedSuccessfully,
  DetailData,
};
