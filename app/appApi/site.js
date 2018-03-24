import { rabineFetcher } from './fetcher/rabineFetcher';
import ObjectUtils from './fetcher/objectUtils';

const API = 'site';

export default {
  getSites({ name, clientId, dronePartnerId, status }) {
    return rabineFetcher
      .get(`${API}?${ObjectUtils.createParamString({ name, clientId, dronePartnerId, status })}`);
  },
  getSiteById(siteId) {
    return rabineFetcher.get(`${API}?siteId=${siteId}`);
  },
  createSite(site) {
    return rabineFetcher.post(`${API}`, site);
  },
};
