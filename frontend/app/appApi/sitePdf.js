import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 'site';

export default {
  async addSitePdf(params) {
    const url = `${API}/${params.siteId}/pdf`;
    const response = await fetch(params.documentUrl);
    if (response.status === 200) {
      const blob = await response.blob();
      const file = new File([blob], `pdf_${params.siteId}`);
      const fd = new FormData();
      fd.append('pdfForm', file, `pdf_${params.siteId}_${params.siteName}`);
      return rabineFetcher.formData(url, fd);
    }
    return null;
  },
  getSitePdf(params) {
    const { siteId, siteName } = params.payload;
    const url = `${API}/${siteId}/${siteName}/pdf`;
    return rabineFetcher.get(url);
  },
};
