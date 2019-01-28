import { rabineFetcher, getFileDownloadUrl } from './fetcher/rabineFetcher';

const API = 'site';

export default {
  getRepairs() {
    return rabineFetcher.get('repairs');
  },
  getSiteRepairs(params) {
    const { siteId, featureType } = params;
    const path = `${API}/${siteId}/polygon/repairs?featureType=${featureType}`;
    return rabineFetcher.get(path);
  },
  getDownloadRepairsUrl({ siteId, type }) {
    return getFileDownloadUrl(`${API}/${siteId}/polygon/${type}/export`);
  },
  getDownloadRepairsBySiteIdsUrl(siteIds) {
    const ids = `[${siteIds.map((id) => `"${id}"`).join(',')}]`;
    return getFileDownloadUrl(`${API}/exportBySiteIds?siteIds=${encodeURIComponent(ids)}`);
  },
  downloadRepairFile(url) {
    return rabineFetcher.blob(url);
  },
  getDownloadZonesBySiteIdsUrl(siteIds) {
    const ids = `[${siteIds.map((id) => `"${id}"`).join(',')}]`;
    return getFileDownloadUrl(`${API}/exportZonesBySiteIds?siteIds=${encodeURIComponent(ids)}`);
  },
  downloadZonesFile(url) {
    return rabineFetcher.blob(url);
  },
  updateUnitPrice(payload) {
    return rabineFetcher.post('repair/price', payload);
  },
  addSiteRepair(payload) {
    return rabineFetcher.post('site/repair', payload);
  },
  deleteSiteRepair(repairId) {
    return rabineFetcher.delete(`site/repair/${repairId}`);
  },
  getSiteRepairPhotos(repairId) {
    return rabineFetcher.get(`repairs/${repairId}/photos`);
  },
};
