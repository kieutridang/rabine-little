import { rabineFetcher } from './fetcher/rabineFetcher';

const API = 's3';

export default {
  getS3Folders() {
    return rabineFetcher.get(`${API}`);
  },

  getS3SyncInfo(folder) {
    return rabineFetcher.get(`${API}/info?folder=${folder}`);
  },

  syncS3Folder(request) {
    const { siteId, rabineS3Folder } = request;
    return rabineFetcher.post(`${API}/sync`, { siteId, folder: rabineS3Folder });
  },
};
