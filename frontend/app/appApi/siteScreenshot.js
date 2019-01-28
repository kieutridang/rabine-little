import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 'site';

export default {
  addSiteScreenshot(params) {
    const url = `${API}/${params.siteId}/snapshot/${params.layerId}`;
    const fd = new FormData();
    fd.append('photo', params.file, `screenshot_${params.layerId}_${params.siteId}`);
    return rabineFetcher.formData(url, fd);
  },
  getSiteScreenshots(siteId) {
    const url = `${API}/${siteId}/snapshot?siteId=${siteId}`;
    return rabineFetcher.get(url);
  },
};
