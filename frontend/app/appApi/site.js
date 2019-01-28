import { rabineFetcher } from './fetcher/rabineFetcher';
import ObjectUtils from './fetcher/objectUtils';

const API = 'site';

export default {
  getSites({ name, clientId, dronePartnerId, status, fromDate, toDate }) {
    return rabineFetcher
      .get(`${API}?${ObjectUtils.createParamString({ name, clientId, dronePartnerId, status, fromDate, toDate })}`);
  },

  getSiteOrtho({ siteId, query }) {
    return rabineFetcher.get(`${API}/${siteId}/map/ortho?${query}`);
  },

  getSiteById(siteId) {
    return rabineFetcher.get(`${API}/${siteId}`);
  },

  createSite(site) {
    return rabineFetcher.post(`${API}`, site);
  },

  deleteSite(siteId) {
    return rabineFetcher.delete(`${API}/${siteId}`);
  },

  updateSiteStatus(siteId, payload) {
    return rabineFetcher.put(`${API}/${siteId}/activity`, payload);
  },

  updateSiteInfo(siteId, payload) {
    return rabineFetcher.put(`${API}/${siteId}`, payload);
  },

  getSiteMetrics() {
    return rabineFetcher.get('metrics');
  },
};
