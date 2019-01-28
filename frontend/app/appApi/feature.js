import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 'features';

export default {
  createFeature(siteId, payload) {
    return rabineFetcher.post(`site/${siteId}/map/feature`, payload);
  },

  putFeature(featureId, payload) {
    return rabineFetcher.put(`${API}/${featureId}`, payload);
  },

  deleteFeature(params) {
    const { featureId, type } = params;
    return rabineFetcher.delete(`${API}/${featureId}?type=${type}`);
  },
};
