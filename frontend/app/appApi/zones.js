import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 'site';

export default {
  getZones(params) {
    const { siteId, featureType } = params;
    const path = `${API}/${siteId}/polygon/zone?featureType=${featureType}`;
    return rabineFetcher.get(path);
  },

  getZoneOptions(params) {
    const { siteId, featureType } = params;
    const path = `${API}/${siteId}/zones?featureType=${featureType}`;
    return rabineFetcher.get(path);
  },
};
